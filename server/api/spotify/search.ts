export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchQuery = query.q as string

    if (!searchQuery) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query is required'
      })
    }

    const response = await $fetch(`https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5&q=${encodeURIComponent(searchQuery)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'fe7ac125c5msh94f9c196609b1eep12fb18jsndc6f9e5920c3',
        'x-rapidapi-host': 'spotify23.p.rapidapi.com'
      }
    }) as any

    // Transform the response to match our custom track format
    const tracks = response?.tracks?.items || []
    const transformedTracks = tracks.map((track: any) => {
      const trackData = track.data || {}
      const artists = trackData.artists?.items || []
      const album = trackData.albumOfTrack || {}
      const coverArt = album.coverArt?.sources || []
      
      return {
        id: trackData.id || '',
        title: trackData.name || '',
        artist: artists.length > 0 ? artists[0].profile?.name || '' : '',
        album: album.name || '',
        albumImageUrl: coverArt.length > 0 ? coverArt[0].url || '' : '',
        songUrl: trackData.external_urls?.spotify || '',
        duration: trackData.duration?.totalTime ? Math.floor(trackData.duration.totalTime / 1000) : 180,
        previewUrl: trackData.preview_url || ''
      }
    })

    return {
      success: true,
      tracks: transformedTracks
    }

  } catch (error: any) {
    console.error('Error searching tracks:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search tracks'
    })
  }
})
