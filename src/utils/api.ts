export async function fetchData<T>(endpoint: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`https://bil.selera-rasa-sunda.id/api/${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
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