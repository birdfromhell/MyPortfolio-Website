import { defineEventHandler } from 'h3';
import { useStorage } from 'nitropack/runtime';

// Update these with your Spotify application credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// Storage for caching token
const tokenStorage = useStorage('spotify');

export default defineEventHandler(async (event) => {
  try {
    // Get access token (from cache or generate new one)
    let accessToken = await tokenStorage.getItem('access_token');
    let tokenExpiry = await tokenStorage.getItem('token_expiry');
    
    // Check if token is expired or not available
    if (!accessToken || !tokenExpiry || Date.now() > Number(tokenExpiry)) {
      console.log('Getting new access token...');
      // Get new access token using refresh token
      interface SpotifyTokenResponse {
        access_token: string;
        token_type: string;
        expires_in: number;
        scope?: string;
        refresh_token?: string;
      }

      const tokenResponse = await $fetch<SpotifyTokenResponse>('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: REFRESH_TOKEN || ''
        }).toString()
      });
      
      accessToken = tokenResponse.access_token;
      
      // Cache the token for future requests
      await tokenStorage.setItem('access_token', accessToken);
      await tokenStorage.setItem('token_expiry', Date.now() + (tokenResponse.expires_in * 1000));
    }
    
    // Fetch currently playing track with proper error handling
    try {
      // Define the expected response type for the currently playing endpoint
      interface SpotifyCurrentlyPlayingResponse {
        item?: {
          name: string;
          artists: { name: string }[];
          album: {
            name: string;
            images: { url: string }[];
            [key: string]: any;
          };
          external_urls: { spotify: string };
          duration_ms: number;
          [key: string]: any;
        };
        is_playing: boolean;
        progress_ms: number;
        [key: string]: any;
      }
      
            const response = await $fetch<SpotifyCurrentlyPlayingResponse>('https://api.spotify.com/v1/me/player/currently-playing', {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });
            
            // If we got a response, Spotify is playing something
            if (response && response.item) {
              // Extract song data
              const songData = {
                isPlaying: response.is_playing,
                songUrl: response.item.external_urls.spotify,
                title: response.item.name,
                artist: response.item.artists.map((artist: any) => artist.name).join(', '),
                album: response.item.album.name,
                albumImageUrl: response.item.album.images[0]?.url,
                progress: response.progress_ms,
                duration: response.item.duration_ms
              };
              
              return songData;
            } else {
              // No track playing
              return {
                isPlaying: false
              };
            }
    } catch (fetchError: any) {
      // Handle 204 No Content or other API-specific errors
      if (fetchError.response?.status === 204) {
        return {
          isPlaying: false
        };
      }
      
      // Other API errors
      console.error('Spotify API error:', fetchError.message);
      return { 
        error: 'Spotify API error',
        isPlaying: false 
      };
    }
    
  } catch (error: any) {
    console.error('General error in Spotify API handler:', error);
    return { 
      error: 'Failed to fetch Spotify data', 
      message: error.message,
      isPlaying: false
    };
  }
});