<script setup lang="ts">
import {
  IconLink,
  IconMusic,
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconExternalLink,
  IconRefresh,
} from "@tabler/icons-vue";

interface SpotifyNowPlaying {
  isPlaying: boolean;
  songUrl: string;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  progress: number;
  duration: number;
}

const nowPlaying = ref<SpotifyNowPlaying | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const localProgress = ref(0);
const lastFetchTime = ref(Date.now());
const isHovering = ref(false);

function formatDuration(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const progressPercentage = computed(() => {
  if (!nowPlaying.value) return 0;
  if (nowPlaying.value.isPlaying) {
    return (localProgress.value / nowPlaying.value.duration) * 100;
  } else {
    return (nowPlaying.value.progress / nowPlaying.value.duration) * 100;
  }
});

const currentProgress = computed(() => {
  if (!nowPlaying.value) return 0;
  if (nowPlaying.value.isPlaying) {
    return localProgress.value;
  } else {
    return nowPlaying.value.progress;
  }
});

async function fetchNowPlaying() {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await $fetch("/api/spotify");
    lastFetchTime.value = Date.now();
    nowPlaying.value = response as SpotifyNowPlaying;
    if (nowPlaying.value) {
      localProgress.value = nowPlaying.value.progress;
    }
  } catch (err) {
    console.error("Error fetching Spotify data:", err);
    error.value = "Failed to load Spotify data";
  } finally {
    isLoading.value = false;
  }
}

let progressInterval: NodeJS.Timeout;
function startProgressUpdater() {
  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (nowPlaying.value && nowPlaying.value.isPlaying) {
      const elapsed = Date.now() - lastFetchTime.value;
      localProgress.value = Math.min(
        nowPlaying.value.progress + elapsed,
        nowPlaying.value.duration
      );
      if (localProgress.value >= nowPlaying.value.duration) {
        fetchNowPlaying();
      }
    }
  }, 1000);
}

let refreshInterval: NodeJS.Timeout;
onMounted(() => {
  fetchNowPlaying().then(() => {
    startProgressUpdater();
  });
  refreshInterval = setInterval(() => {
    fetchNowPlaying();
  }, 30000);
});

onBeforeUnmount(() => {
  if (refreshInterval) clearInterval(refreshInterval);
  if (progressInterval) clearInterval(progressInterval);
});

const { t } = useI18n();
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#now-playing">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2
          class="text-xl font-bold hover:cursor-pointer flex items-center gap-2"
        >
          <IconMusic class="w-5 h-5 text-primary-500" />
          {{ $t("now_playing", "Spotify Now Playing") }}
        </h2>
      </div>
    </a>
    
    <UCard
      class="spotify-card relative overflow-hidden transition-all duration-300"
      :class="{ 'card-hovering': isHovering }"
      @mouseenter="isHovering = true" 
      @mouseleave="isHovering = false"
      :ui="{
        body: { padding: 'p-0' },
        background:
          'bg-white dark:bg-primary-950 border border-stone-200 dark:border-stone-600',
        ring: '',
      }"
    >
      <!-- Loading State -->
      <template v-if="isLoading">
        <div class="flex items-center justify-center p-6 sm:p-8">
          <div class="loading-container">
            <div class="music-bars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p class="text-sm text-center mt-4 text-neutral-500">
              {{ $t("loading_spotify", "Loading your vibes...") }}
            </p>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <template v-else-if="error">
        <div class="flex flex-col items-center justify-center p-6 sm:p-8 gap-3">
          <div class="error-icon p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
            <IconVolume class="text-red-500 w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <p class="text-sm font-medium text-center text-neutral-700 dark:text-neutral-300">{{ error }}</p>
          <UButton
            size="sm"
            @click="fetchNowPlaying"
            icon="i-tabler-refresh"
            variant="soft"
            class="mt-1"
          >
            {{ $t("try_again", "Try Again") }}
          </UButton>
        </div>
      </template>

      <!-- Not Playing State -->
      <template v-else-if="nowPlaying && !nowPlaying.isPlaying">
        <div class="flex flex-col items-center justify-center p-6 sm:p-8 gap-3">
          <div class="silent-icon p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full">
            <IconVolume class="text-neutral-500 w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <p class="text-sm text-center text-neutral-600 dark:text-neutral-400 max-w-xs px-2">
            {{ $t("not_playing", "Ababil recently not playing Music!!") }}
          </p>
          <div class="w-full max-w-[150px] mt-1 sm:mt-2">
            <div class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 sm:w-5 sm:h-5 opacity-50">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
              <UButton
                size="xs"
                to="https://open.spotify.com/"
                target="_blank"
                variant="ghost"
                color="gray"
                class="text-xs"
              >
                Open Spotify
                <template #trailing>
                  <IconExternalLink class="w-3 h-3" />
                </template>
              </UButton>
            </div>
          </div>
        </div>
      </template>

      <!-- Playing State -->
      <template v-else-if="nowPlaying">
        <div class="relative">
          <!-- Background album art (blurred) -->
          <div class="absolute inset-0 z-0 overflow-hidden">
            <img
              :src="nowPlaying.albumImageUrl"
              alt=""
              class="w-full h-full object-cover blur-2xl opacity-20 transform scale-110"
              aria-hidden="true"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-white dark:from-primary-950/80 to-white/95 dark:to-primary-950/95"></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 flex flex-col sm:flex-row p-0">
            <!-- Album Art -->
            <div class="w-full h-36 sm:w-32 sm:h-32 relative group">
              <img
                :src="nowPlaying.albumImageUrl"
                :alt="nowPlaying.album"
                class="w-full h-full object-cover shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
              />
              
              <!-- Play indicator overlay -->
              <div v-if="nowPlaying.isPlaying" class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-opacity duration-300">
                <div class="music-equalizer">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>

            <!-- Song Info -->
            <div class="flex flex-col justify-between p-4 flex-1">
              <div>
                <div class="flex items-center gap-2">
                  <div class="status-indicator">
                    <IconPlayerPlay
                      v-if="nowPlaying.isPlaying"
                      class="w-3 h-3 sm:w-4 sm:h-4 text-green-500 animate-pulse"
                    />
                    <IconPlayerPause v-else class="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500" />
                  </div>
                  
                  <a
                    :href="nowPlaying.songUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm sm:text-base font-semibold hover:text-primary-500 transition-colors duration-200 truncate flex items-center gap-1"
                  >
                    {{ nowPlaying.title }}
                    <IconExternalLink class="w-3 h-3 opacity-50 inline-block" />
                  </a>
                </div>
                <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate">
                  {{ nowPlaying.artist }}
                </p>
                <p class="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                  {{ nowPlaying.album }}
                </p>
              </div>
              
              <div class="mt-2 sm:mt-2">
                <!-- Progress bar -->
                <div class="h-2 sm:h-1.5 w-full bg-neutral-200/70 dark:bg-neutral-700/70 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    class="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all ease-out duration-150"
                    :style="{ width: `${progressPercentage}%` }"
                  >
                    <div class="h-full bg-white/20 shine-animation"></div>
                  </div>
                </div>
                
                <!-- Time display -->
                <div class="flex justify-between text-[10px] sm:text-xs mt-1 text-neutral-500">
                  <span>{{ formatDuration(currentProgress) }}</span>
                  <span>{{ formatDuration(nowPlaying.duration) }}</span>
                </div>
              </div>
            </div>

            <!-- Spotify Logo -->
            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
              title="Open in Spotify"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Bottom animation bar -->
        <div
          v-if="nowPlaying.isPlaying"
          class="absolute bottom-0 left-0 h-0.5 spotify-progress-animation"
          style="animation-duration: 30s"
        ></div>
      </template>
    </UCard>
  </section>
