<script setup lang="ts">
import NowPlaying from "~/components/NowPlaying.vue";
useHead({
  title: "Ababil Mustaqim",
  meta: [
    {
      name: "description",
      content:
        "Portfolio Ababil Mustaqim - Backend Developer berpengalaman dari Bandung. Spesialis Python, Django, Flask, Node.js, PostgreSQL, dan teknologi backend modern.",
    },
    {
      name: "keywords",
      content:
        "ababil mustaqim, backend developer, python developer, django developer, flask, nodejs, postgresql, vue, nuxt, rest api, bandung developer, indonesia developer, portfolio",
    },
    {
      property: "og:title",
      content: "Ababil Mustaqim - Backend Developer Portfolio",
    },
    {
      property: "og:description",
      content:
        "Portfolio Ababil Mustaqim - Backend Developer berpengalaman dari Bandung. Spesialis Python, Django, Flask, Node.js, PostgreSQL, dan teknologi backend modern.",
    },
  ],
});
</script>
<template>
  <div
    class="container relative mx-auto scroll-my-12 overflow-auto px-4 pt-6 md:p-x-16 md:pt-16"
  >
    <section class="mx-auto w-full max-w-[45rem] space-y-8">
      <Header id="me" />
      <About id="about" />
      <Projects id="projects" />
      <Experience id="experience" />
      <Education id="education" />
      <Certifications id="certifications" />
      <Skills id="technologies" />
      <SystemTools :showCategories="true" />
      <CodingStats id="coding-stats" />
      <NowPlaying id="now-playing" />
      <Contact id="contact" />
      <Footer />
    </section>
  </div>
</template>
