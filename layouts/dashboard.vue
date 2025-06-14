<script setup lang="ts">
// Explicitly import useAuth
import useAuth from "~/composables/auth/useAuth";

const auth = useAuth();
const { user, logout } = auth;

// Initialize auth
onMounted(() => {
  auth.initAuth();
});

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Navigation items
const navItems = [
  { icon: "i-tabler-layout-dashboard", label: "Dashboard", to: "/dashboard" },
  { icon: "i-tabler-book", label: "Courses", to: "/dashboard/courses" },
  { icon: "i-tabler-notebook", label: "Topics", to: "/dashboard/topics" },
  {
    icon: "i-tabler-category",
    label: "Categories",
    to: "/dashboard/categories",
  },
  { icon: "i-tabler-notes", label: "Notes", to: "/dashboard/notes" },
];

// Mobile menu handling
const showMobileMenu = ref(false);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Top navbar -->
    <nav
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30 shadow-sm"
    >
      <div class="px-3 py-3 lg:px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button
              @click="toggleSidebar"
              class="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <i class="i-tabler-menu-2 w-5 h-5"></i>
            </button>

            <!-- Logo -->
            <NuxtLink to="/dashboard" class="flex items-center ml-2">
              <span
                class="text-primary-600 dark:text-primary-400 font-bold text-xl"
                >Learning Hub</span
              >
            </NuxtLink>
          </div>

          <div class="flex items-center">
            <!-- Dark mode toggle -->
            <UButton
              color="gray"
              variant="ghost"
              icon="i-tabler-moon"
              size="sm"
              class="mr-2"
            />

            <!-- User dropdown -->
            <UDropdown
              :items="[
                [
                  {
                    label: user?.name || 'User',
                    slot: 'account',
                    disabled: true,
                  },
                  { label: 'Profile', icon: 'i-tabler-user' },
                  { label: 'Settings', icon: 'i-tabler-settings' },
                ],
                [{ label: 'Sign out', icon: 'i-tabler-logout', click: logout }],
              ]"
            >
              <UAvatar
                size="sm"
                :alt="user?.name || 'User'"
                src="/photo.jpeg"
              />

              <template #account>
                <div class="px-4 py-3">
                  <span
                    class="block text-sm font-medium text-gray-900 dark:text-white"
                    >{{ user?.name || "User" }}</span
                  >
                  <span
                    class="block text-sm truncate text-gray-500 dark:text-gray-400"
                    >{{ user?.email || "user@example.com" }}</span
                  >
                </div>
              </template>
            </UDropdown>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ]"
    >
      <div class="h-full px-3 py-4 overflow-y-auto">
        <ul class="space-y-2">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <i
                :class="[
                  item.icon,
                  'w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500',
                ]"
              ></i>
              <span class="ml-3">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>

        <!-- Portfolio link -->
        <div class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <NuxtLink
            to="/"
            class="flex items-center p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <i
              class="i-tabler-home w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
            ></i>
            <span class="ml-3">Return to Portfolio</span>
          </NuxtLink>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="p-4 md:ml-64 pt-20">
      <slot />
    </div>
  </div>
</template>
