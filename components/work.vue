<script setup lang="ts">
import { IconLink } from '@tabler/icons-vue';

// Define allowed locales to avoid type errors
type LocaleType = 'en' | 'id';

// Interface untuk tipe data experience dari Nuxt Content
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

// Create a computed property that safely provides the current locale
const currentLocale = computed<LocaleType>(() => {
  // Only return 'en' or 'id', defaulting to 'en' for any other value
  return (locale.value === 'en' || locale.value === 'id') ? locale.value : 'en';
});

// Fetch experiences from Nuxt Content
const { data: experiences } = await useAsyncData<ContentExperience[]>('experiences', () => 
  queryContent('/experiences').find()
);

// Akses konten dari frontmatter di file markdown dengan definisi tipe yang tepat
const getLocalizedContent = (exp: ContentExperience): string => {
  // Coba ambil konten dari properti content.en/id
  if (exp.content && exp.content[currentLocale.value]) {
    return exp.content[currentLocale.value] || '';
  }
  
  // Jika tidak ditemukan, gunakan fallback ke i18n
  const company = exp.company?.toLowerCase().replace(/[^a-z]/g, '');
  if (company) {
    const i18n = useI18n();
    if (i18n.te(`${company}.1`)) {
      return i18n.t(`${company}.1`) + '<br><br>' + i18n.t(`${company}.2`);
    }
  }
  
  return '';
};
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
      :key="index" 
      class="flex flex-col gap-2 mb-6"
    >
      <div class="flex flex-col">
        <div class="flex flex-row items-center justify-between w-full">
          <div class="flex flex-col gap-1 items-start">
            <div
              class="flex justify-start flex-col sm:flex-row gap-1 sm:gap-2 items-start"
            >
              <a
                class="text-lg sm:text-xl font-semibold hover:underline"
                :href="exp.companyUrl"
                target="_blank"
                rel="noopener noreferrer"
              >{{ exp.company }}</a>
              <p class="block sm:hidden text-sm" v-if="exp.period?.start && exp.period?.end">
                • {{ exp.period.start }} - {{ exp.period.end }} <span v-if="exp.type">({{ $t(exp.type) }})</span>
              </p>
            </div>
            <p v-if="exp.position" class="text-sm text-neutral-600 dark:text-neutral-400">{{ $t(exp.position) }}</p>
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
      
      <!-- Render content based on current language - simplified approach -->
      <div class="prose dark:prose-invert max-w-none">
        <p class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 text-pretty">
          <span v-html="getLocalizedContent(exp)"></span>
        </p>
      </div>
      
      <!-- Technologies section -->
      <p v-if="exp.technologies && exp.technologies.length > 0" class="text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-medium">
        Technologies:
      </p>
      
      <div v-if="exp.technologies && exp.technologies.length > 0" class="ml-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        <p v-for="(tech, techIndex) in exp.technologies" :key="techIndex">
          • {{ tech }}
        </p>
      </div>
    </div>
  </section>
</template>