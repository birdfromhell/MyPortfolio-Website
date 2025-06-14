<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

import useAuth from "~/composables/auth/useAuth";
import type { Category } from "~/types/learning";

const auth = useAuth();
const router = useRouter();

// Initialize auth
onMounted(() => {
  auth.initAuth();
  fetchCategories();
});

// Form state
const course = ref({
  title: "",
  description: "",
  platform: "",
  author: "",
  url: "",
  category_id: undefined as number | undefined,
  status: "not_started",
  progress: 0,
  start_date: "",
  end_date: "",
});

const categories = ref<Category[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isSubmitting = ref(false);

// Validation rules
const rules = {
  title: (v: string) => !!v || "Title is required",
  category: (v: number | undefined) =>
    v !== undefined || "Category is required",
  status: (v: string) => !!v || "Status is required",
  progress: (v: number) =>
    (v >= 0 && v <= 100) || "Progress must be between 0 and 100",
  url: (v: string) => !v || /^https?:\/\/.+/.test(v) || "URL must be valid",
  start_date: (v: string) =>
    !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || "Use YYYY-MM-DD format",
  end_date: (v: string, start: string) =>
    !v ||
    (/^\d{4}-\d{2}-\d{2}$/.test(v) && (!start || v >= start)) ||
    "End date must be after start date",
};

// Computed properties for validation
const isTitleValid = computed(() => rules.title(course.value.title) === true);
const isCategoryValid = computed(
  () => rules.category(course.value.category_id) === true
);
const isUrlValid = computed(() => rules.url(course.value.url) === true);
const isStartDateValid = computed(
  () => rules.start_date(course.value.start_date) === true
);
const isEndDateValid = computed(
  () => rules.end_date(course.value.end_date, course.value.start_date) === true
);

// Fetch categories from API
const fetchCategories = async () => {
  try {
    categories.value = await $fetch<Category[]>("/api/learning/categories/all");
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Failed to load categories";
  }
};

// Submit form
const submitForm = async () => {
  error.value = null;

  // Validate form
  if (
    !isTitleValid.value ||
    !isCategoryValid.value ||
    !isUrlValid.value ||
    !isStartDateValid.value ||
    !isEndDateValid.value
  ) {
    error.value = "Please correct the errors in the form";
    return;
  }

  isSubmitting.value = true;

  try {
    // If status is completed, set progress to 100
    if (course.value.status === "completed") {
      course.value.progress = 100;
    }

    await $fetch("/api/learning/courses/all", {
      method: "POST",
      body: course.value,
    });

    // Redirect to courses page
    router.push("/dashboard/courses");
  } catch (err) {
    console.error("Error creating course:", err);
    error.value = "Failed to create course";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <UContainer>
      <!-- Page header -->
      <div class="flex items-center justify-between pb-6">
        <div>
          <h1 class="text-2xl font-bold">Add New Course</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Create a new course to track your learning progress
          </p>
        </div>
        <UButton
          color="gray"
          variant="soft"
          icon="i-tabler-arrow-left"
          to="/dashboard/courses"
        >
          Back to Courses
        </UButton>
      </div>

      <!-- Error alert -->
      <UAlert
        v-if="error"
        icon="i-tabler-alert-triangle"
        color="red"
        variant="soft"
        :title="error"
        class="mb-6"
      />

      <!-- Course form -->
      <UCard class="max-w-3xl mx-auto">
        <form @submit.prevent="submitForm">
          <!-- Basic info section -->
          <div class="space-y-4 mb-6">
            <h2 class="text-lg font-medium">Basic Information</h2>

            <!-- Title field -->
            <UFormGroup label="Course Title" required>
              <UInput
                v-model="course.title"
                placeholder="Enter course title"
                :state="
                  course.title
                    ? isTitleValid
                      ? 'success'
                      : 'error'
                    : undefined
                "
              />
              <template #hint v-if="course.title && !isTitleValid">
                <span class="text-red-500">Title is required</span>
              </template>
            </UFormGroup>

            <!-- Description field -->
            <UFormGroup label="Description">
              <UTextarea
                v-model="course.description"
                placeholder="Enter course description"
              />
            </UFormGroup>

            <!-- Category field -->
            <UFormGroup label="Category" required>
              <USelectMenu
                v-model="course.category_id"
                :options="
                  categories.map((cat) => ({ label: cat.name, value: cat.id }))
                "
                placeholder="Select a category"
                :state="
                  course.category_id !== null
                    ? isCategoryValid
                      ? 'success'
                      : 'error'
                    : undefined
                "
              />
              <template
                #hint
                v-if="course.category_id === undefined && !isCategoryValid"
              >
                <span class="text-red-500">Category is required</span>
              </template>
            </UFormGroup>
          </div>

          <!-- Course details section -->
          <div class="space-y-4 mb-6">
            <h2 class="text-lg font-medium">Course Details</h2>

            <!-- Platform field -->
            <UFormGroup label="Platform">
              <UInput
                v-model="course.platform"
                placeholder="e.g. Udemy, Coursera, YouTube"
              />
            </UFormGroup>

            <!-- Author field -->
            <UFormGroup label="Author/Instructor">
              <UInput
                v-model="course.author"
                placeholder="Course instructor or author"
              />
            </UFormGroup>

            <!-- URL field -->
            <UFormGroup label="Course URL">
              <UInput
                v-model="course.url"
                placeholder="https://example.com/course"
                :state="
                  course.url ? (isUrlValid ? 'success' : 'error') : undefined
                "
              />
              <template #hint v-if="course.url && !isUrlValid">
                <span class="text-red-500">Please enter a valid URL</span>
              </template>
            </UFormGroup>
          </div>

          <!-- Progress section -->
          <div class="space-y-4 mb-6">
            <h2 class="text-lg font-medium">Progress</h2>

            <!-- Status field -->
            <UFormGroup label="Status" required>
              <URadioGroup
                v-model="course.status"
                :options="[
                  { label: 'Not Started', value: 'not_started' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                ]"
              />
            </UFormGroup>

            <!-- Progress slider -->
            <UFormGroup v-if="course.status !== 'not_started'" label="Progress">
              <div class="flex items-center gap-4">
                <URange
                  v-model="course.progress"
                  :min="0"
                  :max="100"
                  :step="5"
                  class="flex-1"
                />
                <span class="text-sm font-medium w-12 text-center">
                  {{ course.progress }}%
                </span>
              </div>
            </UFormGroup>

            <!-- Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Start date -->
              <UFormGroup label="Start Date">
                <UInput
                  v-model="course.start_date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  :state="
                    course.start_date
                      ? isStartDateValid
                        ? 'success'
                        : 'error'
                      : undefined
                  "
                />
                <template #hint v-if="course.start_date && !isStartDateValid">
                  <span class="text-red-500">Use YYYY-MM-DD format</span>
                </template>
              </UFormGroup>

              <!-- End date -->
              <UFormGroup label="Expected Completion Date">
                <UInput
                  v-model="course.end_date"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  :state="
                    course.end_date
                      ? isEndDateValid
                        ? 'success'
                        : 'error'
                      : undefined
                  "
                />
                <template #hint v-if="course.end_date && !isEndDateValid">
                  <span class="text-red-500"
                    >End date must be after start date</span
                  >
                </template>
              </UFormGroup>
            </div>
          </div>

          <!-- Form actions -->
          <div
            class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800"
          >
            <UButton color="gray" variant="soft" to="/dashboard/courses">
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              Create Course
            </UButton>
          </div>
        </form>
      </UCard>
    </UContainer>
  </div>
</template>
