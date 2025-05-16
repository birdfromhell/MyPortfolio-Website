<script setup lang="ts">
import { IconLink, IconChevronDown, IconChevronUp } from '@tabler/icons-vue';

// State to track if all content is shown
const isExpanded = ref(false);

// Toggle function for expanding/collapsing content
const toggleContent = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <section class="flex flex-col gap-3">
    <a href="#about">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          {{ $t('aboutMe') }}
        </h2>
      </div>
    </a>

    <!-- First paragraph is always visible -->
    <p class="text-pretty text-sm text-neutral-600 dark:text-neutral-400">
      {{ $t('about.1') }}
    </p>

    <!-- Additional paragraphs are conditionally shown -->
    <div v-if="isExpanded" class="animate-fadeIn">
      <p class="text-pretty text-sm text-neutral-600 dark:text-neutral-400 mb-3">
        {{ $t('about.2') }}
      </p>
      <p class="text-pretty text-sm text-neutral-600 dark:text-neutral-400">
        {{ $t('about.3') }}
      </p>
    </div>

    <!-- Enhanced Toggle button -->
    <div class="flex justify-center mt-4">
      <button 
        @click="toggleContent"
        class="group relative inline-flex items-center gap-2 px-6 py-2 overflow-hidden rounded-full transition-all duration-300 ease-out
               bg-gradient-to-r from-primary-500/10 via-primary-500/20 to-primary-500/10
               hover:from-primary-500/20 hover:via-primary-500/30 hover:to-primary-500/20
               dark:from-primary-500/20 dark:via-primary-500/30 dark:to-primary-500/20
               dark:hover:from-primary-500/30 dark:hover:via-primary-500/40 dark:hover:to-primary-500/30
               text-primary-600 dark:text-primary-400 text-sm font-medium"
      >
        <span v-if="isExpanded">
          <IconChevronUp class="w-4 h-4 animate-bounce-mini" />
        </span>
        <span v-else>
          <IconChevronDown class="w-4 h-4 animate-bounce-mini" />
        </span>
        
        <span class="relative">
          {{ isExpanded ? $t('showLess', 'Show less') : $t('readMore', 'Read more') }}
        </span>
        
        <!-- Animated background effect -->
        <span class="absolute inset-0 -z-10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent dark:via-primary-500/20"></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce-mini {
  animation: bounce-mini 2s infinite ease-in-out;
}

@keyframes bounce-mini {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>