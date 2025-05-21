<script setup lang="ts">
import { IconPlayerPlay, IconVideo, IconEye } from '@tabler/icons-vue';

// Define allowed locales to avoid type errors
type LocaleType = 'en' | 'id' | 'fr';

// Interface untuk tipe data project dari Nuxt Content
interface ContentProject {
  _id?: string;
  _path?: string;
  name: string;
  link: string;
  repo_link: string;
  date: string;
  technos: string[];
  type: string[];
  image?: string; // Custom image filename
  imageExt?: string; // Custom image extension
  video_url?: string; // URL for video preview (YouTube/Vimeo embed)
  content?: {
    en?: string;
    id?: string;
    fr?: string;
    [key: string]: string | undefined;
  };
}

const { locale } = useI18n();

// Create a computed property that safely provides the current locale
const currentLocale = computed<LocaleType>(() => {
  // Return current locale or default to 'en'
  return (locale.value === 'en' || locale.value === 'id' || locale.value === 'fr') 
    ? locale.value as LocaleType 
    : 'en';
});

// Accept props from parent component
const props = defineProps<{ project: ContentProject }>();

// Preview modal state
const previewModalOpen = ref(false);

function getProjectImageName(project: ContentProject) {
  // Use custom image name if provided, otherwise generate from project name
  return project.image || project.name.toLowerCase().replace(/\s/g, '-').replace(/'/g, '');
}

function getProjectImageExtension(project: ContentProject) {
  // Use custom extension if provided, otherwise default to webp
  return project.imageExt || 'webp';
}

// Check if project has a valid live preview link
function hasLivePreview(project: ContentProject): boolean {
  return !!project.link && project.link.trim() !== '' && project.link !== '#';
}

// Check if project has a video preview
function hasVideoPreview(project: ContentProject): boolean {
  return !!project.video_url && project.video_url.trim() !== '';
}

// Check if project has any preview available
function hasAnyPreview(project: ContentProject): boolean {
  return hasLivePreview(project) || hasVideoPreview(project);
}

// Check if project is closed source (repo_link is an email address)
function isClosedSource(project: ContentProject): boolean {
  return !project.repo_link || project.repo_link.startsWith('closed');
}

// Get the appropriate link for the repository button
function getRepoLink(project: ContentProject): string {
  if (isClosedSource(project)) {
    return '/closed';  // Redirect to closed source info page
  }
  return project.repo_link;
}

// Get localized content
const getLocalizedContent = computed(() => {
  if (props.project.content && props.project.content[currentLocale.value]) {
    return props.project.content[currentLocale.value] || '';
  }
  return '';
});

// Get embedded video code (safely)
function getSafeVideoEmbed(url: string | undefined): string {
  if (!url) return '';
  
  // Handle YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  }
  
  // Handle Vimeo URLs
  if (url.includes('vimeo.com')) {
    const videoId = getVimeoVideoId(url);
    if (videoId) {
      return `<iframe width="100%" height="315" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  }
  
  // If we can't parse it, just return the URL as a fallback
  return `<p>Video preview not available: ${url}</p>`;
}

// Helper to extract YouTube video ID from various YouTube URL formats
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Helper to extract Vimeo video ID
function getVimeoVideoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Current preview mode in the modal
const currentPreviewMode = ref<'live' | 'video'>('live');
</script>

<template>
  <UCard
    class="relative overflow-hidden group hover:bg-neutral-100 dark:hover:bg-primary-900 transition duration-300"
    :ui="{
      body: {
          padding: 'px-3 py-4 sm:p-4'
      },
      background:
          'bg-white dark:bg-primary-950 border border-stone-200 dark:border-stone-600',
      ring: ''
    }"
  >
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-start justify-between w-full">
        <div class="flex flex-col gap-1 items-start">
          <a
            class="text-lg font-bold hover:underline"
            :href="project.link"
            target="_blank"
            rel="noopener noreferrer"
          >{{ project.name }}</a>
          <div class="flex flex-wrap gap-4 text-neutral-600 dark:text-neutral-400">
            <Techno
              v-for="techno in project.technos"
              :key="techno"
              :techno="techno"
              size="medium"
            />
          </div>
        </div>
        <div class="flex flex-col items-end gap-0.5">
          <p class="text-sm">{{ project.date }}</p>
        </div>
      </div>
    </div>
    
    <!-- Content area with fixed minimum height to prevent card shrinking -->
    <div class="mt-4 flex flex-row items-center justify-between w-full min-h-[100px]">
      <p class="text-xs text-neutral-600 dark:text-neutral-400 w-full sm:w-1/2 line-clamp-4 sm:line-clamp-none">
        {{ getLocalizedContent }}
      </p>
      <img
        :src="`/projects/${getProjectImageName(project)}.${getProjectImageExtension(project)}`"
        :alt="project.name"
        class="hidden sm:block absolute bottom-0 right-[-10%] shadow-2xl rounded-t-xl z-10 h-32 w-60 sm:h-44 sm:w-80 transition group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:-rotate-2"
      />
    </div>
    
    <div class="mt-4 flex flex-row items-center justify-start gap-2 w-full">
      <!-- Code/Repository button -->
      <UButton :to="getRepoLink(project)" :target="isClosedSource(project) ? '_self' : '_blank'" variant="solid">
        <i class="devicon-github-original" v-if="!isClosedSource(project)"></i>
        <i class="material-symbols-light:lock-outline-sharp" v-else></i>
        {{ isClosedSource(project) ? 'Closed Source' : 'Code' }}
      </UButton>
      
      <!-- Preview button - opens modal with preview options -->
      <UButton 
        v-if="hasAnyPreview(project)"
        @click="previewModalOpen = true" 
        variant="solid"
      >
        <IconEye class="w-4 h-4 mr-1" /> {{ $t('preview', 'Preview') }}
      </UButton>
    </div>
  </UCard>
  
  <!-- Preview Modal -->
  <UModal v-model="previewModalOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold">{{ project.name }} - Preview</h3>
          <UButton color="gray" variant="ghost" icon="i-tabler-x" @click="previewModalOpen = false" />
        </div>
      </template>
      
      <!-- Modal tabs for different preview modes -->
      <div v-if="hasLivePreview(project) && hasVideoPreview(project)" class="flex gap-2 mb-4">
        <UButton 
          @click="currentPreviewMode = 'live'" 
          :variant="currentPreviewMode === 'live' ? 'solid' : 'ghost'"
        >
          <IconPlayerPlay class="w-4 h-4 mr-1" /> Live Preview
        </UButton>
        <UButton 
          @click="currentPreviewMode = 'video'" 
          :variant="currentPreviewMode === 'video' ? 'solid' : 'ghost'"
        >
          <IconVideo class="w-4 h-4 mr-1" /> Video Preview
        </UButton>
      </div>
      
      <!-- Preview content based on mode -->
      <div>
        <!-- Live Preview - only show when actually has live preview -->
        <div v-if="hasLivePreview(project) && (currentPreviewMode === 'live' || !hasVideoPreview(project))" class="text-center">
          <p class="mb-4">Visit the live project to see it in action:</p>
          <UButton :to="project.link" target="_blank" variant="solid" class="w-full md:w-auto">
            <IconPlayerPlay class="w-4 h-4 mr-1" /> Open Live Project
          </UButton>
        </div>
        
        <!-- Video Preview -->
        <div v-if="hasVideoPreview(project) && (currentPreviewMode === 'video' || !hasLivePreview(project))" class="text-center">
          <p class="mb-4">Watch the video preview because live preview not possible 😁</p>
          <div class="aspect-video w-full mt-2 mb-4" v-html="getSafeVideoEmbed(project.video_url)"></div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>