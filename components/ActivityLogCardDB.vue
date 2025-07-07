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
        @click="refreshLogs"
        class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        :disabled="loading"
      >
        {{ loading ? "Loading..." : "Refresh" }}
      </button>
    </div>

    <div class="space-y-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"
        ></div>
      </div>

      <!-- Activity Items -->
      <div v-else-if="logs.length > 0" class="space-y-3">
        <div
          v-for="log in logs"
          :key="log.id"
          class="flex items-start gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-700/30 rounded-lg"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="getActivityIcon(log.type).bgClass"
          >
            <UIcon
              :name="getActivityIcon(log.type).icon"
              class="w-4 h-4"
              :class="getActivityIcon(log.type).iconClass"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              {{ log.title }}
            </p>
            <p class="text-xs text-neutral-600 dark:text-neutral-400">
              {{ log.description }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {{ formatTime(log.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <UIcon
          name="i-tabler-history"
          class="w-12 h-12 text-neutral-400 mx-auto mb-2"
        />
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          No recent activity
        </p>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore" class="mt-4 text-center">
      <button
        @click="loadMore"
        class="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        :disabled="loading"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ActivityLog {
  id: string;
  action: string;
  title: string;
  description: string | null;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  createdAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: any;
}

const logs = ref<ActivityLog[]>([]);
const loading = ref(false);
const hasMore = ref(false);
const total = ref(0);

const getActivityIcon = (type: string) => {
  switch (type) {
    case "SUCCESS":
      return {
        icon: "i-tabler-check",
        bgClass: "bg-green-100 dark:bg-green-900/30",
        iconClass: "text-green-600 dark:text-green-400",
      };
    case "ERROR":
      return {
        icon: "i-tabler-x",
        bgClass: "bg-red-100 dark:bg-red-900/30",
        iconClass: "text-red-600 dark:text-red-400",
      };
    case "WARNING":
      return {
        icon: "i-tabler-alert-triangle",
        bgClass: "bg-amber-100 dark:bg-amber-900/30",
        iconClass: "text-amber-600 dark:text-amber-400",
      };
    default:
      return {
        icon: "i-tabler-info-circle",
        bgClass: "bg-blue-100 dark:bg-blue-900/30",
        iconClass: "text-blue-600 dark:text-blue-400",
      };
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

const fetchLogs = async (offset = 0) => {
  try {
    loading.value = true;
    const response = await $fetch(
      `/api/admin/activity-logs?limit=5&offset=${offset}`
    );

    const responseLogs = "logs" in response ? response.logs : [];

    if (offset === 0) {
      logs.value = responseLogs;
    } else {
      logs.value.push(...responseLogs);
    }

    total.value = "total" in response ? response.total : 0;
    hasMore.value = "hasMore" in response ? response.hasMore : false;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
  } finally {
    loading.value = false;
  }
};

const refreshLogs = () => {
  fetchLogs(0);
};

const loadMore = () => {
  fetchLogs(logs.value.length);
};

// Load initial data
onMounted(() => {
  fetchLogs();
});
</script>
