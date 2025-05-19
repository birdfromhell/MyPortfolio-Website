<script setup lang="ts">
import { IconLink, IconTools, IconTool, IconBrandGithub } from '@tabler/icons-vue';
type LocaleType = 'en' | 'id';
interface ContentExperience {
  _id?: string;
  _path?: string;
  company?: string;
  companyUrl?: string;
  position?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: string;
  content?: {
    en?: string;
    id?: string;
    [key: string]: string | undefined;
  };
  technologies?: string[];
  body?: any;
}
const { locale } = useI18n();
const currentLocale = computed<LocaleType>(() => {
  return (locale.value === 'en' || locale.value === 'id') ? locale.value : 'en';
});
const { data: experiences } = await useAsyncData<ContentExperience[]>('experiences', () => 
  queryContent('/experiences').sort({ '_file': -1 }).find()
);
const getLocalizedContent = (exp: ContentExperience): string => {
  if (exp.content && exp.content[currentLocale.value]) {
    return exp.content[currentLocale.value] || '';
  }
  const company = exp.company?.toLowerCase().replace(/[^a-z]/g, '');
  if (company) {
    const i18n = useI18n();
    if (i18n.te(`${company}.1`)) {
      return i18n.t(`${company}.1`) + '<br><br>' + i18n.t(`${company}.2`);
    }
  }
  return '';
};
const techCategories = {
  frontend: ['Vue', 'React', 'Angular', 'Svelte', 'Tailwind CSS', 'Bootstrap'],
  backend: ['Node.js', 'Express', 'Django', 'Flask'],
  database: ['MongoDB', 'PostgreSQL', 'MySQL'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'Azure'],
  mobile: ['React Native', 'Flutter']
};
function categorizeTechnology(tech: string): string {
  for (const [category, techs] of Object.entries(techCategories)) {
    if (techs.includes(tech)) {
      return category;
    }
  }
  return 'other';
}
function getTechsByCategory(technologies: string[]) {
  const grouped: Record<string, string[]> = {};
  for (const tech of technologies) {
    const category = categorizeTechnology(tech);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(tech);
  }
  return grouped;
}
function getCategoryDisplayName(category: string): string {
  const categoryNames = {
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    devops: 'DevOps',
    mobile: 'Mobile',
    other: 'Other Technologies'
  };
  return categoryNames[category as keyof typeof categoryNames] || 'Other';
}
const techModalOpen = ref<string | null>(null);
function openTechModal(expId: string) {
  techModalOpen.value = expId;
}
function closeTechModal() {
  techModalOpen.value = null;
}
function isTechnoAvailable(tech: string): boolean {
  return !!(tech && tech.trim().length > 0);
}
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#experience">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          {{ $t('experience') }}
        </h2>
      </div>
    </a>
    <div 
      v-for="(exp, index) in experiences" 
      :key="exp?._id || index" 
      class="flex flex-col gap-2 mb-6"
    >
      <div class="flex flex-col">
        <div class="flex flex-row items-center justify-between w-full">
          <div class="flex flex-col gap-1 items-start">
            <div
              class="flex justify-start flex-col sm:flex-row gap-1 sm:gap-2 items-start"
            >
              <a
                v-if="exp.companyUrl"
                class="text-lg sm:text-xl font-semibold hover:underline"
                :href="exp.companyUrl"
                target="_blank"
                rel="noopener noreferrer"
              >{{ exp.company }}</a>
              <span v-else class="text-lg sm:text-xl font-semibold">{{ exp.company }}</span>
              <p class="block sm:hidden text-sm" v-if="exp.period?.start && exp.period?.end">
                • {{ exp.period.start }} - {{ exp.period.end }} <span v-if="exp.type">({{ $t(exp.type) }})</span>
              </p>
            </div>
            <p v-if="exp.position" class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t(exp.position) || exp.position }}</p>
          </div>
          <div class="flex flex-col items-end gap-0.5">
            <p class="hidden sm:block text-sm text-neutral-600 dark:text-neutral-400" v-if="exp.period?.start && exp.period?.end">
              {{ exp.period.start }} - {{ exp.period.end }}
            </p>
            <p class="hidden sm:block text-sm text-neutral-600 dark:text-neutral-400" v-if="exp.type">
              ({{ $t(exp.type) }})
            </p>
          </div>
        </div>
      </div>
      <div class="prose dark:prose-invert max-w-none">
        <p class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 text-pretty">
          <span v-html="getLocalizedContent(exp)"></span>
        </p>
      </div>
      <div class="mt-2 flex">
        <button 
          v-if="exp.technologies && exp.technologies.length > 0" 
          @click="openTechModal(exp._id || String(index))"
          class="tech-button group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-md overflow-hidden
               bg-gradient-to-r from-primary-500/10 to-primary-600/10
               hover:from-primary-500/20 hover:to-primary-600/20
               dark:from-primary-400/20 dark:to-primary-500/20
               dark:hover:from-primary-400/30 dark:hover:to-primary-500/30
               text-primary-600 dark:text-primary-300 text-sm font-medium transition-all duration-300"
        >
          <IconTools class="w-4 h-4 mr-1 transition-transform group-hover:rotate-12 duration-300" /> 
          {{ $t('techUsed', 'Tech Used') }}
          <span class="tech-count bg-primary-100 dark:bg-primary-800 text-xs px-1.5 py-0.5 rounded-full">{{ exp.technologies.length }}</span>
          <span class="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/5 via-primary-400/0 to-primary-500/5 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></span>
        </button>
      </div>
      <UModal 
        :model-value="techModalOpen === (exp._id || String(index))" 
        @close="closeTechModal"
        :ui="{ 
          overlay: { 
            background: 'bg-black/80 backdrop-blur-sm' 
          },
          container: 'flex items-center justify-center p-4',
        }"
      >
        <UCard :ui="{ 
          base: 'tech-modal overflow-hidden', 
          ring: '',
          divide: 'divide-y divide-neutral-100 dark:divide-neutral-800',
          header: {
            padding: 'p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-800/30'
          }
        }">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <IconTool class="text-primary-500" />
                  {{ $t('technologiesUsed', 'Technologies Used') }}
                </h3>
                <p class="text-xs text-neutral-500">
                  {{ exp.company }} 
                  <template v-if="exp.position">- {{ $t(exp.position) || exp.position }}</template>
                </p>
              </div>
              <UButton color="gray" variant="ghost" icon="i-tabler-x" @click="closeTechModal" class="hover:rotate-90 transition-transform duration-300" />
            </div>
          </template>
          <div class="max-h-[70vh] overflow-y-auto p-2 sm:p-5 space-y-6">
            <template v-if="exp.technologies && exp.technologies.length > 0">
              <div v-for="(techs, category) in getTechsByCategory(exp.technologies)" :key="category" class="space-y-3">
                <template v-if="techs && techs.length > 0">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="h-px bg-neutral-200 dark:bg-neutral-800 flex-grow"></div>
                    <h4 class="text-sm font-medium text-neutral-500 dark:text-neutral-400 px-2">{{ getCategoryDisplayName(category) }}</h4>
                    <div class="h-px bg-neutral-200 dark:bg-neutral-800 flex-grow"></div>
                  </div>
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div
                      v-for="tech in techs"
                      :key="tech"
                      class="tech-item flex flex-col items-center gap-2 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-primary-900/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                    >
                      <ClientOnly>
                        <Techno :techno="tech" size="big" />
                        <template #fallback>
                          <div class="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                            <span class="text-xs font-medium">{{ tech.substring(0, 2) }}</span>
                          </div>
                        </template>
                      </ClientOnly>
                      <p class="text-xs font-medium text-center">{{ tech }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <div v-else class="text-center py-6 text-neutral-500">
              <IconBrandGithub class="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>{{ $t('noTechFound', 'No technologies specified') }}</p>
            </div>
          </div>
          <template #footer>
            <div class="p-3 text-center">
              <UButton variant="ghost" @click="closeTechModal">{{ $t('close', 'Close') }}</UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </section>
</template>
<style scoped>
.tech-count {
  display: inline-block;
  line-height: 1;
  transition: all 0.3s ease;
}
.tech-button:hover .tech-count {
  transform: scale(1.1);
  background-color: theme('colors.primary.200');
  color: theme('colors.primary.800');
}
.tech-modal {
  animation: modal-appear 0.3s ease-out;
  max-width: 650px;
  width: 100%;
}
@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.tech-item {
  position: relative;
  overflow: hidden;
}
.tech-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, theme('colors.primary.500'), theme('colors.primary.300'));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.tech-item:hover::before {
  transform: scaleX(1);
}
</style>