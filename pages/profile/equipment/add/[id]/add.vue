<script setup>
const cookie_jwt = useCookie("jwt");
const route = useRoute();

const { data } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `equipments/show-info/${route.params.id}`,
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
          { label: $t('bread_crumb.my_equipments'), to: '/profile/equipment' },
          {
            label: $t('bread_crumb.new_equipment'),
            to: '/profile/equipment/add',
          },
          { label: data?.data?.[locale === 'ru' ? 'name' : `name_${locale}`] },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <ProfileEquipmentAddFormExist :equipment="data?.data" />
      </div>
    </div>
  </div>
</template>
