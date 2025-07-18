<template>
  <div
    class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center"
        >
          <UIcon name="i-tabler-activity" class="w-5 h-5 text-white" />
        </div>
        <h3
          class="text-lg font-semibold text-neutral-800 dark:text-neutral-200"
        >
          System Status
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-green-600 dark:text-green-400 font-medium"
          >Online</span
        >
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Server Status -->
      <div class="space-y-3">
        <h4
          class="text-sm font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wide"
        >
          Server
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Memory</span
            >
            <div class="flex items-center gap-2">
              <div
                class="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style="width: 65%"
                ></div>
              </div>
              <span
                class="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >65%</span
              >
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >CPU</span
            >
            <div class="flex items-center gap-2">
              <div
                class="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  style="width: 45%"
                ></div>
              </div>
              <span
                class="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >45%</span
              >
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Storage</span
            >
            <div class="flex items-center gap-2">
              <div
                class="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style="width: 32%"
                ></div>
              </div>
              <span
                class="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >32%</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- API Status -->
      <div class="space-y-3">
        <h4
          class="text-sm font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wide"
        >
          Services
        </h4>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Spotify API</span
            >
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span
                class="text-xs font-medium text-green-600 dark:text-green-400"
                >Active</span
              >
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >RapidAPI</span
            >
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span
                class="text-xs font-medium text-green-600 dark:text-green-400"
                >Active</span
              >
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Database</span
            >
            <div class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span
                class="text-xs font-medium text-green-600 dark:text-green-400"
                >Connected</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
      <div class="flex flex-wrap gap-2">
        <button
          class="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors text-xs font-medium"
        >
          <UIcon name="i-tabler-refresh" class="w-3 h-3" />
          Refresh
        </button>
        <button
          class="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors text-xs font-medium"
        >
          <UIcon name="i-tabler-download" class="w-3 h-3" />
          Export
        </button>
        <button
          class="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors text-xs font-medium"
        >
          <UIcon name="i-tabler-settings" class="w-3 h-3" />
          Configure
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// System status monitoring logic would go here
</script>