</template>

<style scoped>
.spotify-card {
  transition: all 0.3s ease;
}

.card-hovering {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}

.music-bars {
  display: flex;
  align-items: flex-end;
  height: 32px;
  gap: 2px;
}

.music-bars span {
  display: block;
  width: 4px;
  background: linear-gradient(
    to top,
    rgb(var(--color-primary-500) / 1),
    rgb(var(--color-primary-300) / 1)
  );
  animation: music-bars-animation 1.5s infinite ease-in-out;
  border-radius: 1px;
}

.music-bars span:nth-child(1) {
  height: 60%;
  animation-delay: 0.1s;
}

.music-bars span:nth-child(2) {
  height: 30%;
  animation-delay: 0.2s;
}

.music-bars span:nth-child(3) {
  height: 90%;
  animation-delay: 0.3s;
}

.music-bars span:nth-child(4) {
  height: 40%;
  animation-delay: 0.4s;
}

.music-equalizer {
  display: flex;
  align-items: flex-end;
  height: 16px;
  gap: 2px;
  justify-content: center;
}

.music-equalizer span {
  display: block;
  width: 2px;
  background: white;
  animation: music-bars-animation 1.2s infinite ease-in-out;
  border-radius: 1px;
  opacity: 0.9;
}

.music-equalizer span:nth-child(1) {
  height: 60%;
  animation-delay: 0s;
}

.music-equalizer span:nth-child(2) {
  height: 100%;
  animation-delay: 0.3s;
}

.music-equalizer span:nth-child(3) {
  height: 75%;
  animation-delay: 0.6s;
}

.error-icon, .silent-icon {
  transition: transform 0.3s ease;
}

.error-icon:hover, .silent-icon:hover {
  transform: scale(1.05);
}

@keyframes music-bars-animation {
  0%,
  100% {
    height: 15%;
  }
  50% {
    height: 100%;
  }
}

.spotify-progress-animation {
  width: 0%;
  background: linear-gradient(to right, 
    theme("colors.green.500"), 
    theme("colors.green.400"),
    theme("colors.green.300")
  );
  animation-name: spotify-progress;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes spotify-progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.shine-animation {
  position: relative;
  overflow: hidden;
}

.shine-animation::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shine 2.5s infinite;
}

@keyframes shine {
  100% {
    left: 150%;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Improved transitions between states */
.spotify-card > *,
.spotify-card a,
.spotify-card img {
  transition: all 0.3s ease;
}

/* Status indicator styling */
.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  /* Updated card styling with margins instead of edge-to-edge */
  .spotify-card {
    margin-left: 0.75rem;  /* Add margin on left side */
    margin-right: 0.75rem; /* Add margin on right side */
    width: calc(100% - 1.5rem); /* Adjust width to account for margins */
    border-radius: 0.5rem; /* Restore rounded corners */
    border-left: 1px solid;  /* Restore left border */
    border-right: 1px solid; /* Restore right border */
    border-color: inherit;
  }
  
  /* Keep the rest of your mobile optimizations */
  .music-equalizer {
    height: 24px;
    gap: 3px;
  }
  
  .music-equalizer span {
    width: 3px;
  }
  
  /* Layout changes for "Playing" view */
  .status-indicator {
    min-width: 14px;
  }
  
  /* Adjust hover effects for touch devices */
  .card-hovering {
    transform: none;
    box-shadow: none;
  }
  
  /* Optimize album art display for mobile */
  .spotify-card img {
    object-fit: cover;
    width: 100%;
  }
}

/* Enhance tap area for buttons on mobile */
@media (max-width: 640px) {
  .spotify-card button,
  .spotify-card a {
    padding: 0.5rem;
    margin: -0.25rem;
  }
  
  /* Make text more readable on small screens */
  .spotify-card p {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>