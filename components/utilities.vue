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
        <div class="flex flex-col gap-3">
            <div>
                <h3 class="text-lg font-bold">System</h3>
                <ul class="list-disc list-inside">
                    <li v-for="utility in utilities.system" :key="utility">{{ utility }}</li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-bold">Software & Applications</h3>
                <ul class="list-disc list-inside">
                    <li v-for="utility in utilities.software" :key="utility">{{ utility }}</li>
                </ul>
            </div>
        </div>
    </section>
</template>
