<script setup>
import { MainButtonConfig } from "~/composables/ui/useConfig";
const { locale } = useI18n();
const model = defineModel({ required: true });
const props = defineProps({
  product: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["showCreateModal"]);
const setModelValue = (val) => {
  model.value = val;
};
const showCreateReviewModal = () => {
  emit("showCreateModal");
};
</script>

<template>
  <div class="thanks-modal">
    <UModal v-model="model" class="" :ui="{ rounded: 'rounded-2xl' }">
      <div class="flex justify-center items-center px-6 py-6 flex-col">
        <div class="flex justify-end w-full">
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="setModelValue(false)"
          >
            <img src="~assets/svg/common/close-modal-small.svg" alt="close"
          /></UButton>
        </div>
        <p class="font-semibold text-sm text-center">
          {{ $t("basket.rate_service") }}:
        </p>
        <UDivider class="my-4" />
        <div class="flex gap-2 w-full">
          <img
            src="/common/avatar.png"
            alt="medicine"
            class="max-w-28 rounded-xl"
          />
          <div class="flex flex-col justify-between w-full">
            <div>
              <p class="font-normal text-base">
                {{ product?.[locale === "ru" ? "name" : `name_${locale}`] }}
              </p>
              <div class="flex justify-between">
                <p class="font-normal text-sm text-japanese-laurel">
                  {{ product.pharmacy }}
                </p>
                <CommonUiRatingBlock :rating="product.rating ?? 5" />
              </div>
            </div>
            <div class="flex justify-between items-center">
              <p class="font-bold text-base">
                {{ priceFormat(product.price) }}
              </p>
            </div>
          </div>
        </div>
        <UButton
          :ui="MainButtonConfig()"
          @click="showCreateReviewModal"
          class="w-full flex justify-center mt-4"
          >{{ $t("button.rate_&_review") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>
