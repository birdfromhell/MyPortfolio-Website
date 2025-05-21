<script setup lang="ts">
import {
  IconLink,
  IconSend,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconBrandTwitter,
} from "@tabler/icons-vue";
import { z } from "zod";
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
const formState = ref<ContactFormData>({
  name: "",
  email: "",
  message: "",
});
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const formFocused = ref<string | null>(null);
const FORMSPARK_URL = "https://submit-form.com/25uytm42L";
const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
});
const { t } = useI18n();
const socialLinks = [
  {
    name: "GitHub",
    icon: "i-tabler-brand-github",
    url: "https://github.com/birdfromhell",
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    name: "LinkedIn",
    icon: "i-tabler-brand-linkedin",
    url: "https://linkedin.com/in/ababil-mustaqim-1",
    color: "hover:text-blue-700 dark:hover:text-blue-400",
  },
  {
    name: "Instagram",
    icon: "i-tabler-brand-instagram",
    url: "https://instagram/aababiil",
    color: "hover:text-purple-500 dark:hover:text-purple-400",
  },
  {
    name: "Email",
    icon: "i-tabler-mail",
    url: "mailto:ababilmustaqim@proton.me",
    color: "hover:text-red-500 dark:hover:text-red-400",
  },
];
async function submitForm() {
  try {
    isSubmitting.value = true;
    hasError.value = false;
    schema.parse(formState.value);
    const response = await fetch(FORMSPARK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formState.value),
    });
    if (!response.ok) {
      throw new Error(`Form submission failed with status ${response.status}`);
    }
    isSubmitted.value = true;
    formState.value = { name: "", email: "", message: "" };
  } catch (error) {
    hasError.value = true;
    if (error instanceof z.ZodError) {
      errorMessage.value = error.errors.map((e) => e.message).join(", ");
    } else {
      errorMessage.value = "An unexpected error occurred. Please try again.";
      console.error("Contact form error:", error);
    }
  } finally {
    isSubmitting.value = false;
  }
}
function resetForm() {
  isSubmitted.value = false;
  hasError.value = false;
  errorMessage.value = "";
}
function handleFocus(field: string) {
  formFocused.value = field;
}
function handleBlur() {
  formFocused.value = null;
}
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#contact" class="self-start">
      <div class="flex flex-row gap-1 items-center group relative mb-2">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2 class="text-xl font-bold hover:cursor-pointer flex items-center">
          <span>{{ $t("contact", "Contact") }}</span>
          <span class="ml-2 inline-block relative">
            <span
              class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"
            ></span>
          </span>
        </h2>
      </div>
    </a>
    <div class="grid md:grid-cols-5 gap-6">
      <UCard
        class="md:col-span-2 bg-gray-50 dark:bg-gray-900/50 border-none"
        :ui="{ body: { padding: 'p-5' } }"
      >
        <div class="flex flex-col h-full justify-between">
          <div>
            <h3 class="text-lg font-medium mb-2">
              {{ $t("getInTouch", "Get in Touch") }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {{
                $t(
                  "contactDescription",
                  "Have a project in mind or just want to say hello? Feel free to reach out!"
                )
              }}
            </p>
          </div>
          <div class="mt-auto">
            <h4 class="text-sm font-medium mb-3">
              {{ $t("connectWithMe", "Connect with me") }}
            </h4>
            <div class="flex flex-wrap gap-3">
              <UButton
                v-for="link in socialLinks"
                :key="link.name"
                :to="link.url"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                size="sm"
                class="transition-all duration-300"
                :class="link.color"
              >
                <UIcon :name="link.icon" class="w-5 h-5" />
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
      <UCard
        class="md:col-span-3 shadow-sm hover:shadow transition-shadow duration-300"
        :ui="{ body: { padding: 'p-5' } }"
      >
        <div
          v-if="isSubmitted"
          class="py-10 flex flex-col items-center justify-center text-center"
        >
          <div class="success-checkmark mb-6">
            <div class="check-icon">
              <span class="icon-line line-tip"></span>
              <span class="icon-line line-long"></span>
              <div class="icon-circle"></div>
              <div class="icon-fix"></div>
            </div>
          </div>
          <h3
            class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200"
          >
            {{ $t("messageSent", "Message Sent!") }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{
              $t(
                "thankYouMessage",
                "Thank you for reaching out. I'll get back to you as soon as possible."
              )
            }}
          </p>
          <UButton
            variant="outline"
            @click="resetForm"
            size="sm"
            icon="i-tabler-refresh"
          >
            {{ $t("sendAnotherMessage", "Send another message") }}
          </UButton>
        </div>
        <form v-else @submit.prevent="submitForm" class="flex flex-col gap-4">
          <input
            type="checkbox"
            name="_honeypot"
            style="display: none"
            tabindex="-1"
            autocomplete="off"
          />
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="relative">
              <UInput
                v-model="formState.name"
                :placeholder="$t('yourName', 'Your name')"
                type="text"
                required
                :ui="{
                  base: 'transition-all duration-300',
                  icon: { leading: { pointer: '' } },
                }"
                @focus="handleFocus('name')"
                @blur="handleBlur"
                icon="i-tabler-user"
                :class="{ 'input-focused': formFocused === 'name' }"
              />
              <transition name="scale">
                <small
                  v-if="formFocused === 'name'"
                  class="text-xs text-gray-500 dark:text-gray-400 absolute -bottom-5 left-1"
                >
                  {{ $t("nameField", "Your full name") }}
                </small>
              </transition>
            </div>
            <div class="relative">
              <UInput
                v-model="formState.email"
                :placeholder="$t('yourEmail', 'Your email')"
                type="email"
                required
                :ui="{
                  base: 'transition-all duration-300',
                  icon: { leading: { pointer: '' } },
                }"
                @focus="handleFocus('email')"
                @blur="handleBlur"
                icon="i-tabler-mail"
                :class="{ 'input-focused': formFocused === 'email' }"
              />
              <transition name="scale">
                <small
                  v-if="formFocused === 'email'"
                  class="text-xs text-gray-500 dark:text-gray-400 absolute -bottom-5 left-1"
                >
                  {{ $t("emailField", "Where I can reach you") }}
                </small>
              </transition>
            </div>
          </div>
          <div class="relative">
            <UTextarea
              v-model="formState.message"
              :placeholder="$t('yourMessage', 'Your message...')"
              row="4"
              required
              class="resize-none transition-all duration-300"
              :ui="{
                base: 'transition-all duration-300',
                icon: { leading: { pointer: '' } },
              }"
              @focus="handleFocus('message')"
              @blur="handleBlur"
              icon="i-tabler-message"
              :class="{ 'input-focused': formFocused === 'message' }"
            />
            <transition name="scale">
              <small
                v-if="formFocused === 'message'"
                class="text-xs text-gray-500 dark:text-gray-400 absolute -bottom-5 left-1"
              >
                {{
                  $t("messageField", "Tell me about your project or question")
                }}
              </small>
            </transition>
          </div>
          <transition name="slide">
            <p
              v-if="hasError"
              class="text-sm text-red-500 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-md"
            >
              <UIcon
                name="i-tabler-alert-circle"
                class="w-4 h-4 mr-1 inline-block"
              />
              {{ errorMessage }}
            </p>
          </transition>
          <UButton
            type="submit"
            variant="solid"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="mt-2 submit-button transition-all duration-300"
          >
            <IconSend class="w-4 h-4 mr-2" />
            {{ $t("sendMessage", "Send Message") }}
          </UButton>
        </form>
      </UCard>
    </div>
  </section>
