const API_URL = 'https://my-portfolio-api-8db1bddf3195.herokuapp.com'; // Your FastAPI backend URL

export interface Education {
  id?: number;
  degree: string;
  field: string;
  institution: string;
  period: string;
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
      const response = await fetch(`${API_URL}/education`);
      if (!response.ok) {
        throw new Error('Failed to fetch education data');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch education data');
    }
  },

  async getExperiences(): Promise<Experience[]> {
    try {
      const response = await fetch(`${API_URL}/experiences`);
      if (!response.ok) {
        throw new Error('Failed to fetch experiences data');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch experiences data');
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects data');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch projects data');
    }
  },

  async getSkills(): Promise<SkillsData> {
    try {
      const response = await fetch(`${API_URL}/skills`);
      if (!response.ok) {
        throw new Error('Failed to fetch skills data');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch skills data');
    }
  }
};

function fetchDataPeriodically(fetchFunction: () => Promise<any>, interval: number) {
  fetchFunction();
  setInterval(fetchFunction, interval);
}

fetchDataPeriodically(api.getEducation, 120000);
fetchDataPeriodically(api.getExperiences, 120000);
fetchDataPeriodically(api.getProjects, 120000);
fetchDataPeriodically(api.getSkills, 120000);
