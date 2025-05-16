<script setup lang="ts">
import { IconExternalLink, IconLink, IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';

// Interface for certification data
interface ContentCertification {
  _id?: string;
  _path?: string;
  title: string;
  titleId?: string;
  website?: string;
  date: string;
  credlyBadgeUrl?: string;
  provider?: string;
  icon?: string; // Iconify format (e.g., "skill-icons:github-dark")
  badgeImage?: string;
  badgeAlt: string;
  imageHeight?: string;
  imageWidth?: string;
  description: string;
  descriptionId?: string;
  skills?: string;
  skillsId?: string;
  recap?: string;
  recapId?: string;
  details?: string;
  detailsId?: string;
}

// Fetch certifications from Nuxt Content
const { data: certifications } = await useAsyncData<ContentCertification[]>('certifications', async () => {
  const items = await queryContent('/certifications')
    .sort({ date: -1 })
    .find();
  
  return (items as unknown) as ContentCertification[];
});

// Load Credly script for badges
useHead({
    script: [
        {
            src: '//cdn.credly.com/assets/utilities/embed.js',
            async: true,
            type: 'text/javascript'
        }
    ]
});

// Get a default icon for providers when no custom icon is specified
function getProviderDefaultIcon(provider: string | undefined): string {
  if (!provider) return 'tabler:certificate';
  
  switch (provider.toLowerCase()) {
    case 'github': return 'devicon:github';
    case 'udemy': return 'logos:udemy-icon';
    case 'coursera': return 'simple-icons:coursera';
    case 'microsoft': return 'logos:microsoft-icon';
    case 'google': return 'logos:google-icon';
    case 'aws': return 'logos:aws';
    default: return 'tabler:certificate';
  }
}

// Check if we should use UIcon (for iconify format) or regular icon class
function isIconifyFormat(iconName: string | undefined): boolean {
  return !!iconName && (iconName.includes(':') || iconName.startsWith('i-'));
}

// Carousel controls
const currentIndex = ref(0);
const itemsPerPage = ref(1); // Always show 1 card at a time
const touchStartX = ref(0);
const carouselRef = ref<HTMLElement | null>(null);
const isAnimating = ref(false);
const autoplayEnabled = ref(true); // Enable autoplay by default
const autoplayInterval = ref<number | null>(null);
const isHovering = ref(false);

// Set up carousel on mount
onMounted(() => {
  // Always show 1 certification at a time regardless of screen size
  itemsPerPage.value = 1;
  
  // Make sure currentIndex is valid
  if (certifications.value && currentIndex.value > certifications.value.length - itemsPerPage.value) {
    currentIndex.value = Math.max(0, certifications.value.length - itemsPerPage.value);
  }
  
  // Start autoplay
  if (autoplayEnabled.value) {
    startAutoplay();
  }
});

onBeforeUnmount(() => {
  stopAutoplay();
});

// Navigation methods with animation locking to prevent rapid clicking
function nextSlide() {
  if (!certifications.value || isAnimating.value) return;
  
  isAnimating.value = true;
  
  const maxIndex = Math.max(0, certifications.value.length - itemsPerPage.value);
  currentIndex.value = Math.min(currentIndex.value + 1, maxIndex);
  
  setTimeout(() => {
    isAnimating.value = false;
  }, 800); // Match this with the CSS transition duration
}

function prevSlide() {
  if (isAnimating.value) return;
  
  isAnimating.value = true;
  currentIndex.value = Math.max(0, currentIndex.value - 1);
  
  setTimeout(() => {
    isAnimating.value = false;
  }, 800); // Match this with the CSS transition duration
}

function goToSlide(index: number) {
  if (!certifications.value || isAnimating.value) return;
  
  isAnimating.value = true;
  
  const maxIndex = Math.max(0, certifications.value.length - itemsPerPage.value);
  currentIndex.value = Math.min(Math.max(0, index), maxIndex);
  
  setTimeout(() => {
    isAnimating.value = false;
  }, 800); // Match this with the CSS transition duration
}

// Touch event handlers for mobile swiping
function handleTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0].clientX;
  pauseAutoplay();
}

