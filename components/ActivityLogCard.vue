<template>
  <div
    class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"
        >
          <UIcon name="i-tabler-clock-history" class="w-5 h-5 text-white" />
        </div>
        <h3
          class="text-lg font-semibold text-neutral-800 dark:text-neutral-200"
        >
          Recent Activity
        </h3>
      </div>
      <button
        class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
      >
        View All
      </button>
    </div>

    <div class="space-y-4">
      <!-- Activity Item -->
      <div
        class="flex items-start gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-700/30 rounded-lg"
      >
        <div
          class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <UIcon
            name="i-tabler-music"
            class="w-4 h-4 text-green-600 dark:text-green-400"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Custom track enabled
          </p>
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            "Levitating" by Dua Lipa set as custom track
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            2 minutes ago
          </p>
        </div>
      </div>

      <!-- Activity Item -->
      <div
        class="flex items-start gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-700/30 rounded-lg"
      >
        <div
          class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <UIcon
            name="i-tabler-user-circle"
            class="w-4 h-4 text-blue-600 dark:text-blue-400"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Admin login
          </p>
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            Successful authentication from {{ userIP }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            15 minutes ago
          </p>
        </div>
      </div>

      <!-- Activity Item -->
      <div
        class="flex items-start gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-700/30 rounded-lg"
      >
        <div
          class="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <UIcon
            name="i-tabler-tools"
            class="w-4 h-4 text-amber-600 dark:text-amber-400"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Maintenance mode disabled
          </p>
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            Website returned to normal operation
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            1 hour ago
          </p>
        </div>
      </div>

      <!-- Activity Item -->
      <div
        class="flex items-start gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-700/30 rounded-lg"
      >
        <div
          class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
        >
          <UIcon
            name="i-tabler-world"
            class="w-4 h-4 text-purple-600 dark:text-purple-400"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            New visitor
          </p>
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            Visitor from {{ visitorLocation }} viewed portfolio
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            3 hours ago
          </p>
        </div>
      </div>
    </div>

    <!-- View More Button -->
    <div class="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
      <button
        class="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
      >
        <UIcon name="i-tabler-dots" class="w-4 h-4" />
        View All Activities
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mock data - in real app, this would come from an API
const userIP = ref("192.168.1.100");
const visitorLocation = ref("Jakarta, Indonesia");
</script>
