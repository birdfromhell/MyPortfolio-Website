<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

import useAuth from "~/composables/auth/useAuth";
import type { Topic, Category, Course } from "~/types/learning";

const auth = useAuth();

// Initialize auth
onMounted(() => {
  auth.initAuth();
  fetchTopics();
  fetchCategories();
  fetchCourses();
});

// State
const topics = ref<Topic[]>([]);
const categories = ref<Category[]>([]);
const courses = ref<Course[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Filter state
const activeStatus = ref("all");
const activeCategory = ref("all");
const searchQuery = ref("");

// Modals
const isAddingTopic = ref(false);

// New topic form
const newTopic = ref({
  title: "",
  description: "",
  course_id: undefined as number | undefined,
  category_id: undefined as number | undefined,
  status: "not_done" as "not_done" | "in_progress" | "done",
  priority: 0,
});

// Fetch topics
const fetchTopics = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const result = await $fetch<Topic[]>("/api/learning/topics/all");
    topics.value = result;
  } catch (err) {
    console.error("Error fetching topics:", err);
    error.value = "Failed to load topics";
  } finally {
    isLoading.value = false;
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    categories.value = await $fetch<Category[]>("/api/learning/categories/all");
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

// Fetch courses
const fetchCourses = async () => {
  try {
    courses.value = await $fetch<Course[]>("/api/learning/courses/all");
  } catch (err) {
    console.error("Error fetching courses:", err);
  }
};

// Filter topics
const filteredTopics = computed(() => {
  let filtered = [...topics.value];

  // Filter by status
  if (activeStatus.value !== "all") {
    filtered = filtered.filter((topic) => topic.status === activeStatus.value);
  }

  // Filter by category
  if (activeCategory.value !== "all") {
    const categoryId = parseInt(activeCategory.value);
    filtered = filtered.filter((topic) => topic.category_id === categoryId);
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        (topic.description && topic.description.toLowerCase().includes(query))
    );
  }

  return filtered;
});

// Create topic
const createTopic = async () => {
  if (!newTopic.value.title) {
    error.value = "Topic title is required";
    return;
  }

  if (!newTopic.value.category_id) {
    error.value = "Category is required";
    return;
  }

  try {
    await $fetch("/api/learning/topics/all", {
      method: "POST",
      body: newTopic.value,
    });

    // Reset form and refresh topics
    newTopic.value = {
      title: "",
      description: "",
      course_id: undefined,
      category_id: undefined,
      status: "not_done",
      priority: 0,
    };
    isAddingTopic.value = false;
    fetchTopics();
  } catch (err) {
    console.error("Error creating topic:", err);
    error.value = "Failed to create topic";
  }
};

// Update topic status
const updateTopicStatus = async (
  topic: Topic,
  newStatus: "not_done" | "in_progress" | "done"
) => {
  try {
    await $fetch(`/api/learning/topics/${topic.id}`, {
      method: "PUT",
      body: {
        status: newStatus,
      },
    });

    // Refresh topics
    fetchTopics();
  } catch (err) {
    console.error("Error updating topic status:", err);
    error.value = "Failed to update topic status";
  }
};

// Delete topic
const deleteTopic = async (id: number) => {
  if (!confirm("Are you sure you want to delete this topic?")) {
    return;
  }

  try {
    await $fetch(`/api/learning/topics/${id}`, {
      method: "DELETE",
    });

    // Refresh topics
    fetchTopics();
  } catch (err) {
    console.error("Error deleting topic:", err);
    error.value = "Failed to delete topic";
  }
};

// Status display
const statusLabels = {
  not_done: "Not Done",
  in_progress: "In Progress",
  done: "Completed",
};

// Priority options
const priorityOptions = [
  { value: 0, label: "Low" },
  { value: 1, label: "Medium" },
  { value: 2, label: "High" },
];

// Get category name
const getCategoryName = (categoryId: number | undefined | null) => {
  if (!categoryId) return "";
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "";
};

// Get course title
const getCourseTitle = (courseId: number | undefined | null) => {
  if (!courseId) return "";
  const course = courses.value.find((c) => c.id === courseId);
  return course ? course.title : "";
};
</script>

