<template>
    <ClientOnly>
        <div
            v-if="technoObject"
            :class="{
                [littleClassesDisplay]: size === 'little',
                [bigClassesDisplay]: size === 'big'
            }"
        >
            <p v-if="size == 'little'" class="mr-2 text-xs">
                • {{ technoObject.title }}
            </p>
            <p
                v-else-if="size == 'big'"
                class="text-xs font-bold text-stone-800 dark:text-neutral-400"
            >
                {{ technoObject.title }}
            </p>
            
            <!-- Replace the current icon implementation with UIcon -->
            <UIcon
                :name="getIconName(technoObject)"
                class="w-6 h-6"
                :class="{'mx-auto': size === 'big'}"
            />
        </div>
    </ClientOnly>
</template>

<script setup lang="ts">
import { findTechnoByTitle } from '~/data/technos';

const props = defineProps<{
    techno: string;
    size: 'little' | 'medium' | 'big';
}>();

const technoObject = ref(findTechnoByTitle(props.techno));

const colorMode = useColorMode();

const littleClassesDisplay = 'rounded-md flex flex-row items-center text-xs';
const bigClassesDisplay =
    'flex flex-col items-center justify-evenly text-xs text-center w-full h-full';

// Function to map technology name to Nuxt Icon name
function getIconName(techno) {
    // You'll need to map each technology to an appropriate Nuxt Icon
    // This is just an example mapping - you'll need to expand this based on your technologies
    const iconMap = {
        'JavaScript': 'i-logos-javascript',
        'TypeScript': 'i-logos-typescript-icon',
        'Angular': 'i-logos-angular-icon',
        'Vue.js': 'i-logos-vue',
        'Nuxt.js': 'skill-icons:nuxtjs-dark',
        'React': 'i-logos-react',
        'Next.js': 'i-logos-nextjs-icon',
        'GitHub': 'i-tabler-brand-github',
        'GitHub Actions': 'i-logos-github-actions',
        'Python': 'i-logos-python',
        'Java': 'skill-icons:java-light',
        'Docker': 'skill-icons:docker',
        'Terraform': 'i-logos-terraform-icon',
        'AWS': 'skill-icons:aws-light',
        'MongoDB': 'skill-icons:mongodb',
        'MySQL': 'skill-icons:mysql-light',
        'PHP': 'skill-icons:php-light',
        'HTML': 'skill-icons:html',
        'CSS': 'skill-icons:css',
        'Symfony': 'i-logos-symfony',
        'Postman': 'skill-icons:postman',
        'Insomnia': 'devicon:insomnia',
        'Tailwind CSS': 'skill-icons:tailwindcss-light',
        'Node.js': 'skill-icons:nodejs-dark'
    };
    
    return iconMap[techno.title] || 'i-tabler-code'; // Default icon if not found
}
</script>