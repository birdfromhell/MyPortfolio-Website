<template>
    <div class="bg-gray-900 text-white p-4 rounded-xl shadow-lg w-full max-w-md">
      <div v-if="isPlaying && track">
        <div class="flex items-center space-x-4">
          <img :src="track.album.images[0].url" alt="Album Art" class="w-16 h-16 rounded-md" />
          <div>
            <h3 class="text-lg font-semibold">{{ track.name }}</h3>
            <p class="text-sm text-gray-300">{{ track.artists.map(a => a.name).join(', ') }}</p>
          </div>
        </div>
        <p class="text-sm text-green-400 mt-2">🎵 Currently Playing</p>
      </div>
      <div v-else>
        <p class="text-gray-400">No music is currently playing.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const track = ref(null)
  const isPlaying = ref(false)
  
  const accessToken = 'YOUR_SPOTIFY_ACCESS_TOKEN' // Ganti dengan token kamu
  
  const fetchCurrentlyPlaying = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
  
      if (response.status === 204 || response.data === '') {
        isPlaying.value = false
        return
      }
  
      isPlaying.value = response.data.is_playing
      track.value = response.data.item
    } catch (error) {
      console.error('Failed to fetch now playing:', error)
    }
  }
  
  onMounted(() => {
    fetchCurrentlyPlaying()
  
    // Optional: refresh every 30 seconds
    setInterval(fetchCurrentlyPlaying, 30000)
  })
  </script>
  
  <style scoped>
  /* Optional Tailwind is already used */
  </style>
  