<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

// Explicitly import useAuth
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
// Initialize auth
onMounted(() => {
  auth.initAuth();
});

// Notes data
interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  course?: string;
  isPinned: boolean;
}

const notes = ref<Note[]>([
  {
    id: 1,
    title: "JavaScript Promises",
    content:
      "Promises are objects that represent the eventual completion or failure of an asynchronous operation. They can be in one of three states: pending, fulfilled, or rejected...",
    createdAt: "2025-06-10T14:30:00Z",
    tags: ["javascript", "async"],
    course: "Advanced JavaScript",
    isPinned: true,
  },
  {
    id: 2,
    title: "React Hooks Rules",
    content:
      "1. Only call hooks at the top level\n2. Don't call hooks inside loops, conditions, or nested functions\n3. Only call hooks from React function components or custom hooks...",
    createdAt: "2025-06-08T10:15:00Z",
    tags: ["react", "hooks"],
    course: "React & Redux",
    isPinned: true,
  },
  {
    id: 3,
    title: "TypeScript Interfaces vs Types",
    content:
      "Interfaces are primarily used to describe the shape of objects, while types are more flexible and can represent primitives, unions, tuples...",
    createdAt: "2025-06-05T09:45:00Z",
    tags: ["typescript", "types"],
    course: "TypeScript Fundamentals",
    isPinned: false,
  },
  {
    id: 4,
    title: "CSS Grid Layout",
    content:
      "Grid layout allows for a two-dimensional grid system with rows and columns. Key properties include grid-template-columns, grid-template-rows, and grid-gap...",
    createdAt: "2025-05-28T16:20:00Z",
    tags: ["css", "layout"],
    course: "HTML & CSS Mastery",
    isPinned: false,
  },
  {
    id: 5,
    title: "JavaScript Array Methods",
    content:
      "Important array methods: map(), filter(), reduce(), find(), some(), every(), and forEach(). Examples of each with their use cases...",
    createdAt: "2025-05-25T11:10:00Z",
    tags: ["javascript", "arrays"],
    course: "Advanced JavaScript",
    isPinned: false,
  },
]);

// For the new note form
const isCreatingNote = ref(false);
const newNote = ref({
  title: "",
  content: "",
  tags: [] as string[],
  course: "",
});

// For the note editor
const isEditingNote = ref(false);
const editingNoteId = ref<number | null>(null);

// Form validation
const errors = ref({
  title: "",
  content: "",
});

// Filter and search
const searchQuery = ref("");
const activeTag = ref<string | null>(null);
const showPinnedOnly = ref(false);

// Get all unique tags
const allTags = computed(() => {
  const tagSet = new Set<string>();
  notes.value.forEach((note) => {
    note.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet);
});

// Get all unique courses
const allCourses = computed(() => {
  const courseSet = new Set<string>();
  notes.value.forEach((note) => {
    if (note.course) courseSet.add(note.course);
  });
  return Array.from(courseSet);
});

// Filter notes based on search, tags, and pin status
const filteredNotes = computed(() => {
  return notes.value.filter((note) => {
    // Filter by search query
    const matchesSearch =
      !searchQuery.value ||
      note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.value.toLowerCase());

    // Filter by tag
    const matchesTag = !activeTag.value || note.tags.includes(activeTag.value);

    // Filter by pin status
    const matchesPinStatus = !showPinnedOnly.value || note.isPinned;

    return matchesSearch && matchesTag && matchesPinStatus;
  });
});

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

// Create a new note
const createNote = () => {
  // Reset errors
  errors.value = { title: "", content: "" };

  // Validate
  if (!newNote.value.title.trim()) {
    errors.value.title = "Title is required";
    return;
  }

  if (!newNote.value.content.trim()) {
    errors.value.content = "Content is required";
    return;
  }

  // Create the note
  const id =
    notes.value.length > 0 ? Math.max(...notes.value.map((n) => n.id)) + 1 : 1;

  notes.value.unshift({
    id,
    title: newNote.value.title,
    content: newNote.value.content,
    tags: newNote.value.tags,
    course: newNote.value.course || undefined,
    createdAt: new Date().toISOString(),
    isPinned: false,
  });

  // Reset the form
  newNote.value = { title: "", content: "", tags: [], course: "" };
  isCreatingNote.value = false;
};

// Toggle pin status
const togglePin = (id: number) => {
  const note = notes.value.find((n) => n.id === id);
  if (note) {
    note.isPinned = !note.isPinned;
  }
};

// Delete a note
const deleteNote = (id: number) => {
  const index = notes.value.findIndex((n) => n.id === id);
  if (index !== -1) {
    notes.value.splice(index, 1);
  }
};
</script>