<template>
  <div>
    <UContainer>
      <!-- Page header -->
      <div class="flex items-center justify-between pb-6">
        <div>
          <h1 class="text-2xl font-bold">Learning Topics</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your learning topics
          </p>
        </div>

        <UButton
          v-if="!isAddingTopic"
          color="primary"
          icon="i-tabler-plus"
          @click="isAddingTopic = true"
        >
          Add Topic
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

      <!-- Add topic form -->
      <UCard v-if="isAddingTopic" class="mb-6">
        <form @submit.prevent="createTopic">
          <div class="space-y-4">
            <h2 class="text-lg font-medium">Add New Topic</h2>

            <UFormGroup label="Topic Title" required>
              <UInput
                v-model="newTopic.title"
                placeholder="Enter topic title"
                autocomplete="off"
              />
            </UFormGroup>

            <UFormGroup label="Description">
              <UTextarea
                v-model="newTopic.description"
                placeholder="Enter topic description"
              />
            </UFormGroup>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Category" required>
                <USelectMenu
                  v-model="newTopic.category_id"
                  :options="
                    categories.map((cat) => ({
                      label: cat.name,
                      value: cat.id,
                    }))
                  "
                  placeholder="Select a category"
                />
              </UFormGroup>

              <UFormGroup label="Course (Optional)">
                <USelectMenu
                  v-model="newTopic.course_id"
                  :options="
                    courses.map((course) => ({
                      label: course.title,
                      value: course.id,
                    }))
                  "
                  placeholder="Select a course"
                  clearable
                />
              </UFormGroup>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormGroup label="Status">
                <URadioGroup
                  v-model="newTopic.status"
                  :options="[
                    { label: 'Not Done', value: 'not_done' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Completed', value: 'done' },
                  ]"
                  class="flex gap-4"
                />
              </UFormGroup>

              <UFormGroup label="Priority">
                <URadioGroup
                  v-model="newTopic.priority"
                  :options="priorityOptions"
                  class="flex gap-4"
                />
              </UFormGroup>
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <UButton
                type="button"
                color="gray"
                variant="soft"
                @click="isAddingTopic = false"
              >
                Cancel
              </UButton>
              <UButton type="submit" color="primary"> Create Topic </UButton>
            </div>
          </div>
        </form>
      </UCard>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Search input -->
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            placeholder="Search topics..."
            icon="i-tabler-search"
            size="md"
            class="w-full"
          />
        </div>

        <div class="flex gap-2 overflow-x-auto pb-2">
          <!-- Status filter -->
          <USelectMenu
            v-model="activeStatus"
            :options="[
              { label: 'All Statuses', value: 'all' },
              { label: 'Not Done', value: 'not_done' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Completed', value: 'done' },
            ]"
            size="sm"
            class="w-40"
          />

          <!-- Category filter -->
          <USelectMenu
            v-model="activeCategory"
            :options="[
              { label: 'All Categories', value: 'all' },
              ...categories.map((cat) => ({
                label: cat.name,
                value: cat.id.toString(),
              })),
            ]"
            size="sm"
            class="w-40"
          />
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <UButton loading variant="ghost">Loading topics</UButton>
      </div>

      <!-- Topics list -->
      <UCard v-else-if="filteredTopics.length > 0" class="border-0">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                Course
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
              >
                Priority
              </th>
              <th
                scope="col"
                class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="topic in filteredTopics" :key="topic.id">
              <!-- Status -->
              <td class="px-4 py-4 whitespace-nowrap">
                <UBadge
                  :color="
                    topic.status === 'done'
                      ? 'green'
                      : topic.status === 'in_progress'
                      ? 'blue'
                      : 'gray'
                  "
                  :variant="topic.status === 'done' ? 'solid' : 'soft'"
                >
                  {{ statusLabels[topic.status] }}
                </UBadge>
              </td>

              <!-- Title -->
              <td class="px-4 py-4">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium">
                      {{ topic.title }}
                    </div>
                    <div
                      v-if="topic.description"
                      class="text-sm text-gray-500 line-clamp-1"
                    >
                      {{ topic.description }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                <UBadge
                  v-if="topic.category_id"
                  :color="(topic.category_color as any) || 'blue'"
                  variant="soft"
                >
                  {{
                    topic.category_name || getCategoryName(topic.category_id)
                  }}
                </UBadge>
                <span v-else class="text-sm text-gray-500">None</span>
              </td>

              <!-- Course -->
              <td class="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                <span v-if="topic.course_id" class="text-sm">
                  {{ topic.course_title || getCourseTitle(topic.course_id) }}
                </span>
                <span v-else class="text-sm text-gray-500">None</span>
              </td>

              <!-- Priority -->
              <td class="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                <UBadge
                  :color="
                    topic.priority === 2
                      ? 'red'
                      : topic.priority === 1
                      ? 'yellow'
                      : 'gray'
                  "
                  variant="soft"
                >
                  {{
                    priorityOptions.find((p) => p.value === topic.priority)
                      ?.label || "Low"
                  }}
                </UBadge>
              </td>

              <!-- Actions -->
              <td class="px-4 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end space-x-1">
                  <!-- Status actions -->
                  <UButton
                    v-if="topic.status !== 'done'"
                    icon="i-tabler-check"
                    color="green"
                    variant="ghost"
                    size="xs"
                    @click="updateTopicStatus(topic, 'done')"
                    square
                    title="Mark as Done"
                  />
                  <UButton
                    v-if="topic.status !== 'in_progress'"
                    icon="i-tabler-progress"
                    color="blue"
                    variant="ghost"
                    size="xs"
                    @click="updateTopicStatus(topic, 'in_progress')"
                    square
                    title="Mark as In Progress"
                  />
                  <UButton
                    v-if="topic.status !== 'not_done'"
                    icon="i-tabler-x"
                    color="gray"
                    variant="ghost"
                    size="xs"
                    @click="updateTopicStatus(topic, 'not_done')"
                    square
                    title="Mark as Not Done"
                  />

                  <!-- Delete -->
                  <UButton
                    icon="i-tabler-trash"
                    color="red"
                    variant="ghost"
                    size="xs"
                    @click="deleteTopic(topic.id)"
                    square
                    title="Delete Topic"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </UCard>

      <!-- Empty state -->
      <div
        v-else-if="!isLoading"
        class="py-12 flex flex-col items-center justify-center text-center"
      >
        <div class="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
          <i
            class="i-tabler-notes text-5xl text-gray-500 dark:text-gray-400"
          ></i>
        </div>
        <h3 class="text-lg font-medium mb-2">No topics found</h3>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mb-4">
          {{
            topics.length === 0
              ? "No topics have been added yet. Add your first topic to start tracking your learning progress."
              : "No topics match your current filters. Try adjusting your search or filters."
          }}
        </p>
        <div class="flex gap-2">
          <UButton
            v-if="
              activeStatus !== 'all' || activeCategory !== 'all' || searchQuery
            "
            @click="
              searchQuery = '';
              activeStatus = 'all';
              activeCategory = 'all';
            "
            variant="soft"
            color="primary"
          >
            Clear Filters
          </UButton>

          <UButton
            color="primary"
            icon="i-tabler-plus"
            @click="isAddingTopic = true"
          >
            Add Topic
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
