import axios from 'axios';

export default defineEventHandler(async (event) => {
  try {
    // Get this from your environment variables
    const apiKey = process.env.WAKATIME_API_KEY;
    
    if (!apiKey) {
      throw new Error('WakaTime API key is not configured');
    }

    const username = 'birdfromhell'; // Your WakaTime username
    
    const response = await axios.get(
      `https://wakatime.com/api/v1/users/${username}/stats/last_30_days`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching WakaTime data:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch WakaTime statistics'
    });
  }
});