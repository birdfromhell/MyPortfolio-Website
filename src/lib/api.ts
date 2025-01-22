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

class WebSocketClient {
  private socket: WebSocket;
  private listeners: { [event: string]: Function[] } = {};

  constructor(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.listeners[data.event]) {
        this.listeners[data.event].forEach((callback) => callback(data.payload));
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.warn('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connect(url), 1000);
    };
  }

  private connect(url: string) {
    this.socket = new WebSocket(url);
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
}

const wsClient = new WebSocketClient('wss://my-portfolio-api-8db1bddf3195.herokuapp.com/ws');

export const api = {
  async getEducation(): Promise<Education[]> {
    return new Promise((resolve, reject) => {
      wsClient.on('education', (data: Education[]) => {
        resolve(data);
      });

      wsClient.on('error', (error: any) => {
        reject(new Error('Failed to fetch education data'));
      });
    });
  },

  async getExperiences(): Promise<Experience[]> {
    return new Promise((resolve, reject) => {
      wsClient.on('experiences', (data: Experience[]) => {
        resolve(data);
      });

      wsClient.on('error', (error: any) => {
        reject(new Error('Failed to fetch experiences data'));
      });
    });
  },

  async getProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      wsClient.on('projects', (data: Project[]) => {
        resolve(data);
      });

      wsClient.on('error', (error: any) => {
        reject(new Error('Failed to fetch projects data'));
      });
    });
  },

  async getSkills(): Promise<SkillsData> {
    return new Promise((resolve, reject) => {
      wsClient.on('skills', (data: SkillsData) => {
        resolve(data);
      });

      wsClient.on('error', (error: any) => {
        reject(new Error('Failed to fetch skills data'));
      });
    });
  }
};
