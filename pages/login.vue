<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: "auth",
});

// Explicitly import useAuth for clarity
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const email = ref("");
const password = ref("");
const error = ref("");
const isPending = ref(false);

// Auth is now initialized in the plugin, no need to initialize here
// But we'll keep this for safety
onMounted(() => {
  auth.initAuth();
});

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Please enter both email and password";
    return;
  }

  isPending.value = true;
  error.value = "";

  try {
    const result = await auth.login(email.value, password.value);
    if (result.success) {
      navigateTo("/dashboard");
    } else {
      error.value = result.message || "Login failed";
    }
  } catch (e) {
    error.value = "An unexpected error occurred";
    console.error(e);
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <div>
    <!-- Logo and title -->
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold">Learning Dashboard</h2>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Sign in to manage your learning
      </p>
    </div>

    <!-- Login form -->
    <UCard class="w-full p-6">
      <form @submit.prevent="handleLogin">
        <div class="space-y-6">
          <!-- Email field -->
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="email"
              placeholder="admin@example.com"
              type="email"
              autocomplete="email"
              required
            />
          </UFormGroup>

          <!-- Password field -->
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
          </UFormGroup>

          <!-- Error message -->
          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            :title="error"
            class="mb-4"
            icon="i-tabler-alert-circle"
          />

          <!-- Submit button -->
          <UButton type="submit" block :loading="isPending" color="primary">
            Sign In
          </UButton>

          <!-- Demo credentials -->
          <div class="text-center mt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Demo: admin@example.com / password
            </p>
          </div>
        </div>
      </form>

      <!-- Return to portfolio -->
      <div class="mt-8 text-center">
        <UButton to="/" variant="link" color="gray" size="sm">
          <template #leading>
            <i class="i-tabler-arrow-left text-sm"></i>
          </template>
          Return to Portfolio
        </UButton>
      </div>
    </UCard>
  </div>
</template>
