<template>
  <div
    class="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 border border-neutral-200 dark:border-neutral-700"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        Maintenance Mode
      </h3>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-tabler-settings"
          class="w-5 h-5 text-neutral-500 dark:text-neutral-400"
        />
        <span
          class="text-sm px-2 py-1 rounded-full"
          :class="
            isMaintenanceMode
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          "
        >
          {{ isMaintenanceMode ? "Active" : "Inactive" }}
        </span>
      </div>
    </div>

    <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
      When enabled, all visitors will be redirected to the maintenance page.
    </p>

    <div class="space-y-4">
      <!-- Toggle Switch -->
      <div
        class="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
      >
        <div>
          <div class="font-medium text-neutral-800 dark:text-neutral-200">
            Enable Maintenance Mode
          </div>
          <div class="text-sm text-neutral-600 dark:text-neutral-400">
            Activate site-wide maintenance
          </div>
        </div>
        <UToggle
          v-model="isMaintenanceMode"
          @update:model-value="toggleMaintenance"
          :disabled="isLoading"
        />
      </div>

      <!-- Status Message -->
      <div
        v-if="statusMessage"
        class="p-4 rounded-lg"
        :class="
          statusMessage.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
        "
      >
        <div class="flex items-center gap-2">
          <UIcon
            :name="
              statusMessage.type === 'success'
                ? 'i-tabler-check-circle'
                : 'i-tabler-alert-circle'
            "
            class="w-4 h-4"
          />
          <span class="text-sm">{{ statusMessage.message }}</span>
        </div>
      </div>

      <!-- Warning -->
      <div
        class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
      >
        <div class="flex items-start gap-2">
          <UIcon
            name="i-tabler-alert-triangle"
            class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5"
          />
          <div>
            <div class="text-sm font-medium text-amber-800 dark:text-amber-400">
              Important Notice
            </div>
            <div class="text-sm text-amber-700 dark:text-amber-300 mt-1">
              This requires updating the .env file and restarting the
              application.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const isMaintenanceMode = ref(config.public.maintenance === "true");
const isLoading = ref(false);
const statusMessage = ref<{
  type: "success" | "error";
  message: string;
} | null>(null);

const toggleMaintenance = async (enabled: boolean) => {
  isLoading.value = true;
  statusMessage.value = null;

  try {
    const response = await $fetch("/api/maintenance", {
      method: "POST",
      body: {
        enabled,
      },
    });

    if (response.success) {
      statusMessage.value = {
        type: "success",
        message: response.message,
      };
    } else {
      throw new Error("Failed to update maintenance mode");
    }
  } catch (error) {
    console.error("Error toggling maintenance mode:", error);
    statusMessage.value = {
      type: "error",
      message: "Failed to update maintenance mode. Please try again.",
    };
    // Revert the toggle
    isMaintenanceMode.value = !enabled;
  } finally {
    isLoading.value = false;
  }
};

// Clear status message after 5 seconds
watch(statusMessage, (newMessage) => {
  if (newMessage) {
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  }
});
</script>
