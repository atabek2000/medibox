<script setup>
const cookie_user = useCookie("user");
const contacts = ref([]);

onMounted(() => {
  const { useDicts } = useDict();
  contacts.value = useDicts().value.TechnicalSupport;
});
</script>

<template>
  <div class="profile-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.tech_support') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <ProfileSupport :contacts="contacts" />
      </div>
    </div>
  </div>
</template>
