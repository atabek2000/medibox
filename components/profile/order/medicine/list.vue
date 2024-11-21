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
      :to="`/profile/order/${app.id}?type=medicine`"
      class="w-[48%] md:w-fit md:max-w-[276px]"
    >
      <img
        class="w-full md:w-[276px] h-[276px] object-cover rounded-xl"
        :src="
          app.user?.avatar?.length > 0
            ? app.user?.avatar[0]
            : '/common/avatar.png'
        "
        alt="avatar"
      />
      <p class="mt-3 font-semibold text-base">
        {{
          app.user?.first_name
            ? `${app.user?.first_name} ${app.user?.last_name}`
            : app.user?.contact_person
        }}
      </p>
      <div class="flex gap-1 mt-4">
        <img src="~assets/svg/common/phone-green.svg" alt="" />
        <span class="font-normal text-sm">{{
          changePhoneMask("7" + app.user?.phone)
        }}</span>
      </div>
      <div class="flex gap-1 mt-2">
        <img src="~assets/svg/common/calendar-green.svg" alt="" />
        <span class="font-normal text-sm">
          {{ dateToString(app.created_at.split("T")[0]) }},
          {{
            new Date(app.created_at)
              ?.toLocaleTimeString("sv-SE")
              ?.split(":")
              ?.splice(0, 2)
              ?.join(":")
          }}</span
        >
      </div>
      <UButton
        class="mt-3 w-full flex justify-center"
        :ui="TransparentButtonConfig()"
        @click="addSpecialist(app.id)"
      >
        {{ $t("button.manage") }}
      </UButton>
    </nuxt-link>
  </div>
</template>
