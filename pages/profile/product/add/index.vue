<script setup>
import { MainButtonConfig, MainPagination } from "~/composables/ui/useConfig";
const { useFilter, setFilters } = usePageFilter();

const cookie_user = useCookie("user");
const cookie_jwt = useCookie("jwt");
const { locale } = useI18n();
const page = ref(1);
const refresh = () => {
  page.value = 1;
  refresh_data();
};

const search_params = reactive({
  name: "",
});

const { data, refresh: refresh_data } = await useAsyncData(
  () =>
    $fetch(useRuntimeConfig().public.API_URL + `medicines/search-product/`, {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      params: { ...useFilter().value, page: page.value, ...search_params },
    }),
  { watch: [search_params, page] }
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
          { label: $t('bread_crumb.my_products'), to: '/profile/product' },
          { label: $t('bread_crumb.new_product') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <CommonUiSearchProduct v-model="search_params.name" />
        <div
          v-if="data.data && data.data.length > 0"
          class="flex mt-5 flex-wrap gap-x-3 md:gap-x-6"
        >
          <div
            v-for="medicine in data.data"
            :key="medicine.id"
            class="w-[48%] md:min-w-[276px] md:w-[276px]"
          >
            <nuxt-link :to="`/profile/product/add/${medicine.id}/add`">
              <img
                class="w-full h-[160px] object-cover rounded-xl"
                :src="medicine.photo.length > 0 ? medicine.photo[0] : ''"
                alt="avatar"
              />
              <p class="mt-3 font-semibold text-base">
                {{ medicine?.[locale === "ru" ? "name" : `name_${locale}`] }}
              </p>
              <p class="font-normal text-sm text-japanese-laurel">
                {{
                  medicine.medicine_category?.[
                    `name${locale === "ru" ? "" : "_" + locale}`
                  ]
                }}
              </p>
            </nuxt-link>
          </div>
          <div class="flex justify-center w-full mt-10">
            <UPagination
              v-model="page"
              :page-count="useFilter().value.per_page"
              :total="data?.meta?.total"
              :ui="MainPagination()"
            />
          </div>
        </div>
        <UButton
          class="mt-10 w-full flex justify-center"
          :ui="MainButtonConfig()"
          to="/profile/product/add/new"
        >
          {{ $t("button.product_not_found") }} +
        </UButton>
      </div>
    </div>
  </div>
</template>
