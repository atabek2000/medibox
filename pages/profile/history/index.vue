<script setup>
const cookie_user = useCookie("user");
</script>

<template>
  <div class="product-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.order_history') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <ProfileOrderHistoryIndexOrganization
          v-if="cookie_user?.role_id === 4"
        />
        <ProfileOrderHistoryIndexSeller
          v-else-if="cookie_user?.role_id === 3"
        />
        <ProfileOrderHistoryIndexSpecialist
          v-else-if="cookie_user?.role_id === 2"
        />
        <ProfileOrderHistoryIndexPrivate v-else />
      </div>
    </div>
  </div>
</template>
