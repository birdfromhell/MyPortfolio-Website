<script setup lang="ts">
import {
  IconLink,
  IconTools,
  IconTool,
  IconBrandGithub,
} from "@tabler/icons-vue";
type LocaleType = "en" | "id";
interface ContentExperience {
  _id?: string;
  _path?: string;
  company?: string;
  companyUrl?: string;
  position?: string;
  period?: {
    start?: string;
    end?: string;
  };
  type?: string;
  content?: {
    en?: string;
    id?: string;
    [key: string]: string | undefined;
  };
  technologies?: string[];
  body?: any;
}
const { locale } = useI18n();
const currentLocale = computed<LocaleType>(() => {
  return locale.value === "en" || locale.value === "id" ? locale.value : "en";
});
const { data: experiences } = await useAsyncData<ContentExperience[]>(
  "experiences",
  () => queryContent("/experiences").sort({ _file: -1 }).find()
);
const getLocalizedContent = (exp: ContentExperience): string => {
  if (exp.content && exp.content[currentLocale.value]) {
    return exp.content[currentLocale.value] || "";
  }
  const company = exp.company?.toLowerCase().replace(/[^a-z]/g, "");
  if (company) {
    const i18n = useI18n();
    if (i18n.te(`${company}.1`)) {
      return i18n.t(`${company}.1`) + "<br><br>" + i18n.t(`${company}.2`);
    }
  }
  return "";
};
const techModalOpen = ref<string | null>(null);
const expandedDescriptions = ref<Set<string>>(new Set());
function toggleDescription(expId: string) {
  const expanded = expandedDescriptions.value;
  if (expanded.has(expId)) {
    expanded.delete(expId);
  } else {
    expanded.add(expId);
  }
  expandedDescriptions.value = new Set(expanded);
}
function isDescriptionExpanded(expId: string): boolean {
  return expandedDescriptions.value.has(expId);
}
function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}
function needsTruncation(text: string, maxLength: number = 200): boolean {
  return text.length > maxLength;
}
function openTechModal(expId: string) {
  techModalOpen.value = expId;
}
function closeTechModal() {
  techModalOpen.value = null;
}
function isTechnoAvailable(tech: string): boolean {
  return !!(tech && tech.trim().length > 0);
}
</script>
<template>
  <section class="flex flex-col gap-8">
    <div class="relative">
      <a href="#experience">
        <div class="flex flex-row gap-3 items-center group relative">
          <div class="relative">
            <div
              class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            >
              <IconLink class="w-5 h-5 text-white" />
            </div>
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
            ></div>
          </div>
          <div class="flex flex-col">
            <h2
              class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent hover:cursor-pointer"
            >
              {{ $t("experience") }}
            </h2>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ $t("myProfessionalJourney", "My Professional Journey") }}
            </p>
          </div>
        </div>
      </a>
    </div>
    <div class="relative">
      <div
        class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-transparent hidden sm:block"
      ></div>
      <div class="space-y-8">
        <div
          v-for="(exp, index) in experiences"
          :key="exp?._id || index"
          class="experience-card group relative"
          :style="{ '--index': index }"
        >
          <div
            class="absolute left-4 w-4 h-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full border-4 border-white dark:border-neutral-900 shadow-lg group-hover:scale-125 transition-transform duration-300 z-10 hidden sm:block"
          ></div>
          <div
            class="sm:ml-12 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-primary-200 dark:group-hover:border-primary-800 overflow-hidden"
          >
            <div
              class="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/30 dark:to-primary-800/30 p-6 border-b border-neutral-100 dark:border-neutral-800"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <span class="text-white font-bold text-lg">{{
                        exp.company?.charAt(0)
                      }}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex flex-col gap-2">
                        <div
                          class="flex flex-col sm:flex-row sm:items-center gap-2"
                        >
                          <a
                            v-if="exp.companyUrl"
                            class="text-xl font-bold hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
                            :href="exp.companyUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {{ exp.company }}
                            <IconLink class="w-4 h-4 opacity-60" />
                          </a>
                          <span v-else class="text-xl font-bold">{{
                            exp.company
                          }}</span>
                        </div>
                        <div
                          class="flex flex-col sm:flex-row sm:items-center gap-2"
                        >
                          <p
                            v-if="exp.position"
                            class="text-primary-600 dark:text-primary-400 font-medium"
                          >
                            {{ $t(exp.position) || exp.position }}
                          </p>
                          <span
                            v-if="exp.type"
                            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 dark:from-primary-800 dark:to-primary-700 dark:text-primary-200 shadow-sm border border-primary-200 dark:border-primary-600 w-fit"
                          >
                            <span
                              class="w-1.5 h-1.5 bg-primary-500 rounded-full mr-1.5"
                            ></span>
                            {{ $t(exp.type) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm"
                >
                  <div
                    class="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm"
                  >
                    <div class="flex items-center gap-1">
                      <svg
                        class="w-3 h-3 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        class="text-neutral-600 dark:text-neutral-400 font-medium"
                      >
                        {{ exp.period?.start }} - {{ exp.period?.end }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-4">
              <div class="prose dark:prose-invert max-w-none">
                <div class="relative">
                  <p
                    class="text-neutral-700 dark:text-neutral-300 leading-relaxed"
                  >
                    <span
                      v-html="
                        isDescriptionExpanded(exp._id || String(index))
                          ? getLocalizedContent(exp)
                          : truncateText(
                              getLocalizedContent(exp).replace(/<[^>]*>/g, ''),
                              200
                            )
                      "
                    ></span>
                  </p>
                  <div
                    v-if="
                      needsTruncation(
                        getLocalizedContent(exp).replace(/<[^>]*>/g, ''),
                        200
                      )
                    "
                    class="mt-3"
                  >
                    <button
                      @click="toggleDescription(exp._id || String(index))"
                      class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 group"
                    >
                      <span>{{
                        isDescriptionExpanded(exp._id || String(index))
                          ? $t("readLess", "Read Less")
                          : $t("readMore", "Read More")
                      }}</span>
                      <svg
                        class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        :class="{
                          'rotate-180': isDescriptionExpanded(
                            exp._id || String(index)
                          ),
                        }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-between items-center pt-4 border-t border-neutral-100 dark:border-neutral-800"
              >
                <button
                  v-if="exp.technologies && exp.technologies.length > 0"
                  @click="openTechModal(exp._id || String(index))"
                  class="modern-tech-button group relative inline-flex items-center gap-3 px-6 py-3 rounded-xl overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div class="relative z-10 flex items-center gap-2">
                    <IconTools
                      class="w-5 h-5 transition-transform group-hover:rotate-12 duration-300"
                    />
                    <span>{{ $t("techUsed", "Tech Used") }}</span>
                    <span
                      class="bg-white/20 text-xs px-2 py-1 rounded-full font-bold"
                    >
                      {{ exp.technologies.length }}
                    </span>
                  </div>
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  ></div>
                </button>
                <div
                  class="text-6xl font-bold text-neutral-100 dark:text-neutral-800 select-none"
                >
                  {{ String(index + 1).padStart(2, "0") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="(exp, index) in experiences"
      :key="`modal-${exp?._id || index}`"
    >
      <UModal
        :model-value="techModalOpen === (exp._id || String(index))"
        @close="closeTechModal"
        :ui="{
          overlay: {
            background: 'bg-black/80 backdrop-blur-sm',
          },
          container: 'flex items-center justify-center p-4',
        }"
      >
        <UCard
          :ui="{
            base: 'tech-modal overflow-hidden max-w-4xl w-full',
            ring: 'ring-0',
            divide: 'divide-y divide-neutral-100 dark:divide-neutral-800',
            header: {
              padding: 'p-6 bg-gradient-to-r from-primary-500 to-primary-600',
            },
            body: {
              padding: 'p-6',
            },
          }"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                >
                  <IconTool class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">
                    {{ $t("technologiesUsed", "Technologies Used") }}
                  </h3>
                  <p class="text-primary-100 text-sm">
                    {{ exp.company }}
                    <template v-if="exp.position">
                      - {{ $t(exp.position) || exp.position }}
                    </template>
                  </p>
                </div>
              </div>
              <UButton
                color="white"
                variant="ghost"
                icon="i-tabler-x"
                @click="closeTechModal"
                class="hover:rotate-90 transition-transform duration-300 text-white hover:bg-white/10"
              />
            </div>
          </template>
          <div class="max-h-[70vh] overflow-y-auto space-y-6">
            <template v-if="exp.technologies && exp.technologies.length > 0">
              <div
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                <div
                  v-for="tech in exp.technologies"
                  :key="tech"
                  class="tech-item group relative flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg cursor-pointer"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 rounded-xl transition-all duration-300"
                  ></div>
                  <div
                    class="relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                  >
                    <Techno :techno="tech" size="medium" class="w-8 h-8" />
                  </div>
                  <p
                    class="relative z-10 text-sm font-medium text-center text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
                  >
                    {{ tech }}
                  </p>
                  <div
                    class="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-200 dark:group-hover:border-primary-700 transition-colors duration-300"
                  ></div>
                </div>
              </div>
            </template>
            <div v-else class="text-center py-12">
              <div
                class="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <IconBrandGithub class="w-10 h-10 text-neutral-400" />
              </div>
              <p class="text-neutral-500 text-lg">
                {{ $t("noTechFound", "No technologies specified") }}
              </p>
            </div>
          </div>
          <template #footer>
            <div
              class="flex justify-center p-4 bg-neutral-50 dark:bg-neutral-900"
            >
              <UButton
                variant="soft"
                color="primary"
                @click="closeTechModal"
                class="px-8 py-2"
              >
                {{ $t("close", "Close") }}
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </section>
</template>
<style scoped>
.inline-flex.items-center.px-3 {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}
.inline-flex.items-center.px-3:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(var(--color-primary-500), 0.25);
}
@media (max-width: 640px) {
  .inline-flex.items-center.px-3 {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    margin-top: 0.25rem;
  }
  .flex.flex-col.gap-2 {
    gap: 0.5rem;
  }
  .flex.flex-col.sm\\:flex-row.sm\\:items-center.gap-2 {
    gap: 0.375rem;
  }
  .bg-white.dark\\:bg-neutral-800.px-3 {
    width: 100%;
    text-align: center;
  }
  .w-12.h-12.bg-gradient-to-br {
    width: 2.5rem;
    height: 2.5rem;
  }
  .w-12.h-12.bg-gradient-to-br span {
    font-size: 0.875rem;
  }
}
.prose p {
  transition: all 0.3s ease;
}
button:has(svg) {
  position: relative;
  overflow: hidden;
}
button:has(svg)::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}
button:has(svg):hover::before {
  width: 100%;
}
.prose .relative {
  transition: max-height 0.3s ease-out;
}
.experience-card {
  animation: slideInFromLeft 0.6s ease-out forwards;
  animation-delay: calc(var(--index, 0) * 0.1s);
  opacity: 0;
  transform: translateX(-20px);
}
@keyframes slideInFromLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.modern-tech-button {
  position: relative;
  overflow: hidden;
}
.modern-tech-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s;
}
.modern-tech-button:hover::before {
  left: 100%;
}
.experience-card:hover .absolute.left-4 {
  box-shadow: 0 0 20px rgba(var(--color-primary-500), 0.5);
}
.tech-modal {
  animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.tech-item {
  position: relative;
  overflow: hidden;
}
.tech-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    to right,
    var(--color-primary-500, #3b82f6),
    var(--color-primary-300, #93c5fd)
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  border-radius: 0 0 8px 8px;
}
.tech-item:hover::before {
  transform: scaleX(1);
}
.experience-card:hover .bg-white {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.bg-gradient-to-r.from-neutral-900.to-neutral-700 {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}
.experience-card:hover .w-12.h-12.bg-gradient-to-br {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 25px rgba(var(--color-primary-500), 0.3);
}
.experience-card:hover .text-6xl {
  transform: scale(1.05);
  background: linear-gradient(
    45deg,
    var(--color-primary-500),
    var(--color-primary-300)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (max-width: 640px) {
  .experience-card {
    animation-delay: calc(var(--index, 0) * 0.05s);
  }
  .tech-modal {
    max-width: 95vw;
  }
}
@media (prefers-color-scheme: dark) {
  .experience-card:hover .bg-white {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4),
      0 10px 10px -5px rgba(0, 0, 0, 0.2);
  }
}
.modern-tech-button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
.tech-item:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 12px;
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
