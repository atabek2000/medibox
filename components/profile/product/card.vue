<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { locale } = useI18n();

const props = defineProps({
  medicine: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="medicine-card md:min-w-[276px] md:w-[276px]">
    <nuxt-link :to="`/profile/product/edit/${medicine.id}`">
      <div>
        <img
          :src="
            medicine.medicine?.photo && medicine.medicine?.photo[0]
              ? medicine.medicine?.photo[0]
              : '/common/avatar.png'
          "
          alt="avatar"
          class="rounded-2xl object-cover w-full h-[160px] bg-seashell"
        />
        <p class="text-base font-semibold mt-3">
          {{ medicine.medicine?.[locale === "ru" ? "name" : `name_${locale}`] }}
        </p>
        <span
          :class="{ 'line-through text-pumice': medicine.is_promotion }"
          class="text-base font-semibold mt-3"
        >
          {{ priceFormat(medicine.price) }}
        </span>
        <span
          v-if="medicine.is_promotion"
          class="text-base font-semibold mt-3 ms-2"
        >
          {{ priceFormat(medicine.promotion) }}
        </span>
        <UButton
          :ui="TransparentButtonConfig()"
          class="flex justify-center w-full mt-2"
          >{{ $t("button.edit") }}
          <img src="~assets/svg/common/edit-pen.svg" alt="" class="ms-2" />
        </UButton>
      </div>
    </nuxt-link>
  </div>
</template>
