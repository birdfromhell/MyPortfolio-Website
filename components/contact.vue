<script setup lang="ts">
import { IconLink } from '@tabler/icons-vue';
import { z } from 'zod';

// Define types for form data
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Create form state
const formState = ref<ContactFormData>({
  name: '',
  email: '',
  message: ''
});

// Form status
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const hasError = ref(false);
const errorMessage = ref('');

// Formspark submission URL
const FORMSPARK_URL = 'https://submit-form.com/25uytm42L';

// Create form validation schema
const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

// Handle form submission
async function submitForm() {
  try {
    isSubmitting.value = true;
    hasError.value = false;
    
    // Validate form data
    schema.parse(formState.value);
    
    // Submit form data to Formspark
    const response = await fetch(FORMSPARK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formState.value)
    });
    
    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }
    
    isSubmitted.value = true;
    formState.value = { name: '', email: '', message: '' };
    
  } catch (error) {
    hasError.value = true;
    
    if (error instanceof z.ZodError) {
      errorMessage.value = error.errors.map(e => e.message).join(', ');
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.';
      console.error('Contact form error:', error);
    }
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  isSubmitted.value = false;
  hasError.value = false;
  errorMessage.value = '';
}
</script>

<template>
  <section class="flex flex-col gap-3">
    <a href="#contact">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer">
          Contact
        </h2>
      </div>
    </a>
    
    <div v-if="isSubmitted" class="text-center py-6">
      <UIcon name="i-tabler-circle-check" class="text-4xl text-green-500 mb-2" />
      <p class="text-neutral-600 dark:text-neutral-400 mb-4">
        Thank you for your message. I'll get back to you soon.
      </p>
      <UButton variant="ghost" @click="resetForm" size="sm">
        Send another message
      </UButton>
    </div>
    
    <form v-else @submit.prevent="submitForm" class="flex flex-col gap-3">
      <!-- Honeypot field for spam prevention -->
      <input type="checkbox" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />
      
      <div class="grid gap-3 sm:grid-cols-2">
        <UInput
          v-model="formState.name"
          placeholder="Your name"
          type="text"
          required
        />
        
        <UInput
          v-model="formState.email"
          placeholder="Your email"
          type="email"
          required
        />
      </div>
      
      <UTextarea
        v-model="formState.message"
        placeholder="Your message..."
        row="4"
        required
        class="resize-none"
      />
      
      <p v-if="hasError" class="text-sm text-red-500">
        {{ errorMessage }}
      </p>
      
      <UButton
        type="submit"
        variant="solid"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        block
      >
        Send Message
      </UButton>
    </form>
  </section>
</template>