function handleTouchEnd(e: TouchEvent) {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX.value - touchEndX;
  
  // Swipe threshold
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide(); // Swipe left
    } else {
      prevSlide(); // Swipe right
    }
  }
  
  resumeAutoplay();
}

// Autoplay functionality
function startAutoplay() {
  if (autoplayInterval.value) return;
  
  autoplayInterval.value = window.setInterval(() => {
    if (!isHovering.value && certifications.value && certifications.value.length > itemsPerPage.value) {
      if (currentIndex.value >= certifications.value.length - itemsPerPage.value) {
        // Loop back to the first slide
        goToSlide(0);
      } else {
        nextSlide();
      }
    }
  }, 5000); // Change slide every 3 seconds
}

function stopAutoplay() {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
}

function pauseAutoplay() {
  isHovering.value = true;
}

function resumeAutoplay() {
  isHovering.value = false;
}

// Computed properties for pagination
const totalPages = computed(() => {
  if (!certifications.value) return 0;
  return Math.ceil(certifications.value.length / itemsPerPage.value);
});

const currentPage = computed(() => {
  return Math.floor(currentIndex.value / itemsPerPage.value) + 1;
});

const canGoNext = computed(() => {
  if (!certifications.value) return false;
  return currentIndex.value < certifications.value.length - itemsPerPage.value;
});

const canGoPrev = computed(() => {
  return currentIndex.value > 0;
});

</script>

<template>
  <section class="flex flex-col gap-3">
    <div class="flex flex-row gap-2 items-center justify-between">
      <a href="#certifications">
        <div class="flex flex-row gap-1 items-center group relative">
          <IconLink
            class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
          />
          <h2 class="text-xl font-bold hover:cursor-pointer">
            Certifications
          </h2>
        </div>
      </a>
      <ClientOnly>
        <ConfettisButton>
          <template v-slot:default="{ onLaunchConfettis }">
            <UButton
              icon="i-tabler-confetti"
              variant="soft"
              label="Celebrate"
              @click="onLaunchConfettis"
            />
          </template>
        </ConfettisButton>
      </ClientOnly>
    </div>
    
    <!-- Certifications Carousel -->
    <div 
      class="relative carousel-container"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
    >
      <!-- Navigation arrows with enhanced animations -->
      <button 
        @click="prevSlide" 
        class="navigation-arrow left-arrow absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 bg-white dark:bg-primary-900 rounded-full shadow-md p-2 transition-all duration-300"
        :class="{ 
          'opacity-0 pointer-events-none': !canGoPrev, 
          'opacity-100 hover:bg-neutral-100 dark:hover:bg-primary-800 hover:scale-110': canGoPrev 
        }"
      >
        <IconChevronLeft class="w-5 h-5 text-primary-500" />
      </button>
      
      <button 
        @click="nextSlide" 
        class="navigation-arrow right-arrow absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 bg-white dark:bg-primary-900 rounded-full shadow-md p-2 transition-all duration-300"
        :class="{ 
          'opacity-0 pointer-events-none': !canGoNext, 
          'opacity-100 hover:bg-neutral-100 dark:hover:bg-primary-800 hover:scale-110': canGoNext 
        }"
      >
        <IconChevronRight class="w-5 h-5 text-primary-500" />
      </button>
      
      <!-- Carousel container with enhanced animations -->
      <div 
        ref="carouselRef"
        class="overflow-hidden carousel-view"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <div 
          class="flex carousel-track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div 
            v-for="(cert, index) in certifications || []" 
            :key="cert?._id" 
            class="cert-card min-w-full px-2"
            :class="{
              'is-active': index === currentIndex,
              'is-prev': index < currentIndex,
              'is-next': index > currentIndex
            }"
          >
            <UCard class="h-full flex flex-col card-inner">
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                  <h3 class="font-bold text-base">
                    <a
                      v-if="cert?.website"
                      class="hover:underline inline-flex items-center gap-1"
                      :href="cert.website"
                      target="_blank"
                    >
                      {{ cert.title }}
                      <IconExternalLink class="w-4 h-4 opacity-70" />
                    </a>
                    <template v-else>{{ cert?.title }}</template>
                  </h3>
                  <p class="text-xs text-neutral-600 dark:text-neutral-400">{{ cert.date }}</p>
                </div>
                
                <div v-if="cert?.icon || cert?.provider" class="ml-2">
                  <a
                    :href="cert.credlyBadgeUrl || cert.website"
                    target="_blank"
                    class="block p-1"
                  >
                    <UIcon 
                      v-if="cert.icon" 
                      :name="cert.icon" 
                      class="text-2xl" 
                      :title="cert.badgeAlt"
                    />
                    <UIcon 
                      v-else-if="cert.provider" 
                      :name="getProviderDefaultIcon(cert.provider)" 
                      class="text-2xl" 
                      :title="cert.badgeAlt"
                    />
                  </a>
                </div>
              </div>
              
              <!-- Card content -->
              <div class="flex-1 overflow-auto">
                <!-- Description -->
                <p
                  v-if="cert?.description"
                  class="text-xs leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  {{ cert.description }}
                </p>
                
                <!-- Skills (HTML content) -->
                <p
                  v-if="cert?.skills"
                  class="text-xs leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300"
                  v-html="cert.skills"
                />
                
                <!-- Collapsed content: Recap & Details -->
                <UAccordion 
                  v-if="cert?.recap || cert?.details" 
                  :items="[
                    {
                      label: 'More details',
                      slot: `details-${index}`,
                      defaultOpen: false
                    }
                  ]"
                  class="mt-3"
                  color="primary"
                >
                  <template #[`details-${index}`]>
                    <!-- Recap -->
                    <p
                      v-if="cert?.recap"
                      class="text-xs leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      {{ cert.recap }}
                    </p>
                    
                    <!-- Additional details (for items like TOEIC scores) -->
                    <p
                      v-if="cert?.details"
                      class="text-xs leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300"
                      v-html="cert.details"
                    />
                  </template>
                </UAccordion>
              </div>
            </UCard>
          </div>
        </div>
      </div>
      
      <!-- Pagination dots with enhanced animations -->
      <div class="flex justify-center mt-4 gap-1">
        <button 
          v-for="i in certifications?.length || 0" 
          :key="i"
          @click="goToSlide(i - 1)"
          class="pagination-dot h-2 rounded-full transition-all duration-300"
          :class="i - 1 === currentIndex 
            ? 'bg-primary-500 w-6 scale-y-110' 
            : 'bg-neutral-300 dark:bg-neutral-700 hover:bg-primary-300 dark:hover:bg-primary-700 w-2'"
          :aria-label="`Go to certificate ${i}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Base card styles with improved transitions */
