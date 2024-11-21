<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { locale } = useI18n();
const props = defineProps({
  specialist: {
    type: Object,
    default: {},
  },
});
</script>
<template>
  <div class="specialist-card">
    <nuxt-link :to="`/profile/specialist/edit/${specialist.id}`">
      <div>
        <img
          :src="specialist.avatar[0] ?? '/common/avatar.png'"
          alt="avatar"
          class="rounded-2xl object-cover w-full md:min-w-[200px] md:w-[200px] h-[200px] bg-seashell"
        />
        <p class="text-sm font-semibold mt-4">
          {{ specialist.first_name }} {{ specialist.last_name }}
        </p>
        <div class="flex mt-4 gap-1">
          <img src="~assets/svg/common/phone-green.svg" alt="" />
          <p class="text-sm font-normal">
            {{ changePhoneMask("7" + specialist.phone) }}
          </p>
        </div>
        <div v-if="specialist.category.name" class="flex mt-2 gap-1">
          <img src="~assets/svg/common/circle-intersect-green.svg" alt="" />
          <p class="text-sm font-normal">
            {{
              specialist.category?.[
                `name${locale === "ru" ? "" : "_" + locale}`
              ]
            }}
          </p>
        </div>
        <UButton
          :ui="TransparentButtonConfig()"
          class="flex justify-center w-full mt-4"
          >{{ $t("button.edit") }}
          <img src="~assets/svg/common/edit-pen.svg" alt="" class="ms-2" />
        </UButton></div
    ></nuxt-link>
  </div>
</template>
