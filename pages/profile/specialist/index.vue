<script setup>
import { MainButtonConfig } from "~/composables/ui/useConfig";

const cookie_jwt = useCookie("jwt");
const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `services/specialists/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);
</script>

<template>
  <div class="specialist-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.my_specialist') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <div
          v-if="data?.data?.length > 0"
          class="flex flex-wrap gap-3 md:gap-x-6 md:gap-y-8"
        >
          <div
            v-for="spec in data?.data"
            :key="spec.id"
            class="w-[48%] md:w-fit"
          >
            <ProfileSpecialistCard :specialist="spec.specialist" />
          </div>
          <UButton
            to="/profile/specialist/add"
            :ui="MainButtonConfig()"
            class="w-full mt-10 flex justify-center"
            >{{ $t("button.add_specialist") }}</UButton
          >
        </div>
        <ProfileSpecialistEmpty v-else />
      </div>
    </div>
  </div>
</template>
