<script setup>
import { SearchInputConfig } from "~/composables/ui/useConfig";
const model = defineModel({ required: true });
const search = ref("");
let search_timeout;
const change = () => {
  clearTimeout(search_timeout);
  search_timeout = setTimeout(function () {
    model.value = search.value;
  }, 1000);
};
</script>

<template>
  <UInput :ui="SearchInputConfig()" v-model="search" @input="change">
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
