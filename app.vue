<script setup lang="ts">
const seoTitle = 'Ababil Mustaqim - Backend Developer From Bandung';
const seoDescription = 'Ababil Mustaqim adalah seorang backend developer profesional dari Bandung, berpengalaman dalam membangun sistem backend yang scalable, aman, dan efisien. Temukan portofolio, proyek, dan keahlian teknologi terbaru di sini.';

useHead({
    title: seoTitle,
    meta: [
        {
            name: 'description',
            content: seoDescription
        },
        {
            property: 'og:title',
            content: seoTitle
        },
        {
            property: 'og:description',
            content: seoDescription
        },
        {
            property: 'og:type',
            content: 'website'
        },
        {
            property: 'og:locale',
            content: 'id_ID'
        },
        {
            property: 'twitter:card',
            content: 'summary'
        },
        {
            property: 'twitter:title',
            content: seoTitle
        },
        {
            property: 'twitter:description',
            content: seoDescription
        }
    ]
});

useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogType: 'website',
    ogLocale: 'id_ID',
    twitterCard: 'summary',
    twitterTitle: seoTitle,
    twitterDescription: seoDescription
});
</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>
