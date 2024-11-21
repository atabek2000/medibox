<script setup>
import { MainBreadCrumbConfig } from "~/composables/ui/useConfig";
const props = defineProps({
  links: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <UBreadcrumb divider="/" :links="links" :ui="MainBreadCrumbConfig()">
    <template #divider>
      <UIcon
        name="i-heroicons-arrow-right-solid"
        class="bg-pumice"
      /> </template
  ></UBreadcrumb>
</template>