.cert-card {
  height: auto;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
  will-change: transform, opacity;
}

/* Enhanced carousel track animation */
.carousel-track {
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
  padding: 8px 0;
}

/* Improved navigation arrows with pulse effect */
.navigation-arrow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  will-change: transform, opacity;
}

.navigation-arrow:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

/* Pagination dot animations */
.pagination-dot {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: width, background-color, transform;
}

/* Active, previous and next card states for enhanced animations */
.cert-card.is-active .card-inner {
  transform: scale(1);
  opacity: 1;
}

.cert-card.is-prev .card-inner {
  opacity: 0;
  transform: scale(0.9) translateX(-10%);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease;
}

.cert-card.is-next .card-inner {
  opacity: 0;
  transform: scale(0.9) translateX(10%);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease;
}

/* Card inner transition */
.card-inner {
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease;
  transform: scale(1);
  opacity: 1;
}

/* Ensure content doesn't overflow the cards */
.UAccordion {
  --un-accordion-item-gap: 0.5rem;
}

/* Card entrance animation */
@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.carousel-container:hover .navigation-arrow {
  transform: translateX(0) scale(1.05);
}

.carousel-container .left-arrow {
  transform: translateX(-8px);
}

.carousel-container .right-arrow {
  transform: translateX(8px);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .navigation-arrow {
    padding: 0.5rem;
  }
  
  .cert-card {
    animation: cardEntrance 0.6s ease forwards;
  }
}

/* Progress bar for autoplay timing */
.carousel-container::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  height: 2px;
  background: linear-gradient(to right, var(--color-primary-500), var(--color-primary-300));
  width: 0;
  animation: autoplayProgress 3s linear infinite;
  opacity: 0.5;
}

@keyframes autoplayProgress {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.carousel-container:hover::after {
  animation-play-state: paused;
}
</style>