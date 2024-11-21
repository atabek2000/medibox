<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";

const isOpen = defineModel({ required: true });
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  body: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["handleOk"]);

const handleOk = () => {
  emit("handleOk");
  isOpen.value = false;
};
</script>
<template>
  <div class="confirm-modal">
    <UModal v-model="isOpen">
      <div class="px-14 py-9">
        <div class="flex justify-between">
          <p class="font-semibold text-xl">{{ title }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="isOpen = false"
          />
        </div>
        <p class="mt-2">{{ body }}</p>
        <div class="flex gap-3 mt-8">
          <div class="w-1/2">
            <UButton
              @click="handleOk"
              class="w-full"
              variant="outline"
              :ui="TransparentButtonConfig()"
              >{{ $t("button.yes") }}</UButton
            >
          </div>
          <div class="w-1/2">
            <UButton
              class="w-full"
              variant="outline"
              color="valencia"
              :ui="TransparentButtonConfig()"
              @click="isOpen = false"
              >{{ $t("button.no") }}</UButton
            >
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
