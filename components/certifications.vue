<script setup lang="ts">
import { IconExternalLink, IconLink } from '@tabler/icons-vue';

// Interface untuk tipe data sertifikasi tanpa perlu lokalisasi
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
</script>

<template>
    <section class="flex flex-col gap-3">
        <div class="flex flex-row gap-2 items-center">
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

        <div class="flex flex-col gap-5">
            <!-- Loop through certifications with type checking -->
            <div v-for="cert in certifications || []" :key="cert?._id" class="certification-item">
                <div class="flex flex-row justify-between gap-2 w-full">
                    <div class="flex flex-col items-start gap-2" :class="cert?.icon || cert?.provider ? 'w-3/4' : 'w-full'">
                        <a
                            v-if="cert?.website"
                            class="text-lg font-bold hover:underline"
                            :href="cert.website"
                            target="_blank"
                        >{{ cert.title }}</a>
                        <p v-else class="text-lg font-bold">{{ cert?.title }}</p>
                        
                        <!-- Description -->
                        <p
                            v-if="cert?.description"
                            class="text-sm leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300"
                        >
                            {{ cert.description }}
                        </p>
                        
                        <!-- Skills (HTML content) -->
                        <p
                            v-if="cert?.skills"
                            class="text-sm leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300 mt-2"
                            v-html="cert.skills"
                        />
                        
                        <!-- Recap -->
                        <p
                            v-if="cert?.recap"
                            class="text-sm leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300 mt-2"
                        >
                            {{ cert.recap }}
                        </p>
                        
                        <!-- Additional details (for items like TOEIC scores) -->
                        <p
                            v-if="cert?.details"
                            class="text-sm leading-relaxed text-pretty text-neutral-700 dark:text-neutral-300"
                            v-html="cert.details"
                        />
                    </div>

                    <div v-if="cert?.icon || cert?.provider" class="flex flex-col justify-start items-end gap-0.5">
                        <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-1.5">{{ cert.date }}</p>
                        <a
                            :href="cert.credlyBadgeUrl || cert.website"
                            target="_blank"
                            class="group relative p-3"
                        >
                            <!-- Use UIcon component for iconify-format icons -->
                            <UIcon 
                                v-if="cert.icon" 
                                :name="cert.icon" 
                                class="text-3xl" 
                                :title="cert.badgeAlt"
                            />
                            <!-- Use UIcon for provider default icons too -->
                            <UIcon 
                                v-else-if="cert.provider" 
                                :name="getProviderDefaultIcon(cert.provider)" 
                                class="text-3xl" 
                                :title="cert.badgeAlt"
                            />
                            
                            <IconExternalLink
                                class="w-5 h-5 opacity-0 group-hover:opacity-100 transition duration-300 absolute top-0 right-0"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>