<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        @click="closeModal"
        @keydown.escape="closeModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        tabindex="-1"
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <!-- Modal Content -->
        <Transition
          enter-active-class="duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showModal"
            @click.stop
            class="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 max-w-lg w-full max-h-[85vh] overflow-y-auto transform transition-all relative"
            ref="modalRef"
          >
            <!-- Loading Overlay -->
            <div
              v-if="isLoading"
              class="absolute inset-0 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 animate-spin rounded-full border-2 border-neutral-300 border-t-green-600"
                ></div>
                <span
                  class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {{ isLoading ? "Processing..." : "" }}
                </span>
              </div>
            </div>
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center"
                >
                  <UIcon name="i-tabler-music" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3
                    id="modal-title"
                    class="text-base font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    Custom Track
                  </h3>
                  <p
                    id="modal-description"
                    class="text-xs text-neutral-600 dark:text-neutral-400"
                  >
                    Manage music display
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  class="text-xs px-2 py-1 rounded-full font-medium"
                  :class="
                    customTrack.enabled
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-400'
                  "
                >
                  {{ customTrack.enabled ? "Active" : "Spotify" }}
                </span>
                <button
                  @click="closeModal"
                  class="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                  aria-label="Close modal"
                >
                  <UIcon name="i-tabler-x" class="w-4 h-4 text-neutral-500" />
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="p-4 space-y-4">
              <p class="text-xs text-neutral-600 dark:text-neutral-400">
                Override Spotify dengan track kustom atau gunakan sync normal.
              </p>

              <!-- Toggle Switch -->
              <div
                class="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
              >
                <div>
                  <div
                    class="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    Enable Custom Track
                  </div>
                  <div class="text-xs text-neutral-600 dark:text-neutral-400">
                    Tampilkan track kustom
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div
                    v-if="isLoading"
                    class="w-4 h-4 animate-spin rounded-full border-2 border-neutral-300 border-t-green-600"
                  ></div>
                  <UToggle
                    v-model="customTrack.enabled"
                    @update:model-value="toggleCustomTrack"
                    :disabled="isLoading"
                  />
                </div>
              </div>

              <!-- Custom Track Form -->
              <div v-if="customTrack.enabled" class="space-y-3">
                <!-- Search Songs -->
                <div
                  class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon
                      name="i-tabler-search"
                      class="w-4 h-4 text-blue-600 dark:text-blue-400"
                    />
                    <h4
                      class="text-xs font-medium text-blue-800 dark:text-blue-400"
                    >
                      Search Songs
                    </h4>
                  </div>
                  <div class="flex gap-2">
                    <UInput
                      v-model="searchQuery"
                      placeholder="Search songs..."
                      class="flex-1"
                      :disabled="isSearching"
                      @keyup.enter="searchSongs"
                    />
                    <UButton
                      @click="searchSongs"
                      :loading="isSearching"
                      color="blue"
                      size="sm"
                      icon="i-tabler-search"
                      :disabled="!searchQuery.trim()"
                    >
                      Search
                    </UButton>
                  </div>

                  <!-- Search Results -->
                  <div
                    v-if="searchResults.length > 0"
                    class="mt-4 space-y-2 max-h-60 overflow-y-auto"
                  >
                    <div class="flex items-center justify-between">
                      <h5
                        class="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide"
                      >
                        Search Results ({{ searchResults.length }})
                      </h5>
                      <UButton
                        @click="clearSearch"
                        size="2xs"
                        color="gray"
                        variant="ghost"
                        icon="i-tabler-x"
                      >
                        Clear
                      </UButton>
                    </div>
                    <div
                      v-for="track in searchResults"
                      :key="track.id"
                      class="p-3 bg-white dark:bg-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800/50 cursor-pointer transition-colors"
                      @click="selectTrack(track)"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 bg-neutral-200 dark:bg-neutral-600 rounded-lg flex items-center justify-center overflow-hidden"
                        >
                          <img
                            v-if="track.albumImageUrl"
                            :src="track.albumImageUrl"
                            :alt="track.album"
                            class="w-full h-full object-cover"
                          />
                          <UIcon
                            v-else
                            name="i-tabler-music"
                            class="w-5 h-5 text-neutral-400"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <div
                            class="font-medium text-neutral-800 dark:text-neutral-200 truncate"
                          >
                            {{ track.title }}
                          </div>
                          <div
                            class="text-sm text-neutral-600 dark:text-neutral-400 truncate"
                          >
                            {{ track.artist }}
                          </div>
                          <div
                            class="text-xs text-neutral-500 dark:text-neutral-500 truncate"
                          >
                            {{ track.album }}
                          </div>
                        </div>
                        <div class="text-xs text-neutral-500">
                          {{ Math.floor(track.duration / 60) }}:{{
                            String(track.duration % 60).padStart(2, "0")
                          }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No Results Message -->
                  <div
                    v-else-if="
                      hasSearched && searchResults.length === 0 && !isSearching
                    "
                    class="mt-4 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                  >
                    <div
                      class="text-sm text-neutral-600 dark:text-neutral-400 text-center"
                    >
                      No songs found for "{{ searchQuery }}"
                    </div>
                  </div>
                </div>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-3"
                  id="custom-track-form"
                >
                  <div>
                    <label
                      class="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >
                      Song Title <span class="text-red-500">*</span>
                    </label>
                    <UInput
                      v-model="customTrack.title"
                      placeholder="Enter song title"
                      :disabled="isLoading"
                      required
                      size="sm"
                      class="focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      :class="
                        !customTrack.title.trim() && hasValidationErrors
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      "
                    />
                    <p
                      v-if="!customTrack.title.trim() && hasValidationErrors"
                      class="text-red-500 text-xs mt-1"
                    >
                      Song title is required
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >
                      Artist <span class="text-red-500">*</span>
                    </label>
                    <UInput
                      v-model="customTrack.artist"
                      placeholder="Enter artist name"
                      :disabled="isLoading"
                      required
                      size="sm"
                      class="focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      :class="
                        !customTrack.artist.trim() && hasValidationErrors
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : ''
                      "
                    />
                    <p
                      v-if="!customTrack.artist.trim() && hasValidationErrors"
                      class="text-red-500 text-xs mt-1"
                    >
                      Artist name is required
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      class="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >
                      Album
                    </label>
                    <UInput
                      v-model="customTrack.album"
                      placeholder="Enter album name"
                      :disabled="isLoading"
                      size="sm"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                    >
                      Duration (seconds)
                    </label>
                    <UInput
                      v-model.number="customTrack.duration"
                      type="number"
                      placeholder="180"
                      :disabled="isLoading"
                      size="sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Album Image URL
                  </label>
                  <UInput
                    v-model="customTrack.albumImageUrl"
                    placeholder="https://example.com/image.jpg"
                    :disabled="isLoading"
                    size="sm"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Song URL (Optional)
                  </label>
                  <UInput
                    v-model="customTrack.songUrl"
                    placeholder="https://open.spotify.com/track/..."
                    :disabled="isLoading"
                    size="sm"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <UCheckbox
                    v-model="customTrack.isPlaying"
                    :disabled="isLoading"
                  />
                  <label class="text-xs text-neutral-700 dark:text-neutral-300">
                    Show as currently playing
                  </label>
                </div>

                <!-- Preview -->
                <div
                  v-if="customTrack.title"
                  class="mt-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                >
                  <h4
                    class="text-xs font-medium text-neutral-800 dark:text-neutral-200 mb-2"
                  >
                    Preview:
                  </h4>
                  <div class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 bg-neutral-200 dark:bg-neutral-600 rounded-lg flex items-center justify-center overflow-hidden"
                    >
                      <img
                        v-if="customTrack.albumImageUrl"
                        :src="customTrack.albumImageUrl"
                        :alt="customTrack.album"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <UIcon
                        v-else
                        name="i-tabler-music"
                        class="w-4 h-4 text-neutral-400"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div
                        class="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate"
                      >
                        {{ customTrack.title }}
                      </div>
                      <div
                        class="text-xs text-neutral-600 dark:text-neutral-400 truncate"
                      >
                        {{ customTrack.artist }}
                      </div>
                    </div>
                    <div class="flex items-center gap-1">
                      <UIcon
                        :name="
                          customTrack.isPlaying
                            ? 'i-tabler-player-pause'
                            : 'i-tabler-player-play'
                        "
                        class="w-3 h-3 text-green-500"
                      />
                      <span class="text-xs text-neutral-500">
                        {{ Math.floor(customTrack.duration / 60) }}:{{
                          String(customTrack.duration % 60).padStart(2, "0")
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Status Message -->
              <Transition
                enter-active-class="duration-300 ease-out"
                enter-from-class="opacity-0 transform scale-95"
                enter-to-class="opacity-100 transform scale-100"
                leave-active-class="duration-200 ease-in"
                leave-from-class="opacity-100 transform scale-100"
                leave-to-class="opacity-0 transform scale-95"
              >
                <div
                  v-if="statusMessage"
                  class="p-4 rounded-lg shadow-sm border"
                  :class="
                    statusMessage.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800'
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
                    <span class="text-sm font-medium">{{
                      statusMessage.message
                    }}</span>
                    <button
                      @click="statusMessage = null"
                      class="ml-auto p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                    >
                      <UIcon name="i-tabler-x" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Transition>

              <!-- Current Spotify Status -->
              <div
                class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div class="flex items-start gap-2">
                  <UIcon
                    name="i-tabler-info-circle"
                    class="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5"
                  />
                  <div>
                    <div
                      class="text-xs font-medium text-blue-800 dark:text-blue-400"
                    >
                      Spotify Integration
                    </div>
                    <div class="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {{
                        customTrack.enabled
                          ? "Custom track will override Spotify sync."
                          : "Currently syncing with Spotify."
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div
              class="flex items-center justify-between p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-700/30"
            >
              <button
                @click="resetCustomTrack"
                class="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                Reset
              </button>
              <div class="flex items-center gap-2">
                <button
                  @click="closeModal"
                  class="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  v-if="customTrack.enabled"
                  @click="saveCustomTrack"
                  :disabled="
                    isLoading || !customTrack.title || !customTrack.artist
                  "
                  class="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {{ isLoading ? "Saving..." : "Save" }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// Props
interface Props {
  showModal: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showModal: false,
});

// Emits
const emit = defineEmits<{
  close: [];
  trackUpdated: [enabled: boolean];
}>();

// Refs
const modalRef = ref<HTMLElement>();

// Close modal function
const closeModal = () => {
  emit("close");
};

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.showModal) {
    closeModal();
  }
};

