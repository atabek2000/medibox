<template>
  <div class="product-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.my_equipments'), to: '/profile/equipment' },
          { label: $t('bread_crumb.new_equipment') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <ProfileEquipmentAddForm />
    </div>
  </div>
</template>
