<script setup lang="ts">
const seoTitle = "Ababil Mustaqim - Backend Developer From Bandung";
const seoDescription =
  "Ababil Mustaqim adalah seorang backend developer profesional dari Bandung, berpengalaman dalam membangun sistem backend yang scalable, aman, dan efisien. Temukan portofolio, proyek, dan keahlian teknologi terbaru di sini.";
const siteUrl = "https://ababil.is-not-a.dev"; // Ganti dengan domain Anda
const ogImageUrl = `${siteUrl}/og-image.svg`;

useHead({
  title: seoTitle,
  meta: [
    // Basic Meta Tags
    { name: "description", content: seoDescription },
    {
      name: "keywords",
      content:
        "backend developer, python, django, flask, nodejs, postgresql, vue, nuxt, rest api, bandung, indonesia",
    },
    { name: "author", content: "Ababil Mustaqim" },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },

    // Open Graph Meta Tags
    { property: "og:title", content: seoTitle },
    { property: "og:description", content: seoDescription },
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Ababil Mustaqim - Backend Developer Portfolio",
    },
    { property: "og:locale", content: "en_US" },
    { property: "og:locale:alternate", content: "id_ID" },
    { property: "og:site_name", content: "Ababil Mustaqim Portfolio" },

    // Twitter Meta Tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seoTitle },
    { name: "twitter:description", content: seoDescription },
    { name: "twitter:image", content: ogImageUrl },
    {
      name: "twitter:image:alt",
      content: "Ababil Mustaqim - Backend Developer Portfolio",
    },

    // Additional Meta Tags
    { name: "theme-color", content: "#0f172a" },
    { name: "msapplication-TileColor", content: "#0f172a" },
    { name: "application-name", content: "Ababil Mustaqim Portfolio" },
    { name: "apple-mobile-web-app-title", content: "Ababil Mustaqim" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },

    // Geo Meta Tags
    { name: "geo.region", content: "ID-JB" },
    { name: "geo.placename", content: "Bandung" },
    { name: "geo.position", content: "-6.9175;107.6191" },
    { name: "ICBM", content: "-6.9175, 107.6191" },
  ],
  link: [
    { rel: "canonical", href: siteUrl },
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    { rel: "manifest", href: "/manifest.json" },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Ababil Mustaqim",
        jobTitle: "Backend Developer",
        description: seoDescription,
        url: siteUrl,
        image: `${siteUrl}/photo.jpeg`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bandung",
          addressCountry: "Indonesia",
        },
        knowsAbout: [
          "Python",
          "Django",
          "Flask",
          "Node.js",
          "PostgreSQL",
          "Vue.js",
          "Nuxt.js",
          "REST API",
          "Backend Development",
        ],
      }),
    },
  ],
});

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: "website",
  ogUrl: siteUrl,
  ogImage: ogImageUrl,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Ababil Mustaqim - Backend Developer Portfolio",
  ogLocale: "en_US",
  ogSiteName: "Ababil Mustaqim Portfolio",
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: ogImageUrl,
  twitterImageAlt: "Ababil Mustaqim - Backend Developer Portfolio",
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
