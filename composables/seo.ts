export const useSEO = (options: {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}) => {
  const config = useRuntimeConfig();
  const siteUrl = 'https://ababil.is-not-a.dev'; // Ganti dengan domain Anda
  
  const defaults = {
    title: 'Ababil Mustaqim - Backend Developer From Bandung',
    description: 'Ababil Mustaqim adalah seorang backend developer profesional dari Bandung, berpengalaman dalam membangun sistem backend yang scalable, aman, dan efisien.',
    keywords: 'backend developer, python, django, flask, nodejs, postgresql, vue, nuxt, rest api, bandung, indonesia',
    image: `${siteUrl}/og-image.svg`,
    url: siteUrl,
    type: 'website'
  };

  const seoData = { ...defaults, ...options };

  useHead({
    title: seoData.title,
    meta: [
      { name: 'description', content: seoData.description },
      { name: 'keywords', content: seoData.keywords },
      { property: 'og:title', content: seoData.title },
      { property: 'og:description', content: seoData.description },
      { property: 'og:type', content: seoData.type },
      { property: 'og:url', content: seoData.url },
      { property: 'og:image', content: seoData.image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoData.title },
      { name: 'twitter:description', content: seoData.description },
      { name: 'twitter:image', content: seoData.image }
    ],
    link: [
      { rel: 'canonical', href: seoData.url }
    ]
  });

  return seoData;
};
