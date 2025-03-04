const API_URL = 'http://127.0.0.1:5000/api'; // Your FastAPI backend URL

export interface Education {
  id?: number;
  degree: string;
  field?: string;        // Make this optional since it might not be in new response
  institution: string;
  period: string;
  description: string;   // Add this new field from backend response
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Project {
  id?: number;
  title: string;
  desc: string;
  preview?: string;
  github?: string;
  image?: string;
}

export interface SkillsData {
  language: string[];
  backend: string[];
  tools: string[];
  platform: string[];
}

export const api = {
  async getEducation(): Promise<Education[]> {
    try {
      console.log('Fetching education data...');
      const response = await fetch(`${API_URL}/education`);
      if (!response.ok) {
        console.error(`Failed to fetch education data: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch education data: ${response.status}`);
      }
      const data = await response.json();
      console.log('Education data fetched successfully:', data);
      return data;
    } catch (error) {
      console.error("Education fetch error:", error);
      // Return empty array instead of throwing to prevent unhandled rejections
      return [];
    }
  },

  async getExperiences(): Promise<Experience[]> {
    try {
      console.log('Fetching experiences data...');
      const response = await fetch(`${API_URL}/experiences`);
      if (!response.ok) {
        console.error(`Failed to fetch experiences data: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch experiences data: ${response.status}`);
      }
      const data = await response.json();
      console.log('Experiences data fetched successfully');
      return data;
    } catch (error) {
      console.error("Experiences fetch error:", error);
      // Return empty array instead of throwing
      return [];
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      console.log('Fetching projects data...');
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        console.error(`Failed to fetch projects data: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch projects data: ${response.status}`);
      }
      const data = await response.json();
      console.log('Projects data fetched successfully');
      return data;
    } catch (error) {
      console.error("Projects fetch error:", error);
      // Return empty array instead of throwing
      return [];
    }
  },

  async getSkills(): Promise<SkillsData> {
    try {
      console.log('Fetching skills data...');
      const response = await fetch(`${API_URL}/skills`);
      if (!response.ok) {
        console.error(`Failed to fetch skills data: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch skills data: ${response.status}`);
      }
      const data = await response.json();
      console.log('Skills data fetched successfully');
      return data;
    } catch (error) {
      console.error("Skills fetch error:", error);
      // Return default empty object instead of throwing
      return {
        language: [],
        backend: [],
        tools: [],
        platform: []
      };
    }
  }
};