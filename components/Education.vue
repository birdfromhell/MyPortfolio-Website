<script setup lang="ts">
import {
  IconLink,
  IconSchool,
  IconMapPin,
  IconCalendar,
  IconExternalLink,
} from "@tabler/icons-vue";

type LocaleType = "en" | "id";

interface ContentEducation {
  _id?: string;
  _path?: string;
  institution?: string;
  website?: string;
  degree?: string;
  period?: {
    start?: string;
    end?: string;
  };
  location?: string;
  content?: {
    en?: string;
    id?: string;
    [key: string]: string | undefined;
  };
}

const { locale } = useI18n();

const currentLocale = computed<LocaleType>(() => {
  return locale.value === "en" || locale.value === "id" ? locale.value : "en";
});

const { data: education } = await useAsyncData<ContentEducation[]>(
  "education",
  () => queryContent("/education").sort({ "period.start": -1 }).find()
);

const getLocalizedContent = (edu: ContentEducation): string => {
  if (edu.content && edu.content[currentLocale.value]) {
    return edu.content[currentLocale.value] || "";
  }
  return "";
};

// Read More functionality
const expandedDescriptions = ref<Set<string>>(new Set());

function toggleDescription(eduId: string) {
  const expanded = expandedDescriptions.value;
  if (expanded.has(eduId)) {
    expanded.delete(eduId);
  } else {
    expanded.add(eduId);
  }
  expandedDescriptions.value = new Set(expanded);
}

function isDescriptionExpanded(eduId: string): boolean {
  return expandedDescriptions.value.has(eduId);
}

function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

function needsTruncation(text: string, maxLength: number = 200): boolean {
  return text.length > maxLength;
}

