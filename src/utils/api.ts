// Reusable API fetch utility function
export async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle the case where the API response might not be an array when expected
    if (Array.isArray(fallback) && !Array.isArray(data)) {
      console.error(`API response for ${endpoint} is not an array:`, data);
      return fallback;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error);
    return fallback;
  }
}