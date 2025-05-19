<script setup lang="ts">
import {
  IconLink,
  IconDeviceDesktop,
  IconTerminal,
  IconCode,
} from "@tabler/icons-vue";
interface SystemTool {
  _id?: string;
  _path?: string;
  name: string;
  icon: string;
  url?: string;
  category: "system" | "software";
  color?: string;
  description?: string;
}
const props = withDefaults(
  defineProps<{
    tools?: string[];
    showAll?: boolean;
    showCategories?: boolean;
  }>(),
  {
    tools: () => [],
    showAll: false,
    showCategories: true,
  }
);
const { data: allTools } = await useAsyncData<SystemTool[]>(
  "systemtools",
  async () => {
    const items = await queryContent("/systemtools").find();
    return items as unknown as SystemTool[];
  }
);
function getCategoryDisplayName(category: string): string {
  const { t } = useI18n();
  switch (category) {
    case "system":
      return t("system_category_system", "Operating Systems & Hardware");
    case "software":
      return t("system_category_software", "Software & Development Tools");
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
const visibleTools = computed(() => {
  if (!allTools.value) return [];
  if (props.showAll || props.tools.length === 0) {
    return allTools.value;
  }
  return allTools.value.filter((tool) => {
    const toolId = tool._path?.split("/").pop() || "";
    return props.tools.includes(toolId);
  });
});
const toolsByCategory = computed(() => {
  const categories: Record<string, SystemTool[]> = {};
  visibleTools.value.forEach((tool) => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });
  return categories;
});
const isMobile = ref(false);
const showAllMobile = ref(false);
const itemsPerPageMobile = 4;
onMounted(() => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIfMobile);
});
function checkIfMobile() {
  isMobile.value = window.innerWidth < 640;
}
const categoryHasMoreItems = (tools: SystemTool[]) => {
  return tools.length > itemsPerPageMobile;
};
const toggleShowMore = () => {
  showAllMobile.value = !showAllMobile.value;
};
const { t } = useI18n();
</script>
<template>
  <section class="flex flex-col gap-3">
    <a href="#system-tools">
      <div class="flex flex-row gap-1 items-center group relative">
        <IconLink
          class="absolute transform -translate-x-5 transition duration-200 opacity-0 w-4 h-4 group-hover:opacity-100"
        />
        <h2
          class="text-xl font-bold hover:cursor-pointer flex items-center gap-2"
        >
          <IconDeviceDesktop class="w-5 h-5 text-primary-500" />
          {{ $t("system_tools", "My Tech Stack") }}
        </h2>
      </div>
    </a>
    <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
      {{
        $t("system_tools_desc", "Development environment and tools I use daily")
      }}
    </p>
    <div
      v-if="!allTools || allTools.length === 0"
      class="text-center py-8 text-neutral-500"
    >
      <p>{{ $t("loading_tools", "Loading tech stack...") }}</p>
    </div>
    <template v-else-if="showCategories">
      <div
        v-for="(tools, category) in toolsByCategory"
        :key="category"
        class="mb-6"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="flex-shrink-0">
            <IconTerminal
              v-if="category === 'system'"
              class="text-primary-500"
            />
            <IconCode
              v-else-if="category === 'software'"
              class="text-primary-500"
            />
            <IconDeviceDesktop v-else class="text-primary-500" />
          </div>
          <h3
            class="text-sm font-medium text-neutral-600 dark:text-neutral-300"
          >
            {{ getCategoryDisplayName(category) }}
          </h3>
          <div class="h-px bg-neutral-200 dark:bg-neutral-700 flex-grow"></div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="(tool, index) in tools"
            :key="tool._id"
            v-show="!isMobile || showAllMobile || index < itemsPerPageMobile"
            class="system-tool flex flex-col items-center gap-2 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-primary-900/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
            :title="tool.description || tool.name"
          >
            <a
              :href="tool.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col items-center w-full"
            >
              <div class="flex justify-center items-center h-12 mb-2">
                <UIcon :name="tool.icon" class="text-3xl" />
              </div>
              <p class="text-xs font-medium text-center">{{ tool.name }}</p>
            </a>
          </div>
        </div>
        <div
          v-if="isMobile && categoryHasMoreItems(tools)"
          class="mt-4 text-center"
        >
          <UButton
            size="sm"
            variant="soft"
            color="primary"
            @click="toggleShowMore"
          >
            {{
              showAllMobile
                ? $t("show_less", "Show Less")
                : $t("show_more", "Show More")
            }}
          </UButton>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        <div
          v-for="(tool, index) in visibleTools"
          :key="tool._id"
          v-show="!isMobile || showAllMobile || index < itemsPerPageMobile"
          class="system-tool flex flex-col items-center gap-2 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-primary-900/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
          :title="tool.description || tool.name"
        >
          <a
            :href="tool.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center w-full"
          >
            <div class="flex justify-center items-center h-12 mb-2">
              <UIcon :name="tool.icon" class="text-3xl" />
            </div>
            <p class="text-xs font-medium text-center">{{ tool.name }}</p>
          </a>
        </div>
      </div>
      <div
        v-if="isMobile && visibleTools.length > itemsPerPageMobile"
        class="mt-4 text-center"
      >
        <UButton
          size="sm"
          variant="soft"
          color="primary"
          @click="toggleShowMore"
        >
          {{
            showAllMobile
              ? $t("show_less", "Show Less")
              : $t("show_more", "Show More")
          }}
        </UButton>
      </div>
    </template>
  </section>
</template>
<style scoped>
.system-tool a {
  text-decoration: none;
  color: inherit;
}
.system-tool:hover UIcon {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
</style>