<template>
  <div>
    <UContainer>
      <!-- Page header -->
      <div class="pb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">Study Notes</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Organize your learning notes in one place
          </p>
        </div>

        <UButton
          color="primary"
          @click="isCreatingNote = true"
          icon="i-tabler-plus"
        >
          New Note
        </UButton>
      </div>

      <!-- Filters section -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <!-- Search input -->
        <UInput
          v-model="searchQuery"
          placeholder="Search notes..."
          icon="i-tabler-search"
          class="w-full"
        />

        <!-- Filter toggles -->
        <div class="flex flex-wrap gap-2">
          <UToggle
            v-model="showPinnedOnly"
            icon="i-tabler-pin"
            color="amber"
            size="sm"
          >
            Pinned only
          </UToggle>

          <!-- Tag dropdown -->
          <UDropdown
            v-if="allTags.length > 0"
            :items="[
              [
                {
                  label: 'All Tags',
                  icon: 'i-tabler-tags',
                  click: () => {
                    activeTag = null;
                  },
                },
              ],
              allTags.map((tag) => ({
                label: tag,
                icon: 'i-tabler-tag',
                click: () => {
                  activeTag = tag;
                },
              })),
            ]"
          >
            <UButton
              color="gray"
              variant="soft"
              size="sm"
              :trailing-icon="activeTag ? undefined : 'i-tabler-chevron-down'"
            >
              <span v-if="activeTag">
                <i class="i-tabler-tag mr-1"></i>
                {{ activeTag }}
                <i
                  class="i-tabler-x ml-1 cursor-pointer"
                  @click.stop="activeTag = null"
                ></i>
              </span>
              <span v-else>Filter by Tag</span>
            </UButton>
          </UDropdown>
        </div>
      </div>

      <!-- Notes grid -->
      <div
        v-if="filteredNotes.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <UCard
          v-for="note in filteredNotes"
          :key="note.id"
          class="border-0 shadow-sm hover:shadow-md transition-shadow"
          :ui="{
            body: {
              padding: 'p-0',
            },
            background: note.isPinned
              ? 'bg-amber-50 dark:bg-amber-900/10'
              : 'bg-white dark:bg-gray-800',
          }"
        >
          <!-- Card header with actions -->
          <div class="p-4 pb-2 flex justify-between">
            <h3 class="text-lg font-medium">{{ note.title }}</h3>
            <div class="flex gap-1">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-tabler-edit"
                size="xs"
                square
              />
              <UButton
                :color="note.isPinned ? 'amber' : 'gray'"
                :variant="note.isPinned ? 'solid' : 'ghost'"
                icon="i-tabler-pin"
                size="xs"
                square
                @click="togglePin(note.id)"
              />
              <UButton
                color="gray"
                variant="ghost"
                icon="i-tabler-trash"
                size="xs"
                square
                @click="deleteNote(note.id)"
              />
            </div>
          </div>

          <!-- Note metadata -->
          <div
            class="px-4 pb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <span class="flex items-center">
              <i class="i-tabler-calendar mr-1"></i>
              {{ formatDate(note.createdAt) }}
            </span>

            <span v-if="note.course" class="flex items-center">
              <i class="i-tabler-book mr-1"></i>
              {{ note.course }}
            </span>
          </div>

          <!-- Note content -->
          <div class="px-4 pb-2">
            <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
              {{ note.content }}
            </p>
          </div>

          <!-- Tags -->
          <div
            class="p-4 pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2"
          >
            <UBadge
              v-for="tag in note.tags"
              :key="tag"
              color="gray"
              variant="soft"
              size="xs"
              @click="activeTag = tag"
              class="cursor-pointer"
            >
              {{ tag }}
            </UBadge>
          </div>
        </UCard>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="py-12 flex flex-col items-center justify-center text-center"
      >
        <div class="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-800">
          <i
            class="i-tabler-notes-off text-5xl text-gray-500 dark:text-gray-400"
          ></i>
        </div>
        <h3 class="text-lg font-medium mb-2">No notes found</h3>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mb-4">
          {{
            searchQuery || activeTag || showPinnedOnly
              ? "Try adjusting your search or filters"
              : "Create your first note to get started"
          }}
        </p>
        <div class="flex gap-3">
          <UButton
            v-if="searchQuery || activeTag || showPinnedOnly"
            @click="
              searchQuery = '';
              activeTag = null;
              showPinnedOnly = false;
            "
            variant="soft"
            color="gray"
          >
            Clear Filters
          </UButton>
          <UButton
            color="primary"
            @click="isCreatingNote = true"
            icon="i-tabler-plus"
          >
            Create Note
          </UButton>
        </div>
      </div>
    </UContainer>

    <!-- New note modal -->
    <UModal v-model="isCreatingNote" :ui="{ width: 'sm:max-w-2xl' }">
      <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">Create New Note</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-tabler-x"
              size="sm"
              @click="isCreatingNote = false"
            />
          </div>
        </template>

        <div class="p-4 space-y-4">
          <!-- Title field -->
          <UFormGroup label="Title" name="title" :error="errors.title">
            <UInput v-model="newNote.title" placeholder="Note title" />
          </UFormGroup>

          <!-- Content field -->
          <UFormGroup label="Content" name="content" :error="errors.content">
            <UTextarea
              v-model="newNote.content"
              placeholder="Write your note here..."
              :ui="{ height: 'h-40' }"
            />
          </UFormGroup>

          <!-- Tags field -->
          <UFormGroup
            label="Tags"
            name="tags"
            help="Press Enter to add each tag"
          >
            <UInput
              placeholder="Add tags..."
              @keydown.enter.prevent="(e: KeyboardEvent) => {
                const target = e.target as HTMLInputElement;
                const value = target.value.trim();
                if (value && !newNote.tags.includes(value)) {
                  newNote.tags.push(value);
                  target.value = '';
                }
              }"
            />
            <div
              v-if="newNote.tags.length > 0"
              class="flex flex-wrap gap-2 mt-2"
            >
              <UBadge
                v-for="(tag, index) in newNote.tags"
                :key="index"
                color="gray"
                variant="soft"
                size="sm"
                class="cursor-pointer"
              >
                {{ tag }}
                <i
                  class="i-tabler-x ml-1"
                  @click="newNote.tags.splice(index, 1)"
                ></i>
              </UBadge>
            </div>
          </UFormGroup>

          <!-- Course dropdown -->
          <UFormGroup label="Related Course" name="course">
            <USelect
              v-model="newNote.course"
              :options="allCourses"
              placeholder="Select a course (optional)"
              searchable
              clearable
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              @click="isCreatingNote = false"
            >
              Cancel
            </UButton>
            <UButton color="primary" @click="createNote"> Save Note </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
