<template>
  <div
    class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full text-center">
      <!-- Maintenance Icon -->
      <div class="mb-8">
        <div
          class="relative mx-auto w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg maintenance-icon"
        >
          <UIcon name="i-tabler-tools" class="w-12 h-12 text-white" />
          <div
            class="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-0 animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Maintenance Title -->
      <h1
        class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent mb-4"
      >
        {{ $t("maintenance.title", "Site Under Maintenance") }}
      </h1>

      <!-- Maintenance Message -->
      <p class="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
        {{
          $t(
            "maintenance.message",
            "We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly. Thank you for your patience!"
          )
        }}
      </p>

      <!-- Estimated Time -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 mb-8"
      >
        <div class="flex items-center justify-center gap-3 mb-4">
          <UIcon name="i-tabler-clock" class="w-5 h-5 text-amber-500" />
          <span
            class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {{ $t("maintenance.estimatedTime", "Estimated Time") }}
          </span>
        </div>
        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">
          {{ estimatedTime }}
        </div>
      </div>

      <!-- Status Updates -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 mb-8"
      >
        <h3
          class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4"
        >
          {{ $t("maintenance.statusUpdates", "Status Updates") }}
        </h3>
        <div class="space-y-3 text-left">
          <div
            v-for="(update, index) in statusUpdates"
            :key="index"
            class="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
          >
            <div
              class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"
            ></div>
            <div>
              <div
                class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                {{ update.message }}
              </div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {{ update.time }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="space-y-4">
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t("maintenance.needHelp", "Need urgent assistance?") }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:contact@example.com"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <UIcon name="i-tabler-mail" class="w-4 h-4" />
            <span class="text-sm">{{
              $t("maintenance.emailUs", "Email Us")
            }}</span>
          </a>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <UIcon name="i-tabler-brand-twitter" class="w-4 h-4" />
            <span class="text-sm">{{
              $t("maintenance.twitter", "Twitter")
            }}</span>
          </a>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mt-8">
        <div
          class="bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden"
        >
          <div
            class="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
          {{ $t("maintenance.progress", "Progress") }}: {{ progress }}%
        </p>
      </div>

      <!-- Last Updated -->
      <div class="mt-6 text-xs text-neutral-400 dark:text-neutral-500">
        {{ $t("maintenance.lastUpdated", "Last updated") }}: {{ lastUpdated }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: "Site Under Maintenance",
  meta: [
    {
      name: "description",
      content:
        "Our website is currently under maintenance. We'll be back online shortly.",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
});

// Maintenance data
const estimatedTime = ref("2-3 hours");
const progress = ref(0);
const lastUpdated = ref("");

// Status updates
const statusUpdates = ref([
  {
    message: "Maintenance started - Database optimization in progress",
    time: "2 hours ago",
  },
  {
    message: "Server infrastructure upgrades completed",
    time: "1 hour ago",
  },
  {
    message: "Testing new features and improvements",
    time: "30 minutes ago",
  },
]);

// Update last updated time
const updateLastUpdated = () => {
  const now = new Date();
  lastUpdated.value = now.toLocaleString();
};

// Simulate progress and updates
onMounted(() => {
  updateLastUpdated();

  // Progress simulation
  const progressInterval = setInterval(() => {
    if (progress.value < 85) {
      progress.value += Math.random() * 3;
    }
  }, 3000);

  // Update time every minute
  const timeInterval = setInterval(() => {
    updateLastUpdated();
  }, 60000);

  onUnmounted(() => {
    clearInterval(progressInterval);
    clearInterval(timeInterval);
  });
});
</script>

<style scoped>
/* Maintenance page animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Maintenance icon animation */
@keyframes toolsRotate {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.maintenance-icon {
  animation: toolsRotate 3s ease-in-out infinite;
}

/* Gradient text animation */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}
</style>
