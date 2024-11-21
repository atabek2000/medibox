<script setup>
import { MainTabConfig } from "~/composables/ui/useConfig";
const { t } = useI18n();
const history_type = ref("purchase");
const cookie_jwt = useCookie("jwt");

const { data, pending } = await useAsyncData(
  () =>
    $fetch(
      useRuntimeConfig().public.API_URL +
        `users/history?type=${history_type.value}`,
      {
        headers: {
          Authorization: `Bearer ${cookie_jwt.value}`,
        },
      }
    ),
  {
    watch: [history_type],
  }
);
const items = [
  {
    label: t("content.purchases"),
    key: "purchase",
  },
  {
    label: t("content.rents"),
    key: "rental",
  },
  {
    label: t("content.records"),
    key: "service",
  },
];
const onChangeTab = (index) => {
  history_type.value = items[index].key;
};
</script>

<template>
  <div class="order-history">
    <UTabs :items="items" :ui="MainTabConfig()" @change="onChangeTab">
      <template #item="{ item }">
        <div v-if="item.key === 'purchase'" class="mt-7">
          <ProfileOrderHistoryListPurchase
            v-if="data?.data && data?.data?.length > 0 && !pending"
            :data="data?.data"
          />
          <div v-else>
            <CommonUiSpin :pending="pending" />
          </div>
        </div>
        <div v-else-if="item.key === 'rental'" class="mt-7">
          <ProfileOrderHistoryListRental
            v-if="data?.data && data?.data?.length > 0 && !pending"
            :data="data?.data"
          />
          <div v-else>
            <CommonUiSpin :pending="pending" />
          </div>
        </div>
        <div v-else-if="item.key === 'service'" class="mt-7">
          <ProfileOrderHistoryListAppointment
            v-if="data?.data && data?.data?.length > 0 && !pending"
            :data="data?.data"
          />
          <div v-else>
            <CommonUiSpin :pending="pending" />
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
