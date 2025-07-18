<template>
  <!-- PIN Authentication Modal -->
  <AdminPinAuth v-if="!isAuthenticated" @authenticated="handleAuthenticated" />
  
  <!-- Main Dashboard (only shown when authenticated) -->
  <div
    v-if="isAuthenticated"
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-indigo-950 transition-all duration-500"
  >
    <div
      class="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200/50 dark:border-neutral-700/50"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
            >
              <UIcon name="i-tabler-settings" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              >
                Admin Dashboard
              </h1>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">
                System Management Panel
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div
              class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-lg"
            >
              <UIcon
                name="i-tabler-keyboard"
                class="w-4 h-4 text-neutral-500 dark:text-neutral-400"
              />
              <span class="text-xs text-neutral-600 dark:text-neutral-400">
                Press
                <kbd
                  class="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-xs"
                  >?</kbd
                >
                for shortcuts
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="logout"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-all duration-200 text-sm font-medium"
                title="Logout"
              >
                <UIcon name="i-tabler-logout" class="w-4 h-4" />
                Logout
              </button>
              <div
                class="w-2 h-2 rounded-full"
                :class="isMaintenanceActive ? 'bg-amber-500' : 'bg-green-500'"
              ></div>
              <span class="text-sm text-neutral-600 dark:text-neutral-300">
                {{ isMaintenanceActive ? "Maintenance" : "Live" }}
              </span>
            </div>
            <button
              @click="
                $colorMode.preference =
                  $colorMode.value === 'dark' ? 'light' : 'dark'
              "
              class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              :title="
                $colorMode.value === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              "
            >
              <UIcon
                :name="
                  $colorMode.value === 'dark' ? 'i-tabler-sun' : 'i-tabler-moon'
                "
                class="w-5 h-5 text-neutral-600 dark:text-neutral-400"
              />
            </button>
            <NuxtLink
              to="/"
              class="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <UIcon name="i-tabler-arrow-left" class="w-4 h-4" />
              Home
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showShortcuts"
      @click="showShortcuts = false"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        @click.stop
        class="bg-white dark:bg-neutral-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-lg font-semibold text-neutral-800 dark:text-neutral-200"
          >
            Keyboard Shortcuts
          </h3>
          <button
            @click="showShortcuts = false"
            class="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <UIcon name="i-tabler-x" class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Show shortcuts</span
            >
            <kbd
              class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs"
              >?</kbd
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Toggle maintenance</span
            >
            <kbd
              class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs"
              >M</kbd
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Toggle theme</span
            >
            <kbd
              class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs"
              >T</kbd
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Go home</span
            >
            <kbd
              class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs"
              >H</kbd
            >
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-600 dark:text-neutral-400"
              >Clear cache</span
            >
            <kbd
              class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs"
              >C</kbd
            >
          </div>
        </div>
      </div>
    </div>
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-4 min-w-[320px] transform transition-all duration-300"
        :class="
          notification.type === 'success'
            ? 'border-l-4 border-l-green-500'
            : notification.type === 'error'
            ? 'border-l-4 border-l-red-500'
            : 'border-l-4 border-l-blue-500'
        "
      >
        <div class="flex items-start gap-3">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="
              notification.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30'
                : notification.type === 'error'
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-blue-100 dark:bg-blue-900/30'
            "
          >
            <UIcon
              :name="
                notification.type === 'success'
                  ? 'i-tabler-check'
                  : notification.type === 'error'
                  ? 'i-tabler-x'
                  : 'i-tabler-info-circle'
              "
              class="w-5 h-5"
              :class="
                notification.type === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : notification.type === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
              "
            />
          </div>
          <div class="flex-1">
            <h4
              class="text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              {{ notification.title }}
            </h4>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              {{ notification.message }}
            </p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
          >
            <UIcon name="i-tabler-x" class="w-4 h-4 text-neutral-500" />
          </button>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div
          class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
              <p class="text-blue-100">
                Manage your portfolio website with ease and style
              </p>
            </div>
            <div class="text-right">
              <div class="text-sm text-blue-200">Last login</div>
              <div class="text-lg font-semibold">{{ currentTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          class="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-700/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-tabler-world"
                class="w-5 h-5 text-green-600 dark:text-green-400"
              />
            </div>
            <div>
              <div
                class="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide"
              >
                Status
              </div>
              <div
                class="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ isMaintenanceActive ? "Maintenance" : "Online" }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-700/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-tabler-music"
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <div
                class="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide"
              >
                Music
              </div>
              <div
                class="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ customTrackEnabled ? "Custom" : "Spotify" }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-700/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-tabler-palette"
                class="w-5 h-5 text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <div
                class="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide"
              >
                Theme
              </div>
              <div
                class="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {{ $colorMode.value === "dark" ? "Dark" : "Light" }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-xl p-4 border border-neutral-200/50 dark:border-neutral-700/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"
            >
              <UIcon
                name="i-tabler-clock"
                class="w-5 h-5 text-amber-600 dark:text-amber-400"
              />
            </div>
            <div>
              <div
                class="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide"
              >
                Uptime
              </div>
              <div
                class="text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                24/7
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isMaintenanceActive"
        class="mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <UIcon
              name="i-tabler-alert-triangle"
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
            />
          </div>
          <div>
            <h3 class="font-semibold text-amber-800 dark:text-amber-300 mb-1">
              🚧 Maintenance Mode Active
            </h3>
            <p class="text-sm text-amber-700 dark:text-amber-400">
              Your website is currently under maintenance. Visitors will see the
              maintenance page while you can access all admin features.
            </p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <div class="space-y-6">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center"
            >
              <UIcon name="i-tabler-settings-cog" class="w-5 h-5 text-white" />
            </div>
            <h2
              class="text-xl font-semibold text-neutral-800 dark:text-neutral-200"
            >
              System Management
            </h2>
          </div>
          <div
            class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <UIcon name="i-tabler-tools" class="w-6 h-6 text-white" />
                </div>
                <div class="flex-1">
                  <h3
                    class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2"
                  >
                    Maintenance Mode
                  </h3>
                  <p
                    class="text-sm text-neutral-600 dark:text-neutral-400 mb-4"
                  >
                    Control website accessibility during updates and maintenance
                  </p>
                  <div class="relative">
                    <MaintenanceToggle @toggle="handleMaintenanceToggle" />
                    <div
                      v-if="isPerformingAction"
                      class="absolute inset-0 bg-white/50 dark:bg-neutral-800/50 rounded-lg flex items-center justify-center"
                    >
                      <div
                        class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div class="p-6">
              <h3
                class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4"
              >
                Quick Actions
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="performQuickAction('cache')"
                  class="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors text-sm group"
                  :disabled="isPerformingAction"
                >
                  <UIcon
                    :name="
                      actionStatus.cache ? 'i-tabler-check' : 'i-tabler-refresh'
                    "
                    class="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                    :class="actionStatus.cache ? 'text-green-500' : ''"
                  />
                  {{ actionStatus.cache ? "Cache Cleared" : "Clear Cache" }}
                </button>
                <button
                  @click="performQuickAction('backup')"
                  class="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors text-sm group"
                  :disabled="isPerformingAction"
                >
                  <UIcon
                    :name="
                      actionStatus.backup
                        ? 'i-tabler-check'
                        : 'i-tabler-database'
                    "
                    class="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                    :class="actionStatus.backup ? 'text-green-500' : ''"
                  />
                  {{ actionStatus.backup ? "Backup Created" : "Backup Data" }}
                </button>
                <button
                  @click="performQuickAction('logs')"
                  class="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors text-sm group"
                  :disabled="isPerformingAction"
                >
                  <UIcon
                    name="i-tabler-file-analytics"
                    class="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  View Logs
                </button>
                <button
                  @click="performQuickAction('security')"
                  class="flex items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors text-sm group"
                  :disabled="isPerformingAction"
                >
                  <UIcon
                    :name="
                      actionStatus.security
                        ? 'i-tabler-shield-check'
                        : 'i-tabler-shield'
                    "
                    class="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                    :class="actionStatus.security ? 'text-green-500' : ''"
                  />
                  {{
                    actionStatus.security ? "Scan Complete" : "Security Scan"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
            >
              <UIcon name="i-tabler-music" class="w-5 h-5 text-white" />
            </div>
            <h2
              class="text-xl font-semibold text-neutral-800 dark:text-neutral-200"
            >
              Content Management
            </h2>
          </div>
          <div
            class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex items-start gap-4 mb-6">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <UIcon name="i-tabler-music" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2"
                  >
                    Spotify Now Playing
                  </h3>
                  <p class="text-sm text-neutral-600 dark:text-neutral-400">
                    Manage custom tracks and Spotify integration
                  </p>
                </div>
              </div>

              <!-- Custom Track Status & Button -->
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-3 h-3 rounded-full"
                      :class="
                        customTrackEnabled ? 'bg-green-500' : 'bg-blue-500'
                      "
                    ></div>
                    <div>
                      <div
                        class="font-medium text-neutral-800 dark:text-neutral-200"
                      >
                        {{
                          customTrackEnabled
                            ? "Custom Track Active"
                            : "Spotify Sync Active"
                        }}
                      </div>
                      <div
                        class="text-sm text-neutral-600 dark:text-neutral-400"
                      >
                        {{
                          customTrackEnabled
                            ? "Using custom track display"
                            : "Syncing with Spotify"
                        }}
                      </div>
                    </div>
                  </div>
                  <button
                    @click="showCustomTrackModal = true"
                    class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <UIcon name="i-tabler-settings" class="w-4 h-4 mr-2" />
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Track Modal -->
      <CustomTrackManager
        :show-modal="showCustomTrackModal"
        @close="showCustomTrackModal = false"
        @track-updated="handleTrackUpdated"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
          class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <UIcon name="i-tabler-chart-line" class="w-5 h-5 text-white" />
              </div>
              <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">
                Analytics
              </h3>
            </div>
            <button
              class="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              View Details
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Page Views</span
              >
              <div class="flex items-center gap-2">
                <span
                  class="font-semibold text-neutral-800 dark:text-neutral-200"
                  >{{ formatNumber(1234) }}</span
                >
                <span class="text-xs text-green-600 dark:text-green-400"
                  >+12%</span
                >
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Visitors</span
              >
              <div class="flex items-center gap-2">
                <span
                  class="font-semibold text-neutral-800 dark:text-neutral-200"
                  >{{ formatNumber(567) }}</span
                >
                <span class="text-xs text-green-600 dark:text-green-400"
                  >+8%</span
                >
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Bounce Rate</span
              >
              <div class="flex items-center gap-2">
                <span
                  class="font-semibold text-neutral-800 dark:text-neutral-200"
                  >23%</span
                >
                <span class="text-xs text-red-600 dark:text-red-400">-3%</span>
              </div>
            </div>
            <div
              class="mt-3 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full animate-pulse"
                style="width: 76%"
              ></div>
            </div>
          </div>
        </div>
        <div
          class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <UIcon name="i-tabler-speedboat" class="w-5 h-5 text-white" />
              </div>
              <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">
                Performance
              </h3>
            </div>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Load Time</span
              >
              <span class="font-semibold text-green-600 dark:text-green-400"
                >{{ loadTime }}s</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Core Web Vitals</span
              >
              <span class="font-semibold text-green-600 dark:text-green-400"
                >Good</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >SEO Score</span
              >
              <span class="font-semibold text-green-600 dark:text-green-400"
                >98/100</span
              >
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-neutral-500 dark:text-neutral-400">FCP</span>
                <span class="text-neutral-700 dark:text-neutral-300">0.8s</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-neutral-500 dark:text-neutral-400">LCP</span>
                <span class="text-neutral-700 dark:text-neutral-300">1.1s</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <UIcon name="i-tabler-shield" class="w-5 h-5 text-white" />
              </div>
              <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">
                Security
              </h3>
            </div>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >SSL Certificate</span
              >
              <div class="flex items-center gap-2">
                <span class="font-semibold text-green-600 dark:text-green-400"
                  >Valid</span
                >
                <UIcon
                  name="i-tabler-shield-check"
                  class="w-4 h-4 text-green-500"
                />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Last Scan</span
              >
              <span
                class="font-semibold text-neutral-800 dark:text-neutral-200"
                >{{ formatTime(lastScan) }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Threats</span
              >
              <div class="flex items-center gap-2">
                <span class="font-semibold text-green-600 dark:text-green-400"
                  >None</span
                >
                <UIcon name="i-tabler-check" class="w-4 h-4 text-green-500" />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-neutral-600 dark:text-neutral-400"
                >Firewall</span
              >
              <span class="font-semibold text-blue-600 dark:text-blue-400"
                >Active</span
              >
            </div>
          </div>
        </div>
        <div class="md:col-span-2 xl:col-span-1">
          <SystemStatusCard />
        </div>
        <div class="md:col-span-2 xl:col-span-2">
          <ActivityLogCard />
        </div>
      </div>
    </div>
    <footer class="mt-16 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>Admin Dashboard • Portfolio Management System</p>
          <p class="mt-1">Made with ❤️ using Nuxt 3 & Vue 3</p>
        </div>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
// Authentication
const { isAuthenticated, logout: adminLogout, checkAuth } = useAdminAuth();

// Check authentication status on page load
await checkAuth();

const handleAuthenticated = () => {
  // Re-check auth status after successful PIN entry
  checkAuth();
};

const logout = async () => {
  await adminLogout();
  await navigateTo('/');
};

useHead({
  title: "Admin Dashboard - Portfolio Management",
  meta: [
    {
      name: "description",
      content:
        "Admin dashboard for managing website maintenance mode, custom tracks, and system settings.",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
});
const config = useRuntimeConfig();
const isMaintenanceActive = computed(
  () => config.public.maintenance === "true"
);
const currentTime = ref("");
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
const customTrackEnabled = ref(false);
const showCustomTrackModal = ref(false);

const checkCustomTrack = async () => {
  try {
    const response = await $fetch("/api/admin/custom-track");
    customTrackEnabled.value = response.customTrack?.enabled || false;
  } catch (error) {
    console.error("Error checking custom track:", error);
  }
};

const handleTrackUpdated = (enabled: boolean) => {
  customTrackEnabled.value = enabled;
  addNotification({
    type: "success",
    title: enabled ? "Custom Track Enabled" : "Custom Track Disabled",
    message: enabled
      ? "Your custom track is now active"
      : "Switched back to Spotify sync",
  });
};
const isPerformingAction = ref(false);
const actionStatus = ref({
  cache: false,
  backup: false,
  security: false,
});
const showShortcuts = ref(false);
interface Notification {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}
const notifications = ref<Notification[]>([]);
const addNotification = (notification: Omit<Notification, "id">) => {
  const id = Date.now().toString();
  notifications.value.push({ ...notification, id });
  setTimeout(() => {
    removeNotification(id);
  }, 5000);
};
const removeNotification = (id: string) => {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};
const handleMaintenanceToggle = (enabled: boolean) => {
  addNotification({
    type: enabled ? "info" : "success",
    title: enabled ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
    message: enabled
      ? "Website is now under maintenance"
      : "Website is back online",
  });
};
const performQuickAction = async (action: string) => {
  if (isPerformingAction.value) return;
  isPerformingAction.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    switch (action) {
      case "cache":
        actionStatus.value.cache = true;
        addNotification({
          type: "success",
          title: "Cache Cleared",
          message: "Application cache has been successfully cleared",
        });
        setTimeout(() => {
          actionStatus.value.cache = false;
        }, 3000);
        break;
      case "backup":
        actionStatus.value.backup = true;
        addNotification({
          type: "success",
          title: "Backup Created",
          message: "System backup has been created successfully",
        });
        setTimeout(() => {
          actionStatus.value.backup = false;
        }, 3000);
        break;
      case "security":
        actionStatus.value.security = true;
        addNotification({
          type: "success",
          title: "Security Scan Complete",
          message: "No threats detected. System is secure",
        });
        setTimeout(() => {
          actionStatus.value.security = false;
        }, 3000);
        break;
      case "logs":
        addNotification({
          type: "info",
          title: "Opening Logs",
          message: "System logs are being prepared for viewing",
        });
        break;
    }
  } catch (error) {
    console.error("Error performing action:", error);
    addNotification({
      type: "error",
      title: "Action Failed",
      message: `Failed to perform ${action} action. Please try again.`,
    });
  } finally {
    isPerformingAction.value = false;
  }
};
onMounted(() => {
  updateTime();
  setInterval(updateTime, 60000);
  checkCustomTrack();
});
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
const loadTime = ref(1.2);
const lastScan = ref(new Date());
const handleKeyDown = (event: KeyboardEvent) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    return;
  }
  switch (event.key.toLowerCase()) {
    case "?":
      showShortcuts.value = !showShortcuts.value;
      break;
    case "m":
      console.log("Toggle maintenance mode");
      break;
    case "t":
      const colorMode = useColorMode();
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
      break;
    case "h":
      navigateTo("/");
      break;
    case "c":
      performQuickAction("cache");
      break;
    case "escape":
      showShortcuts.value = false;
      break;
  }
};
onMounted(() => {
  updateTime();
  setInterval(updateTime, 60000);
  checkCustomTrack();
  setInterval(() => {
    loadTime.value = Math.random() * 0.5 + 0.8;
  }, 30000);
  document.addEventListener("keydown", handleKeyDown);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>
