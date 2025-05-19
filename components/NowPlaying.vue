<script setup lang="ts">
import {
  IconLink,
  IconMusic,
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
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
      class="spotify-card relative overflow-hidden group transition-all duration-300"
      :ui="{
        body: { padding: 'p-0' },
        background:
          'bg-white dark:bg-primary-950 border border-stone-200 dark:border-stone-600',
        ring: '',
      }"
    >
      <template v-if="isLoading">
        <div class="flex items-center justify-center p-6">
          <div class="music-bars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </template>
      <template v-else-if="error">
        <div class="flex flex-col items-center justify-center p-6 gap-2">
          <IconVolume class="text-neutral-400 w-10 h-10" />
          <p class="text-sm text-neutral-500">{{ error }}</p>
          <UButton
            size="sm"
            @click="fetchNowPlaying"
            variant="soft"
            class="mt-2"
          >
            {{ $t("try_again", "Try Again") }}
          </UButton>
        </div>
      </template>
      <template v-else-if="nowPlaying && !nowPlaying.isPlaying">
        <div class="flex flex-col items-center justify-center p-6 gap-2">
          <IconVolume class="text-neutral-400 w-10 h-10" />
          <p class="text-sm text-neutral-500">
            {{ $t("not_playing", "Ababil Not playing anything right now") }}
          </p>
        </div>
      </template>
      <template v-else-if="nowPlaying">
        <div class="flex flex-row p-0">
          <div class="w-24 h-24 sm:w-32 sm:h-32">
            <img
              :src="nowPlaying.albumImageUrl"
              :alt="nowPlaying.album"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex flex-col justify-between p-3 sm:p-4 flex-1">
            <div>
              <div class="flex items-center gap-2">
                <IconPlayerPlay
                  v-if="nowPlaying.isPlaying"
                  class="w-4 h-4 text-primary-500 animate-pulse"
                />
                <IconPlayerPause v-else class="w-4 h-4 text-neutral-500" />
                <a
                  :href="nowPlaying.songUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold hover:text-primary-500 transition-colors duration-200 truncate"
                >
                  {{ nowPlaying.title }}
                </a>
              </div>
              <p
                class="text-sm text-neutral-600 dark:text-neutral-400 truncate"
              >
                {{ nowPlaying.artist }}
              </p>
              <p
                class="text-xs text-neutral-500 dark:text-neutral-500 truncate"
              >
                {{ nowPlaying.album }}
              </p>
            </div>
            <div class="mt-2">
              <div
                class="h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"
              >
                <div
                  class="h-1 bg-primary-500 rounded-full"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
              <div class="flex justify-between text-xs mt-1 text-neutral-500">
                <span>{{ formatDuration(currentProgress) }}</span>
                <span>{{ formatDuration(nowPlaying.duration) }}</span>
              </div>
            </div>
          </div>
          <div class="absolute top-2 right-2 opacity-50">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
          </div>
        </div>
        <div
          class="absolute bottom-0 left-0 h-0.5 bg-primary-500/50 spotify-progress-animation"
          style="animation-duration: 30s"
        ></div>
      </template>
    </UCard>
  </section>
</template>
<style scoped>
.music-bars {
  display: flex;
  align-items: flex-end;
  height: 24px;
  gap: 2px;
}
.music-bars span {
  display: block;
  width: 3px;
  background: linear-gradient(
    to top,
    theme("colors.primary.500"),
    theme("colors.primary.300")
  );
  animation: music-bars-animation 1.5s infinite ease-in-out;
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
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
