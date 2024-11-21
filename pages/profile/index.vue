<script setup>
const user = useCookie("user");
const router = useRouter();
const { logout } = useAuth();
const { t } = useI18n();
useHead({
  title: t("bread_crumb.profile"),
});

const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${user?.value?.id}`, {
    async onResponseError({ request, response, options }) {
      logout();
      router.push("/");
    },
  })
);
</script>

<template>
  <div class="profile-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex flex-wrap md:flex-nowrap gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <ProfileCard :user="data?.data" @refresh="refresh" />
      </div>
    </div>
  </div>
</template>
