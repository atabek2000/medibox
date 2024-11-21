<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const model = defineModel({ required: true });
const props = defineProps({
  phone: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["showModal", "closeModal"]);
</script>

<template>
  <div class="connect-init">
    <UModal v-model="model" :ui="{ rounded: 'rounded-[20px]' }">
      <div class="px-14 py-9">
        <div class="flex justify-between">
          <p class="text-xl font-bold">{{ $t("button.can_connect") }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="$emit('closeModal', 'managed')"
          />
        </div>
        <div class="flex justify-between gap-3 mt-6">
          <div class="w-1/2">
            <UButton
              class="w-full"
              variant="outline"
              :ui="TransparentButtonConfig()"
              @click="$emit('closeModal', 'managed')"
              >{{ $t("button.yes") }}</UButton
            >
          </div>
          <div class="w-1/2">
            <UButton
              class="w-full"
              variant="outline"
              color="valencia"
              :ui="TransparentButtonConfig()"
              @click="$emit('showModal', 'complain')"
              >{{ $t("button.no") }}</UButton
            >
          </div>
        </div>
        <UButton
          class="w-full mt-4"
          :ui="TransparentButtonConfig()"
          @click="$emit('showModal', 'complain')"
          >{{ $t("button.complain") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>
