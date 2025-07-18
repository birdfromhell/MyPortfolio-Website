<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-indigo-950 flex items-center justify-center p-4">
    <div class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-2xl max-w-md w-full p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-tabler-shield-lock" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Admin Access
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400 text-sm">
          Enter your 6-digit PIN to access the admin dashboard
        </p>
      </div>

      <!-- PIN Input -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 text-center">
            Enter PIN
          </label>
          <div class="flex justify-center gap-2">
            <input
              v-for="(digit, index) in pinDigits"
              :key="index"
              :ref="(el) => setInputRef(el, index)"
              v-model="pinDigits[index]"
              type="password"
              maxlength="1"
              class="w-12 h-12 text-center text-xl font-bold bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all"
              :class="{ 
                'border-red-500 focus:border-red-500 focus:ring-red-500': hasError,
                'border-green-500 focus:border-green-500 focus:ring-green-500': isSuccess
              }"
              @input="handleInput(index)"
              @keydown="handleKeydown(index, $event)"
              @paste="handlePaste"
            />
          </div>
        </div>

        <!-- Error Message -->
        <Transition
          enter-active-class="duration-300 ease-out"
          enter-from-class="opacity-0 transform scale-95"
          enter-to-class="opacity-100 transform scale-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100 transform scale-100"
          leave-to-class="opacity-0 transform scale-95"
        >
          <div
            v-if="hasError"
            class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-tabler-alert-circle" class="w-4 h-4 text-red-600 dark:text-red-400" />
              <span class="text-sm text-red-800 dark:text-red-400">{{ errorMessage }}</span>
            </div>
          </div>
        </Transition>

        <!-- Submit Button -->
        <button
          @click="submitPin"
          :disabled="isLoading || !isPinComplete"
          class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div v-if="isLoading" class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
            <span>Verifying...</span>
          </div>
          <span v-else>
            {{ isPinComplete ? 'Access Dashboard' : 'Enter PIN' }}
          </span>
        </button>

        <!-- Attempts Counter -->
        <div v-if="attempts > 0" class="text-center">
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ maxAttempts - attempts }} attempts remaining
          </p>
        </div>

        <!-- Lockout Message -->
        <div
          v-if="isLockedOut"
          class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-tabler-clock" class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span class="text-sm text-yellow-800 dark:text-yellow-400">
              Too many failed attempts. Try again in {{ Math.ceil(lockoutTime / 1000) }} seconds.
            </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <UIcon name="i-tabler-info-circle" class="w-3 h-3" />
          <span>Secure admin authentication</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  onSuccess: () => void
}

const props = defineProps<Props>()

// State
const pinDigits = ref<string[]>(Array(6).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])
const isLoading = ref(false)
const hasError = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const attempts = ref(0)
const maxAttempts = 5
const isLockedOut = ref(false)
const lockoutTime = ref(0)

// Computed
const isPinComplete = computed(() => {
  return pinDigits.value.every(digit => digit.length === 1)
})

const currentPin = computed(() => {
  return pinDigits.value.join('')
})

// Methods
const setInputRef = (el: HTMLInputElement | null, index: number) => {
  if (el) {
    inputRefs.value[index] = el
  }
}

const handleInput = (index: number) => {
  const value = pinDigits.value[index]
  
  // Clear error state when user starts typing
  if (hasError.value) {
    hasError.value = false
  }
  
  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    pinDigits.value[index] = ''
    return
  }
  
  // Move to next input if digit entered
  if (value && index < 5) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
  
  // Auto-submit when all digits entered
  if (isPinComplete.value) {
    nextTick(() => {
      submitPin()
    })
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!pinDigits.value[index] && index > 0) {
      pinDigits.value[index - 1] = ''
      nextTick(() => {
        inputRefs.value[index - 1]?.focus()
      })
    }
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
  
  // Handle Enter
  if (event.key === 'Enter' && isPinComplete.value) {
    submitPin()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasteData = event.clipboardData?.getData('text') || ''
  const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('')
  
  digits.forEach((digit, index) => {
    if (index < 6) {
      pinDigits.value[index] = digit
    }
  })
  
  // Focus the next empty input or the last one
  const nextIndex = Math.min(digits.length, 5)
  nextTick(() => {
    inputRefs.value[nextIndex]?.focus()
  })
}

const submitPin = async () => {
  if (!isPinComplete.value || isLoading.value || isLockedOut.value) return
  
  isLoading.value = true
  hasError.value = false
  isSuccess.value = false
  
  try {
    const response = await $fetch('/api/admin/auth', {
      method: 'POST',
      body: { pin: currentPin.value }
    })
    
    if (response.success) {
      isSuccess.value = true
      
      // Store auth token
      const authCookie = useCookie('admin-auth', {
        default: () => null,
        maxAge: 60 * 60 * 24, // 24 hours
        secure: true,
        sameSite: 'strict'
      })
      authCookie.value = response.token
      
      // Success feedback
      await new Promise(resolve => setTimeout(resolve, 500))
      props.onSuccess()
    } else {
      throw new Error(response.message || 'Invalid PIN')
    }
  } catch (error: any) {
    attempts.value++
    hasError.value = true
    errorMessage.value = error.data?.message || error.message || 'Invalid PIN'
    
    // Check for lockout
    if (attempts.value >= maxAttempts) {
      isLockedOut.value = true
      lockoutTime.value = 30000 // 30 seconds
      
      // Start lockout countdown
      const interval = setInterval(() => {
        lockoutTime.value -= 1000
        if (lockoutTime.value <= 0) {
          clearInterval(interval)
          isLockedOut.value = false
          attempts.value = 0
        }
      }, 1000)
    }
    
    // Clear PIN
    pinDigits.value = Array(6).fill('')
    nextTick(() => {
      inputRefs.value[0]?.focus()
    })
  } finally {
    isLoading.value = false
  }
}

// Auto-focus first input on mount
onMounted(() => {
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
})
</script>
