<script setup>
import { SearchInputConfig } from "~/composables/ui/useConfig";
const { useFilter } = usePageFilter();
const emit = defineEmits(["refresh"]);

let search_timeout;
const change = () => {
  clearTimeout(search_timeout);
  search_timeout = setTimeout(function () {
    emit("refresh");
  }, 1000);
};
</script>

<template>
  <UInput
    :ui="SearchInputConfig()"
    v-model="useFilter().value.search"
    @input="change"
  >
    <template #leading>
      <div class="flex w-full justify-center items-center focus:hidden">
        <UIcon
          name="i-heroicons-magnifying-glass-20-solid"
          class="bg-[#00010080]"
        />

        <p class="text-[#00010080] ms-2">{{ $t("filter.search") }}</p>
      </div>
    </template>
  </UInput>
</template>
