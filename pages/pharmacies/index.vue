<script setup>
import { MainPagination } from "~/composables/ui/useConfig";

const runtimeConfig = useRuntimeConfig();
const { useFilter, setFilters } = usePageFilter();
const cookie_jwt = useCookie("jwt");
const { t } = useI18n();
useHead({
  title: t("bread_crumb.pharmacies"),
});
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
    $fetch(runtimeConfig.public.API_URL + "main/pharmacies/", {
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
  <div class="main-container pt-10 pb-14">
    <div class="flex flex-wrap md:flex-nowrap gap-x-[62px]">
      <CommonUiBreadCrumb
        class="w-full md:w-1/4 2xl:w-1/5"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.pharmacies') },
        ]"
      />
      <div class="w-full md:w-3/4 2xl:w-4/5 mt-3 md:mt-0">
        <CommonUiSearchCatalog @refresh="refresh" />
      </div>
    </div>
    <div class="flex flex-wrap md:flex-nowrap gap-x-[62px]">
      <div class="w-full md:w-1/4 2xl:w-1/5 mt-3 md:mt-0">
        <CommonUiCatalogCityFilter @refresh="refresh" />
        <CommonUiCatalogFilter
          filter_type="sort"
          :title="$t('filter.sorting')"
          @refresh="refresh"
        />

        <FilterReset @refresh="refresh" />
      </div>
      <div class="w-full md:w-3/4 2xl:w-4/5">
        <div
          v-if="data?.data?.items && data?.data?.items.length > 0 && !pending"
          class="pharmacies_block flex flex-wrap gap-3 md:gap-6 mt-5"
        >
          <PharmacyCard
            v-for="pharmacy in data?.data?.items"
            :key="pharmacy.organisation_name"
            :product="pharmacy"
            class=""
          />

          <div class="flex justify-center w-full mt-10">
            <UPagination
              v-model="page"
              :page-count="useFilter().value.per_page"
              :total="data?.data?.meta?.total"
              :ui="MainPagination()"
            />
          </div>
        </div>
        <div
          v-else-if="pending"
          class="pharmacies_block flex flex-wrap gap-3 md:gap-6 mt-5"
        >
          <SkeletonCard v-for="i in 4" :key="i" class="w-[48%] md:w-[276px]" />
        </div>
        <CommonUiSpin v-else :pending="pending" />
      </div>
    </div>
  </div>
</template>
