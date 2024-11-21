<script setup>
import { MainButtonConfig } from "~/composables/ui/useConfig";

const cookie_jwt = useCookie("jwt");

const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `premises/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);
</script>

<template>
  <div class="product-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.room') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <div
          v-if="data?.data?.length > 0"
          class="flex flex-wrap gap-x-3 md:gap-x-6 gap-y-8"
        >
          <div
            v-for="room in data?.data"
            :key="room.id"
            class="w-[48%] md:w-fit"
          >
            <ProfileRoomCard :room="room" />
          </div>
          <UButton
            to="/profile/room/add"
            :ui="MainButtonConfig()"
            class="w-full mt-10 flex justify-center"
            >{{ $t("button.add_room") }}</UButton
          >
        </div>
        <ProfileRoomEmpty v-else />
      </div>
    </div>
  </div>
</template>
