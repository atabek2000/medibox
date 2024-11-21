<script setup>
import { ProfileSidebarButtonConfig } from "~/composables/ui/useConfig";

const isModalOpen = ref(false);
</script>
<template>
  <div class="lang-modal">
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      @click="isModalOpen = true"
    >
      <template #leading>
        <img src="~assets/svg/profile/city.svg" alt="" />
      </template>
      {{ $t("content.city") }}</UButton
    >
    <CommonUiModalCity v-model="isModalOpen" />
  </div>
</template>
