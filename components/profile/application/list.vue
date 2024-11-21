<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const props = defineProps({
  order: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <div class="flex flex-wrap mt-5 gap-3 md:gap-6">
    <nuxt-link
      v-for="app in order"
      :key="app.id"
      :to="`/profile/application/${app.id}`"
      class="w-[48%] md:w-fit md:max-w-[276px]"
    >
      <img
        class="w-full md:w-[276px] h-[276px] object-cover rounded-xl"
        :src="
          app.client?.avatar?.length > 0
            ? app.client?.avatar[0]
            : '/common/avatar.png'
        "
        alt="avatar"
      />
      <p class="mt-3 font-semibold text-base">
        {{ app.client?.first_name }} {{ app.client?.last_name }}
      </p>
      <div class="flex gap-1 mt-4">
        <img src="~assets/svg/common/phone-green.svg" alt="" />
        <span class="font-normal text-sm">{{
          changePhoneMask("7" + app.client?.phone)
        }}</span>
      </div>
      <div class="flex gap-1 mt-2">
        <img src="~assets/svg/common/calendar-green.svg" alt="" />
        <span class="font-normal text-sm"
          >{{ dateToString(app.date) }},
          {{ app.service_time?.split(":")?.splice(0, 2)?.join(":") }}</span
        >
      </div>
      <UButton
        v-if="app.status === 'signed'"
        class="mt-3 w-full flex justify-center"
        :ui="TransparentButtonConfig()"
        @click="addSpecialist(app.id)"
      >
        {{ $t("button.manage") }}
      </UButton>
    </nuxt-link>
  </div>
</template>