// Focus management
const focusModal = () => {
  nextTick(() => {
    if (modalRef.value) {
      modalRef.value.focus();
    }
  });
};

// Watch for modal open/close
watch(
  () => props.showModal,
  (isOpen) => {
    if (isOpen) {
      // Add escape key listener
      document.addEventListener("keydown", handleEscapeKey);
      // Focus modal
      focusModal();
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Remove escape key listener
      document.removeEventListener("keydown", handleEscapeKey);
      // Restore body scroll
      document.body.style.overflow = "auto";
    }
  }
);

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener("keydown", handleEscapeKey);
  document.body.style.overflow = "auto";
});

interface CustomTrack {
  enabled: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  isPlaying: boolean;
  duration: number;
}

interface SearchTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  duration: number;
  previewUrl: string;
}

const customTrack = ref<CustomTrack>({
  enabled: false,
  title: "",
  artist: "",
  album: "",
  albumImageUrl: "",
  songUrl: "",
  isPlaying: false,
  duration: 180,
});

const isLoading = ref(false);
const hasValidationErrors = ref(false);
const statusMessage = ref<{
  type: "success" | "error";
  message: string;
} | null>(null);

// Search functionality
const searchQuery = ref("");
const searchResults = ref<SearchTrack[]>([]);
const isSearching = ref(false);
const hasSearched = ref(false);

