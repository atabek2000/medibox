<script setup>
import { MainButtonConfig } from "~/composables/ui/useConfig";

const isOpen = defineModel();

const props = defineProps({
  services: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["showSuccessModal"]);

const setModalVisible = (val) => {
  isOpen.value = val;
};
</script>

<template>
  <div class="payment-modal">
    <UModal v-if="props.services.length > 0" v-model="isOpen">
      <div class="p-8">
        <div class="flex justify-end">
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="() => (isOpen = false)"
          >
            <img src="~assets/svg/common/close-modal.svg" alt=""
          /></UButton>
        </div>
        <div>
          <UButton
            @click="emit('showSuccessModal')"
            :ui="MainButtonConfig()"
            class="w-full flex justify-center mt-4"
            >{{ $t("button.pay") }}</UButton
          >
        </div>
      </div>
    </UModal>
  </div>
</template>
