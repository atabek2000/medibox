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
          { label: $t('bread_crumb.my_services'), to: '/profile/service' },
          { label: $t('bread_crumb.new_service') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <ProfileServiceAddFormSpec v-if="cookie_user.role_id == 2" />
        <ProfileServiceAddForm v-else />
      </div>
    </div>
  </div>
</template>
