<script setup lang="ts">
import { Contact } from '#components';
import { IconSend, IconLink } from '@tabler/icons-vue';
import { z } from 'zod';

// Define types for form data
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Create form state
const formState = ref<ContactFormData>({
  name: '',
  email: '',
  subject: '',
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
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
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
    
    // Check if submission was successful
    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }
    
    // Success
    isSubmitted.value = true;
    formState.value = { name: '', email: '', subject: '', message: '' };
    
  } catch (error) {
    // Handle validation or API errors
    hasError.value = true;
    
    if (error instanceof z.ZodError) {
      // Format validation errors
      errorMessage.value = error.errors.map(e => e.message).join(', ');
    } else {
      // Handle other errors
      errorMessage.value = 'An unexpected error occurred. Please try again.';
      console.error('Contact form error:', error);
    }
  } finally {
    isSubmitting.value = false;
  }
}

// Reset form after successful submission
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
          {{ 'Contact Me' }}
        </h2>
      </div>
    </a>
    
    <div class="w-full">
      <UCard
        class="w-full bg-white dark:bg-primary-950 border border-stone-200 dark:border-stone-600"
      >
        <div v-if="isSubmitted" class="flex flex-col gap-4 items-center justify-center py-6">
          <UIcon name="i-tabler-circle-check" class="text-5xl text-green-500" />
          <h3 class="text-xl font-bold">{{ $t('contact_success_title', 'Message Sent!') }}</h3>
          <p class="text-center text-neutral-600 dark:text-neutral-400">
            {{ $t('contact_success_message', 'Thank you for your message. I will get back to you as soon as possible.') }}
          </p>
          <UButton variant="solid" @click="resetForm">
            {{ $t('contact_send_another', 'Send Another Message') }}
          </UButton>
        </div>
        
        <form v-else @submit.prevent="submitForm" class="flex flex-col gap-4">
          <!-- Formspark honeypot spam prevention -->
          <input type="checkbox" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />
          
          <UFormGroup :label="$t('name', 'Name')">
            <UInput
              v-model="formState.name"
              :placeholder="$t('your_name', 'Your name')"
              type="text"
              required
            />
          </UFormGroup>
          
          <UFormGroup :label="$t('email', 'Email')">
            <UInput
              v-model="formState.email"
              :placeholder="$t('your_email', 'your.email@example.com')"
              type="email"
              required
            />
          </UFormGroup>
          
          <UFormGroup :label="$t('subject', 'Subject')">
            <UInput
              v-model="formState.subject"
              :placeholder="$t('message_subject', 'Message subject')"
              type="text"
              required
            />
          </UFormGroup>
          
          <UFormGroup :label="$t('message', 'Message')">
            <UTextarea
              v-model="formState.message"
              :placeholder="$t('your_message', 'Your message...')"
              row="5"
              required
              class="resize-none"
            />
          </UFormGroup>
          
          <UAlert
            v-if="hasError"
            color="red"
            variant="soft"
            title="Error"
            :description="errorMessage"
            class="mb-4"
          />
          
          <div class="flex justify-end">
            <UButton
              type="submit"
              variant="solid"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              <IconSend class="w-4 h-4 mr-1" />
              {{ $t('send_message', 'Send Message') }}
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </section>
</template>