<script setup lang="ts">
import { IconLink } from '@tabler/icons-vue';
import { experiences } from '~/data/experiences';

// Define allowed locales to avoid type errors
type LocaleType = 'en' | 'id';

const { locale } = useI18n();

// Create a computed property that safely provides the current locale
const currentLocale = computed<LocaleType>(() => {
  // Only return 'en' or 'id', defaulting to 'en' for any other value
  return (locale.value === 'en' || locale.value === 'id') ? locale.value : 'en';
});
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
            class="flex flex-col gap-2"
        >
            <div class="flex flex-col">
                <div class="flex flex-row items-center justify-between w-full">
                    <div class="flex flex-col gap-1 items-start">
                        <div
                            class="flex justify-start flex-col sm:flex-row gap-1 sm:gap-2 items-start"
                        >
                            <a
                                class="text-lg font-bold hover:underline"
                                :href="exp.companyUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                >{{ exp.company }}</a
                            >
                            <p class="block sm:hidden text-sm">
                                {{ exp.period.start }} - {{ exp.period.end }} ({{ $t(exp.type) }})
                            </p>
                        </div>
                        <p>{{ $t(exp.position) }}</p>
                    </div>

                    <div class="flex flex-col items-end gap-0.5">
                        <p class="hidden sm:block text-sm">
                            {{ exp.period.start }} - {{ exp.period.end }}
                        </p>
                        <p class="hidden sm:block text-sm">
                            ({{ $t(exp.type) }})
                        </p>
                    </div>
                </div>
            </div>
            
            <p 
                v-for="(desc, descIndex) in exp.description[currentLocale]" 
                :key="descIndex" 
                class="text-xs text-neutral-600 dark:text-neutral-400"
            >
                - {{ desc }}
            </p>
            
            <p class="text-xs text-neutral-600 dark:text-neutral-400">
                - Technologies:
            </p>
            
            <div class="ml-4 flex flex-wrap gap-x-3 text-xs text-neutral-600 dark:text-neutral-400">
                <p v-for="(tech, techIndex) in exp.technologies" :key="techIndex">
                    • {{ tech }}
                </p>
            </div>
        </div>
    </section>
</template>