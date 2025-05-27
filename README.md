# Portfolio Website | Ababil Mustaqim

A modern, responsive portfolio website built with Nuxt 3 to showcase my projects, skills, and experience as a Backend Developer from Bandung, Indonesia.

<div align="center">
  <img src="https://img.shields.io/badge/Nuxt-3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt 3" />
  <img src="https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

![Portfolio Screenshot](/public/img/portfolio-preview.png)

## 🚀 Live Demo

Visit the live portfolio at: [https://ababil.is-not-a.dev](https://ababil.is-not-a.dev)

## ✨ Features

- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Mode** - Toggle between light and dark themes
- **Multilingual** - Support for English and Indonesian languages
- **Project Showcase** - Filterable project portfolio with tech stack tags
- **Spotify Integration** - Real-time display of currently playing track
- **GitHub Activity** - Visual contribution graph and stats
- **Skills & Experience** - Organized display of technical skills and work history
- **SEO Optimized** - Meta tags and structured data for better search engine visibility
- **Content Management** - Powered by Nuxt Content for easy updates

## 🛠️ Tech Stack

- **[Nuxt.js 3](https://nuxt.com/)** - Vue framework with SSR capabilities
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[Nuxt UI](https://ui.nuxt.com/)** - UI component library
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript
- **[Nuxt Content](https://content.nuxtjs.org/)** - Content management system
- **[i18n](https://i18n.nuxtjs.org/)** - Internationalization for multiple languages
- **[Tabler Icons](https://tabler.io/icons)** - Customizable icons

## 📦 Project Structure

```
├── assets/          # Static assets like CSS, images
├── components/      # Vue components
├── composables/     # Reusable Vue composition functions
├── content/         # Markdown content (projects, skills, etc.)
├── layouts/         # Page layouts
├── pages/           # Application pages and routes
├── public/          # Public static files
├── server/          # API endpoints
└── utils/           # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/birdfromhell/MyPortfolio-Website.git
   cd MyPortfolio-Website
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your API keys:

   ```
   GITHUB_TOKEN=your_github_token
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Adding Content

### Projects

Add new projects by creating markdown files in the `content/projects/` directory:

```markdown
---
name: Project Name
link: "https://project-url.com"
repo_link: "https://github.com/username/project"
date: "2023"
image: project-image
imageExt: png
technos:
  - Tech1
  - Tech2
type:
  - web
  - featured
content:
  en: English description of the project
  id: Indonesian description of the project
---
```

## 🔄 API Integration

### GitHub Contributions

The GitHub activity graph uses the GitHub GraphQL API to fetch contribution data. You'll need a GitHub Personal Access Token with the `read:user` scope.

### Spotify Now Playing

The Spotify integration displays your currently playing track using the Spotify Web API. You'll need to generate the necessary tokens by following [Spotify's authentication guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/).

## 📱 Mobile Optimization

The site is fully responsive with specific optimizations for mobile devices:

- Adjusted layouts and spacing for smaller screens
- Touch-friendly navigation
- Performance optimizations for faster loading on mobile networks

## 🌐 Deployment

This project is configured to deploy on Vercel. Simply connect your GitHub repository to your Vercel account and set the environment variables.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 📧 Contact

Feel free to reach out to me at ababilmustaqim@proton.me or connect on [LinkedIn](https://www.linkedin.com/in/ababil-mustaqim/).