// Function to get institution initials for avatar
const getInstitutionInitials = (institution?: string): string => {
  if (!institution) return "ED";
  return institution
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Function to format degree type
const formatDegree = (degree?: string): string => {
  if (!degree) return "";
  const degreeTypes = {
    Bachelor: "🎓",
    Master: "📚",
    PhD: "🔬",
    Diploma: "📜",
    Certificate: "🏆",
  };

  for (const [type, icon] of Object.entries(degreeTypes)) {
    if (degree.toLowerCase().includes(type.toLowerCase())) {
      return `${icon} ${degree}`;
    }
  }
  return `🎓 ${degree}`;
};
</script>

<template>
  <section class="flex flex-col gap-8">
    <!-- Modern Section Header -->
    <div class="relative">
      <a href="#education">
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
              {{ $t("education") }}
            </h2>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ $t("academicBackground", "Academic Background") }}
            </p>
          </div>
        </div>
      </a>
    </div>

    <!-- Modern Education Timeline -->
    <div class="relative">
      <!-- Timeline Line -->
      <div
        class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-transparent hidden sm:block"
      ></div>

      <div class="space-y-6">
        <div
          v-for="(edu, index) in education"
          :key="edu._id || index"
          class="education-card group relative"
          :style="{ '--index': index }"
        >
          <!-- Timeline Dot -->
          <div
            class="absolute left-4 w-4 h-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full border-4 border-white dark:border-neutral-900 shadow-lg group-hover:scale-125 transition-transform duration-300 z-10 hidden sm:block"
          ></div>

          <!-- Modern Education Card -->
          <div
            class="sm:ml-12 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-primary-200 dark:group-hover:border-primary-800 overflow-hidden"
          >
            <!-- Card Header with Gradient -->
            <div
              class="bg-gradient-to-r from-primary-50 to-primary-50 dark:from-primary-900/20 dark:to-primary-900/20 p-4 sm:p-6 border-b border-neutral-100 dark:border-neutral-800"
            >
              <div class="flex flex-col gap-3 sm:gap-4">
                <!-- Institution Row -->
                <div class="flex items-start gap-3 sm:gap-4">
                  <!-- Institution Avatar -->
                  <div
                    class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                  >
                    <span class="text-white font-bold text-base sm:text-lg">
                      {{ getInstitutionInitials(edu.institution) }}
                    </span>
                  </div>

                  <!-- Institution Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col gap-1 sm:gap-2">
                      <!-- Institution Name -->
                      <div class="flex items-center gap-2">
                        <a
                          v-if="edu.website"
                          class="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 group flex items-center gap-2"
                          :href="edu.website"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span class="truncate">{{ edu.institution }}</span>
                          <IconExternalLink
                            class="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                          />
                        </a>
                        <h3
                          v-else
                          class="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate"
                        >
                          {{ edu.institution }}
                        </h3>
                      </div>

                      <!-- Degree -->
                      <div class="flex items-center gap-2">
                        <IconSchool
                          class="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 flex-shrink-0"
                        />
                        <p
                          class="text-sm sm:text-base text-primary-600 dark:text-primary-400 font-medium"
                          v-html="formatDegree(edu.degree)"
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Period & Location Row -->
                <div
                  class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <!-- Period -->
                  <div
                    v-if="edu.period?.start && edu.period?.end"
                    class="flex items-center gap-2"
                  >
                    <div
                      class="bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm w-full sm:w-auto"
                    >
                      <div
                        class="flex items-center gap-1.5 justify-center sm:justify-start"
                      >
                        <IconCalendar
                          class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400"
                        />
                        <span
                          class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium"
                        >
                          {{ edu.period.start }} - {{ edu.period.end }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Location -->
                  <div v-if="edu.location" class="flex items-center gap-2">
                    <div
                      class="bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm w-full sm:w-auto"
                    >
                      <div
                        class="flex items-center gap-1.5 justify-center sm:justify-start"
                      >
                        <IconMapPin
                          class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400"
                        />
                        <span
                          class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium"
                        >
                          {{ edu.location }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Content -->
            <div v-if="getLocalizedContent(edu)" class="p-4 sm:p-6">
              <div class="prose dark:prose-invert max-w-none">
                <div class="relative">
                  <div
                    class="text-neutral-700 dark:text-neutral-300 leading-relaxed text-pretty text-sm sm:text-base"
                  >
                    <span
                      v-html="
                        isDescriptionExpanded(edu._id || String(index))
                          ? getLocalizedContent(edu)
                          : truncateText(
                              getLocalizedContent(edu).replace(/<[^>]*>/g, ''),
                              200
                            )
                      "
                    ></span>
                  </div>
                  <div
                    v-if="
                      needsTruncation(
                        getLocalizedContent(edu).replace(/<[^>]*>/g, ''),
                        200
                      )
                    "
                    class="mt-3"
                  >
                    <button
                      @click="toggleDescription(edu._id || String(index))"
                      class="inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 group"
                    >
                      <span>{{
                        isDescriptionExpanded(edu._id || String(index))
                          ? $t("readLess", "Read Less")
                          : $t("readMore", "Read More")
                      }}</span>
                      <svg
                        class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        :class="{
                          'rotate-180': isDescriptionExpanded(
                            edu._id || String(index)
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
            </div>

            <!-- Card Footer -->
            <div class="px-4 pb-4 sm:px-6 sm:pb-6 flex justify-end">
              <div
                class="text-3xl sm:text-5xl font-bold text-neutral-100 dark:text-neutral-800 select-none"
              >
                {{ String(index + 1).padStart(2, "0") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Education Card Animations */
.education-card {
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

/* Card Hover Effects */
.education-card:hover .bg-white {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Timeline Dot Animation */
.education-card:hover .absolute.left-4 {
  box-shadow: 0 0 20px rgba(var(--color-primary-500), 0.5);
}

/* Institution Avatar Hover */
.education-card:hover .w-14.h-14.bg-gradient-to-br {
  transform: scale(1.05) rotate(-5deg);
  box-shadow: 0 10px 25px rgba(var(--color-primary-500), 0.3);
}

/* Education Number Hover */
.education-card:hover .text-5xl {
  transform: scale(1.05);
  background: linear-gradient(
    45deg,
    var(--color-primary-500),
    var(--color-primary-400)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Gradient Text Animation */
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

/* Stats Cards Hover */
.grid .bg-gradient-to-br:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Responsive Animations */
@media (max-width: 640px) {
  .education-card {
    animation-delay: calc(var(--index, 0) * 0.05s);
  }
}

/* Dark mode specific enhancements */
@media (prefers-color-scheme: dark) {
  .education-card:hover .bg-white {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4),
      0 10px 10px -5px rgba(0, 0, 0, 0.2);
  }
}

/* Focus states for accessibility */
.education-card:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 16px;
}

/* Read More Button Styles */
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

/* Mobile Responsive Styles */
@media (max-width: 640px) {
  .education-card {
    animation-delay: calc(var(--index, 0) * 0.05s);
  }

  /* Mobile Header Adjustments */
  .w-10.h-10.bg-gradient-to-br {
    width: 2.5rem;
    height: 2.5rem;
  }

  .w-10.h-10.bg-gradient-to-br .w-5.h-5 {
    width: 1.25rem;
    height: 1.25rem;
  }

  .text-2xl.sm\\:text-3xl {
    font-size: 1.5rem;
  }

  /* Mobile Institution Avatar */
  .w-14.h-14.bg-gradient-to-br {
    width: 3rem;
    height: 3rem;
  }

  .w-14.h-14.bg-gradient-to-br span {
    font-size: 1rem;
  }

  /* Mobile Institution Info */
  .text-xl.font-bold {
    font-size: 1.125rem;
    line-height: 1.5;
  }

  /* Mobile Period and Location Badges */
  .bg-white.dark\\:bg-neutral-800 {
    width: 100%;
    text-align: center;
    padding: 0.5rem 0.75rem;
  }

  .flex.items-center.gap-2:has(.bg-white) {
    width: 100%;
  }

  /* Mobile Card Content */
  .p-6 {
    padding: 1rem;
  }

  /* Mobile Education Number */
  .text-5xl {
    font-size: 2.5rem;
  }

  /* Mobile Stats Grid */
  .grid.grid-cols-1.sm\\:grid-cols-3 {
    gap: 1rem;
  }

  /* Mobile Institution Name Truncation */
  .text-xl.font-bold .truncate {
    max-width: 200px;
  }

  /* Mobile Degree Text */
  .text-primary-600.dark\\:text-primary-400 {
    font-size: 0.875rem;
  }

  /* Mobile Timeline Adjustments */
  .absolute.left-6.top-0.bottom-0 {
    display: none;
  }

  .absolute.left-4.w-4.h-4 {
    display: none;
  }

  .sm\\:ml-12 {
    margin-left: 0;
  }

  /* Mobile Read More Button */
  .inline-flex.items-center.gap-1 {
    font-size: 0.875rem;
    padding: 0.25rem 0;
  }

  /* Mobile Prose Content */
  .prose {
    font-size: 0.875rem;
  }

  /* Mobile Icon Sizes */
  .w-4.h-4 {
    width: 0.875rem;
    height: 0.875rem;
  }

  .icon-small {
    width: 0.75rem;
    height: 0.75rem;
  }

  /* Mobile Spacing Adjustments */
  .flex.flex-col.gap-4 {
    gap: 1rem;
  }

  .flex.flex-col.gap-2 {
    gap: 0.5rem;
  }

  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }

  /* Mobile Education Header */
  .flex.flex-row.gap-3 {
    gap: 0.75rem;
  }

  /* Mobile Institution Row */
  .flex.items-start.gap-4 {
    gap: 1rem;
  }

  /* Mobile Period & Location Row */
  .flex.flex-col.sm\\:flex-row.sm\\:items-center.sm\\:justify-between {
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Mobile Card Footer */
  .px-6.pb-6 {
    padding: 1rem;
  }

  /* Mobile Stats Cards */
  .bg-gradient-to-br.from-primary-50 {
    padding: 1rem;
  }

  /* Mobile Stats Icons */
  .w-10.h-10.bg-primary-500 {
    width: 2.5rem;
    height: 2.5rem;
  }

  .w-10.h-10.bg-primary-500 .w-5.h-5 {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Mobile Stats Text */
  .text-2xl.font-bold {
    font-size: 1.5rem;
  }

  .text-sm.text-neutral-600 {
    font-size: 0.75rem;
  }
}

/* Tablet Responsive Styles */
@media (min-width: 640px) and (max-width: 1024px) {
  .w-14.h-14.bg-gradient-to-br {
    width: 3.5rem;
    height: 3.5rem;
  }

  .text-xl.font-bold {
    font-size: 1.25rem;
  }

  .text-5xl {
    font-size: 3rem;
  }

  .p-6 {
    padding: 1.5rem;
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
