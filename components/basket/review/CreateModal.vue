<script setup>
import { MainButtonConfig } from "~/composables/ui/useConfig";
const { startLoading, stopLoading } = useLoader();
const model = defineModel({ required: true });
const props = defineProps({
  product: {
    type: Object,
    default: {},
  },
  url: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["refresh"]);
const rating = ref(0);
const review_text = ref("");
const images = ref();
const setModelValue = (val) => {
  model.value = val;
};
const sendReview = async () => {
  const form_data = new FormData();
  form_data.append("rating", rating.value);
  form_data.append("comment", review_text.value);
  if (images.value)
    Array.from(images.value).forEach((file) => {
      form_data.append("photo[]", file);
    });
  startLoading();
  useFetchApi(props.url, {
    method: "POST",
    body: form_data,
    async onResponse({ request, response, options }) {
      stopLoading();
      setModelValue(false);
      emit("refresh");
    },
  });
};
</script>

<template>
  <div class="thanks-modal">
    <UModal v-model="model" class="" :ui="{ rounded: 'rounded-2xl' }">
      <div class="flex justify-center px-6 py-6 flex-col">
        <div class="flex justify-between w-full">
          <p class="font-semibold text-2xl">{{ $t("basket.your_review") }}</p>
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="setModelValue(false)"
          >
            <img src="~assets/svg/common/close-modal-small.svg" alt="close"
          /></UButton>
        </div>

        <CommonUiSetRating v-model="rating" class="mt-4" />
        <UTextarea
          v-model="review_text"
          :placeholder="$t('basket.type_review')"
          class="rounded-2xl mt-2"
          maxlength="255"
          :ui="{
            color: {
              white: { outline: 'bg-wild-sand ring-0 focus:ring-0' },
            },
            padding: {
              sm: 'px-4 py-4',
            },
            placeholder:
              'placeholder-gray-400 dark:placeholder-gray-500 font-normal text-sm',
            rounded: 'rounded-2xl',
          }"
        />

        <p class="w-full text-end text-pumice font-normal text-xs mt-2">
          {{ review_text.length }}/255 {{ $t("form.symbols") }}
        </p>

        <BasketReviewFileUploader v-model="images" />

        <UButton
          :ui="MainButtonConfig()"
          class="w-full flex justify-center mt-4"
          @click="sendReview"
          >{{ $t("button.ready") }}</UButton
        >
        <UButton
          variant="link"
          @click="setModelValue(false)"
          class="flex justify-center font-semibold text-base w-full text-japanese-laurel mt-3"
          >{{ $t("button.cancel") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>
