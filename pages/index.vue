<script setup lang="ts">
import NowPlaying from '~/components/NowPlaying.vue';
</script>

<template>
    <div
        class="container relative mx-auto scroll-my-12 overflow-auto px-4 pt-6 md:p-x-16 md:pt-16"
    >
        <section class="mx-auto w-full max-w-[45rem] space-y-8">
            <Header id="me" />
            <About id="about" />
            <Projects id="projects" />
            <Work id="experience" />
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