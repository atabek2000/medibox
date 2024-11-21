<script setup>
const cookie_jwt = useCookie("jwt");

const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `entity/organisations/`, {
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
          { label: $t('bread_crumb.my_products') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <div
          v-if="data?.data?.length > 0"
          class="flex flex-wrap gap-x-6 gap-y-8"
        >
          <div v-for="medicine in data?.data" :key="medicine.id" class="">
            <ProfileOrganizationCard :medicine="medicine" />
          </div>
        </div>
        <ProfileOrganizationEmpty v-else />
      </div>
    </div>
  </div>
</template>
