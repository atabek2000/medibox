<script setup>
import { ProductWhiteTabConfig } from "~/composables/ui/useConfig";

const cookie_jwt = useCookie("jwt");
const { t } = useI18n();
const order_type = ref("medicine");

const { data, refresh, pending } = await useAsyncData(
  () =>
    $fetch(
      useRuntimeConfig().public.API_URL +
        `medicines/user-requests?type=${order_type.value}`,
      {
        headers: {
          Authorization: `Bearer ${cookie_jwt.value}`,
        },
      }
    ),
  {
    watch: [order_type],
  }
);

const tab_items = [
  {
    key: "medicine",
    label: t("bread_crumb.purchase"),
  },
  {
    key: "equipment",
    label: t("bread_crumb.equipment"),
  },
];

const onChangeTab = (index) => {
  order_type.value = tab_items[index].key;
};
</script>

<template>
  <div class="product-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.applications') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <div>
          <UTabs
            :items="tab_items"
            :ui="ProductWhiteTabConfig()"
            class="bg-none pb-[80px]"
            @change="onChangeTab"
          >
            <template #item="{ item }">
              <div class="mt-6">
                <div v-if="data?.data && data?.data?.length > 0 && !pending">
                  <ProfileOrderMedicineList
                    v-if="item.key === 'medicine'"
                    :order="data?.data"
                  />
                  <ProfileOrderEquipmentList v-else :order="data?.data" />
                </div>
                <div v-else>
                  <CommonUiSpin :pending="pending" />
                </div>
              </div>
            </template>
          </UTabs>
        </div>
        <!-- <ProfileApplicationEmpty v-else /> -->
      </div>
    </div>
  </div>
</template>
