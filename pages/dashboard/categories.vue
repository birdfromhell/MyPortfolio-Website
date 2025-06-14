<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

import useAuth from "~/composables/auth/useAuth";
import type { Category } from "~/types/learning";

const auth = useAuth();

// Initialize auth
onMounted(() => {
  auth.initAuth();
  fetchCategories();
});

// State
const categories = ref<Category[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Category form
const isAddingCategory = ref(false);
const newCategory = ref({
  name: "",
  description: "",
  color: "blue",
});

// Fetch categories
const fetchCategories = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const result = await $fetch<Category[]>("/api/learning/categories/all");
    categories.value = result;
  } catch (err) {
    console.error("Error fetching categories:", err);
    error.value = "Failed to load categories";
  } finally {
    isLoading.value = false;
  }
};

// Available colors for categories
const colors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "pink",
  "orange",
  "teal",
  "cyan",
  "amber",
];

// Create new category
const createCategory = async () => {
  if (!newCategory.value.name) {
    error.value = "Category name is required";
    return;
  }

  try {
    await $fetch("/api/learning/categories/all", {
      method: "POST",
      body: newCategory.value,
    });

    // Reset form and refresh categories
    newCategory.value = { name: "", description: "", color: "blue" };
    isAddingCategory.value = false;
    fetchCategories();
  } catch (err) {
    console.error("Error creating category:", err);
    error.value = "Failed to create category";
  }
};

// Delete category
const deleteCategory = async (id: number) => {
  if (
    !confirm(
      "Are you sure you want to delete this category? This will remove all associated topics."
    )
  ) {
    return;
  }

  try {
    await $fetch(`/api/learning/categories/${id}`, {
      method: "DELETE",
    });

    // Refresh categories
    fetchCategories();
  } catch (err) {
    console.error("Error deleting category:", err);
    error.value = "Failed to delete category";
  }
};

// Computed for sorting categories by name
const sortedCategories = computed(() => {
  return [...categories.value].sort((a, b) => a.name.localeCompare(b.name));
});
</script>

<template>
  <div>
    <UContainer>
      <!-- Page header -->
      <div class="flex items-center justify-between pb-6">
        <div>
          <h1 class="text-2xl font-bold">Categories</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Organize your learning topics by categories
          </p>
        </div>

        <UButton
          v-if="!isAddingCategory"
          color="primary"
          icon="i-tabler-plus"
          @click="isAddingCategory = true"
        >
          Add Category
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

      <!-- Add category form -->
      <UCard v-if="isAddingCategory" class="mb-6">
        <form @submit.prevent="createCategory">
          <div class="space-y-4">
            <h2 class="text-lg font-medium">Add New Category</h2>

            <UFormGroup label="Category Name" required>
              <UInput
                v-model="newCategory.name"
                placeholder="Enter category name"
                autocomplete="off"
              />
            </UFormGroup>

            <UFormGroup label="Description">
              <UTextarea
                v-model="newCategory.description"
                placeholder="Enter category description"
              />
            </UFormGroup>

            <UFormGroup label="Color">
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="color in colors"
                  :key="color"
                  size="xs"
                  :color="color as any"
                  :variant="newCategory.color === color ? 'solid' : 'soft'"
                  @click="newCategory.color = color"
                />
              </div>
            </UFormGroup>

            <div class="flex justify-end space-x-2 pt-4">
              <UButton
                type="button"
                color="gray"
                variant="soft"
                @click="isAddingCategory = false"
              >
                Cancel
              </UButton>
              <UButton type="submit" color="primary"> Create Category </UButton>
            </div>
          </div>
        </form>
      </UCard>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <UButton loading variant="ghost">Loading categories</UButton>
      </div>

      <!-- Categories list -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Empty state -->
        <div
          v-if="categories.length === 0"
          class="col-span-full py-12 flex flex-col items-center justify-center text-center"
        >
          <div class="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
            <i
              class="i-tabler-category text-5xl text-gray-500 dark:text-gray-400"
            ></i>
          </div>
          <h3 class="text-lg font-medium mb-2">No categories yet</h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mb-4">
            Add your first category to start organizing your learning journey
          </p>
          <UButton
            color="primary"
            icon="i-tabler-plus"
            @click="isAddingCategory = true"
          >
            Add Category
          </UButton>
        </div>

        <!-- Category cards -->
        <UCard
          v-for="category in sortedCategories"
          :key="category.id"
          class="border-0 shadow-sm"
        >
          <div class="flex items-center">
            <div
              class="p-3 rounded-lg mr-4"
              :class="`bg-${category.color || 'blue'}-100 dark:bg-${
                category.color || 'blue'
              }-900/20`"
            >
              <i
                class="i-tabler-category w-6 h-6"
                :class="`text-${category.color || 'blue'}-500`"
              ></i>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium">{{ category.name }}</h3>
              <p
                v-if="category.description"
                class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
              >
                {{ category.description }}
              </p>

              <!-- Progress indicators -->
              <div v-if="category.total_topics" class="mt-2">
                <div class="flex justify-between text-xs mb-1">
                  <span
                    >{{ category.completed_topics || 0 }}/{{
                      category.total_topics
                    }}
                    completed</span
                  >
                  <span>{{ category.progress || 0 }}%</span>
                </div>
                <UProgress
                  :value="category.progress || 0"
                  :color="(category.color as 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'orange' | 'teal' | 'cyan' | 'amber') || 'blue'"
                  size="sm"
                />
              </div>
            </div>

            <!-- Actions dropdown -->
            <UDropdown>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-tabler-dots"
                size="sm"
              />
              <template #items>
                <UDropdownItem to="/dashboard/courses" icon="i-tabler-book">
                  View Courses
                </UDropdownItem>
                <UDropdownItem icon="i-tabler-edit">
                  Edit Category
                </UDropdownItem>
                <UDropdownItem
                  icon="i-tabler-trash"
                  @click="deleteCategory(category.id)"
                  color="red"
                >
                  Delete Category
                </UDropdownItem>
              </template>
            </UDropdown>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
