<script setup>
import { MainButtonConfig, MainPagination } from "~/composables/ui/useConfig";
const { useFilter } = usePageFilter();

const cookie_jwt = useCookie("jwt");
const page = ref(1);
const refresh = () => {
  page.value = 1;
  refresh_data();
};

const {
  data,
  refresh: refresh_data,
  pending,
} = await useAsyncData(
  () =>
    $fetch(useRuntimeConfig().public.API_URL + `medicines/`, {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      params: { ...useFilter().value, page: page.value },
    }),
  {
    watch: [page],
  }
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
          { label: $t('bread_crumb.my_products') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <div
          v-if="data?.data?.length > 0 && !pending"
          class="flex flex-wrap gap-x-3 md:gap-x-6 gap-y-8"
        >
          <div
            v-for="medicine in data?.data"
            :key="medicine.id"
            class="w-[48%] md:w-fit"
          >
            <ProfileProductCard :medicine="medicine" />
          </div>
          <div class="flex justify-center w-full mt-10">
            <UPagination
              v-model="page"
              :page-count="useFilter().value.per_page"
              :total="data?.meta?.total"
              :ui="MainPagination()"
            />
          </div>

          <UButton
            to="/profile/product/add"
            :ui="MainButtonConfig()"
            class="w-full mt-10 flex justify-center"
            >{{ $t("button.add_product") }}</UButton
          >
        </div>
        <div
          v-else-if="pending"
          class="pharmacies_block flex flex-wrap gap-3 md:gap-6 mt-5"
        >
          <SkeletonCard v-for="i in 4" :key="i" class="w-[48%] md:w-[276px]" />
        </div>
        <ProfileProductEmpty v-else />
      </div>
    </div>
  </div>
</template>
