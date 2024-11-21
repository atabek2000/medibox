<script setup>
const route = useRoute();

const { data, refresh } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `premises/show-premise/${route.params.id}`
  )
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
          { label: $t('bread_crumb.room'), to: '/profile/room' },
          { label: data?.data.address },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <ProfileRoomEditForm :room="data?.data" />
      </div>
    </div>
  </div>
</template>