const searchSongs = async () => {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  hasSearched.value = true;
  searchResults.value = [];

  try {
    const response = (await $fetch(
      `/api/spotify/search?q=${encodeURIComponent(searchQuery.value)}`
    )) as any;

    if (response.tracks) {
      searchResults.value = response.tracks;
    }
  } catch (error) {
    console.error("Error searching songs:", error);
    statusMessage.value = {
      type: "error",
      message: "Failed to search songs. Please try again.",
    };
  } finally {
    isSearching.value = false;
  }
};

const selectTrack = (track: SearchTrack) => {
  customTrack.value = {
    ...customTrack.value,
    title: track.title,
    artist: track.artist,
    album: track.album,
    albumImageUrl: track.albumImageUrl,
    songUrl: track.songUrl,
    duration: track.duration,
  };

  // Clear search results and query
  searchResults.value = [];
  searchQuery.value = "";
  hasSearched.value = false;

  // Show success message
  statusMessage.value = {
    type: "success",
    message: `Selected "${track.title}" by ${track.artist}`,
  };

  // Scroll to custom track form
  nextTick(() => {
    const element = document.getElementById("custom-track-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  });
};

const clearSearch = () => {
  searchResults.value = [];
  searchQuery.value = "";
  hasSearched.value = false;
};

// Load existing custom track on mount
onMounted(async () => {
  await loadCustomTrack();
});

const loadCustomTrack = async () => {
  try {
    const response = await $fetch("/api/admin/custom-track");
    if (response.customTrack) {
      customTrack.value = {
        ...customTrack.value,
        ...response.customTrack,
        // Ensure nullable fields are converted to strings
        album: response.customTrack.album || "",
        albumImageUrl: response.customTrack.albumImageUrl || "",
        songUrl: response.customTrack.songUrl || "",
      };
    }
  } catch (error) {
    console.error("Error loading custom track:", error);
  }
};

const toggleCustomTrack = async (enabled: boolean) => {
  isLoading.value = true;
  statusMessage.value = null;

  // If trying to enable custom track, validate required fields
  if (
    enabled &&
    (!customTrack.value.title.trim() || !customTrack.value.artist.trim())
  ) {
    statusMessage.value = {
      type: "error",
      message:
        "Please fill in song title and artist before enabling custom track",
    };
    // Revert the toggle
    customTrack.value.enabled = false;
    isLoading.value = false;
    return;
  }

  try {
    await $fetch("/api/admin/custom-track", {
      method: "POST",
      body: {
        ...customTrack.value,
        enabled,
      },
    });

    statusMessage.value = {
      type: "success",
      message: enabled ? "Custom track enabled" : "Spotify sync enabled",
    };

    // Emit track updated event
    emit("trackUpdated", enabled);
  } catch (error: any) {
    console.error("Error toggling custom track:", error);
    let errorMessage = "Failed to toggle custom track";

    // Extract more specific error message if available
    if (error.data?.statusMessage) {
      errorMessage = error.data.statusMessage;
    } else if (error.statusMessage) {
      errorMessage = error.statusMessage;
    }

    statusMessage.value = {
      type: "error",
      message: errorMessage,
    };
    // Revert the toggle
    customTrack.value.enabled = !enabled;
  } finally {
    isLoading.value = false;
  }
};

const saveCustomTrack = async () => {
  hasValidationErrors.value = false;

  if (!customTrack.value.title.trim() || !customTrack.value.artist.trim()) {
    hasValidationErrors.value = true;
    statusMessage.value = {
      type: "error",
      message: "Title and artist are required",
    };
    return;
  }

  isLoading.value = true;
  statusMessage.value = null;

  try {
    await $fetch("/api/admin/custom-track", {
      method: "POST",
      body: customTrack.value,
    });

    statusMessage.value = {
      type: "success",
      message: "Custom track saved successfully",
    };

    // Emit track updated event and close modal
    emit("trackUpdated", true);
    setTimeout(() => {
      closeModal();
    }, 1500);
  } catch (error: any) {
    console.error("Error saving custom track:", error);
    let errorMessage = "Failed to save custom track";

    // Extract more specific error message if available
    if (error.data?.statusMessage) {
      errorMessage = error.data.statusMessage;
    } else if (error.statusMessage) {
      errorMessage = error.statusMessage;
    }

    statusMessage.value = {
      type: "error",
      message: errorMessage,
    };
  } finally {
    isLoading.value = false;
  }
};

const resetCustomTrack = () => {
  customTrack.value = {
    enabled: customTrack.value.enabled,
    title: "",
    artist: "",
    album: "",
    albumImageUrl: "",
    songUrl: "",
    isPlaying: false,
    duration: 180,
  };
};

const handleImageError = (event: Event) => {
  // Hide broken image
  (event.target as HTMLImageElement).style.display = "none";
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
