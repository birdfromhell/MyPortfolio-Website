<script setup lang="ts">
import { IconLink } from '@tabler/icons-vue';
import { utilities } from '~/data/utilities';
</script>

<template>
    <section class="flex flex-col gap-y-3">
        <a href="#utilities">
            <div class="flex flex-row gap-1 items-center group relative">
                <IconLink
                    class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
                />
                <h2 class="text-xl font-bold hover:cursor-pointer">Utilities</h2>
            </div>
        </a>
        <div class="flex flex-wrap gap-1.5">
            <UButton
                v-for="utility in [...utilities.system, ...utilities.software]"
                :key="utility"
                class="relative border border-stone-200 dark:border-stone-600 p-0.5 rounded-md w-24 h-24 sm:w-28 sm:h-28"
                square
                variant="soft"
            >
                <div class="flex flex-col items-center justify-evenly text-xs text-center w-full h-full">
                    <p class="text-xs font-bold text-stone-800 dark:text-neutral-400">
                        {{ utility }}
                    </p>
                </div>
            </UButton>
        </div>
    </section>
</template>
