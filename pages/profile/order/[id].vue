<script setup>
const cookie_user = useCookie("user");
const cookie_jwt = useCookie("jwt");
const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const type = route.query.type;

const { data, refresh } = await useAsyncData(() =>
  $fetch(
    runtimeConfig.public.API_URL +
      (type === "medicine"
        ? `medicines/requests/${route.params.id}`
        : `users/show-item/${route.params.id}?type=${type}`),
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
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
          {
            label: $t('bread_crumb.applications'),
            to:
              cookie_user.role_id === 4
                ? '/profile/application'
                : '/profile/order',
          },
          {
            label:
              type === 'medicine'
                ? [3, 4].includes(
                    data?.data.saleMedicines?.[0]?.moderatorPayment?.user?.role
                      ?.id
                  )
                  ? data?.data.saleMedicines?.[0]?.moderatorPayment?.user
                      ?.contact_person
                  : `${data?.data.saleMedicines?.[0]?.moderatorPayment?.user?.first_name} ${data?.data.saleMedicines?.[0]?.moderatorPayment?.user?.last_name}`
                : [3, 4].includes(data?.data.moderatorPayment?.user?.role?.id)
                ? data?.data.moderatorPayment?.user?.contact_person
                : `${data?.data.moderatorPayment?.user?.first_name} ${data?.data.moderatorPayment?.user?.last_name}`,
          },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <ProfileOrderMedicinePage
        v-if="type === 'medicine'"
        :order="data?.data"
        @refresh="refresh"
      />
      <ProfileOrderEquipmentPage
        v-else
        :order="data?.data"
        @refresh="refresh"
      />
    </div>
  </div>
</template>
