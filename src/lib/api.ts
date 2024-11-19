// src/lib/api.ts

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
    const response = await fetch(`${API_URL}/education`);
    if (!response.ok) throw new Error('Failed to fetch education data');
    return response.json();
  },

  async getExperiences(): Promise<Experience[]> {
    const response = await fetch(`${API_URL}/experiences`);
    if (!response.ok) throw new Error('Failed to fetch experiences data');
    return response.json();
  },

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects data');
    return response.json();
  },
  async getSkills(): Promise<SkillsData> {
    const response = await fetch(`${API_URL}/skills`);
    if (!response.ok) throw new Error('Failed to fetch skills data');
    return response.json();
  }
};