</template>
<style scoped>
.input-focused {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.success-checkmark {
  width: 80px;
  height: 80px;
  position: relative;
}
.success-checkmark .check-icon {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid rgb(var(--color-green-500));
}
.success-checkmark .check-icon::before {
  top: 3px;
  left: -2px;
  width: 30px;
  transform-origin: 100% 50%;
  border-radius: 100px 0 0 100px;
}
.success-checkmark .check-icon::after {
  top: 0;
  left: 30px;
  width: 60px;
  transform-origin: 0 50%;
  border-radius: 0 100px 100px 0;
  animation: rotate-circle 4.25s ease-in;
}
.success-checkmark .check-icon::before,
.success-checkmark .check-icon::after {
  content: "";
  height: 100px;
  position: absolute;
  background: transparent;
  transform: rotate(-45deg);
}
.success-checkmark .check-icon .icon-line {
  height: 5px;
  background-color: rgb(var(--color-green-500));
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 10;
}
.success-checkmark .check-icon .icon-line.line-tip {
  top: 46px;
  left: 14px;
  width: 25px;
  transform: rotate(45deg);
  animation: icon-line-tip 0.75s;
}
.success-checkmark .check-icon .icon-line.line-long {
  top: 38px;
  right: 8px;
  width: 47px;
  transform: rotate(-45deg);
  animation: icon-line-long 0.75s;
}
.success-checkmark .check-icon .icon-circle {
  top: -4px;
  left: -4px;
  z-index: 10;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  box-sizing: content-box;
  border: 4px solid rgba(76, 175, 80, 0.5);
}
.success-checkmark .check-icon .icon-fix {
  top: 8px;
  width: 5px;
  left: 26px;
  z-index: 1;
  height: 85px;
  position: absolute;
  transform: rotate(-45deg);
  background-color: transparent;
}
@keyframes rotate-circle {
  0% {
    transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
  }
}
@keyframes icon-line-tip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 46px;
  }
}
@keyframes icon-line-long {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
</style>
