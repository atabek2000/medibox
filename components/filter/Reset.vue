<script setup>
import { ResetButtonConfig } from "~/composables/ui/useConfig";
const { resetFilters } = usePageFilter();
const emit = defineEmits(["refresh"]);

const reset = () => {
  resetFilters();
  emit("refresh");
};
</script>

<template>
  <div class="filter-reset">
    <UButton @click="reset" :ui="ResetButtonConfig()">{{
      $t("button.reset")
    }}</UButton>
  </div>
</template>
