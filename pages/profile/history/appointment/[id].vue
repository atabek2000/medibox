<script setup>
const cookie_jwt = useCookie("jwt");
const route = useRoute();
const { locale } = useI18n();
const { data, refresh } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `services/show-appointment/${route.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
);
</script>

<template>
  <div class="rental-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          {
            label: $t('bread_crumb.order_history'),
            to: '/profile/history',
          },
          { label: $t('bread_crumb.appointments'), to: '/profile/history' },
          {
            label:
              data?.data?.organisation_service?.service?.[
                locale === 'ru' ? 'service_type' : `service_type_${locale}`
              ],
          },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <ProfileOrderHistoryPageAppointment
          :order="data?.data"
          @refresh="refresh"
        />
      </div>
    </div>
  </div>
</template>
