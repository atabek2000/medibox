<script setup>
import { MainButtonConfig, MainPagination } from "~/composables/ui/useConfig";
const cookie_user = useCookie("user");
const cookie_jwt = useCookie("jwt");
const { useFilter, setFilters } = usePageFilter();
const { locale } = useI18n();

const search_params = reactive({
  search: "",
});

const { data, refresh, pending } = await useAsyncData(
  () =>
    $fetch(useRuntimeConfig().public.API_URL + `services/service-search/`, {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      params: search_params,
    }),
  { watch: [search_params, useFilter().value.page] }
);

const page = ref(1);
watch(page, (newV) => {
  setFilters("page", newV);
  refresh();
});
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
        <CommonUiSearchProduct v-model="search_params.search" />
        <div
          class="flex flex-wrap mt-5 gap-3 md:gap-6"
          v-if="data?.data?.items && data?.data?.items.length > 0 && !pending"
        >
          <div
            v-for="medicine in data?.data?.items"
            :key="medicine.id"
            class="w-[48%] md:w-fit md:max-w-[276px]"
          >
            <nuxt-link :to="`/profile/service/add/${medicine.id}/add`">
              <img
                class="w-full md:w-[276px] h-[160px] object-cover rounded-xl"
                :src="
                  medicine.photo.length > 0
                    ? medicine.photo[0]
                    : '/common/avatar.png'
                "
                alt="avatar"
              />
              <p class="mt-3 font-semibold text-base">
                {{
                  medicine?.[
                    locale === "ru" ? "service_type" : `service_type_${locale}`
                  ]
                }}
              </p>
              <p class="font-normal text-sm text-japanese-laurel">
                {{
                  medicine.category?.[
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
              :total="data?.data?.items?.length"
              :ui="MainPagination()"
            />
          </div>
        </div>
        <div v-else>
          <CommonUiSpin :pending="pending" />
        </div>
        <UButton
          class="mt-10 w-full flex justify-center"
          :ui="MainButtonConfig()"
          to="/profile/service/add/new"
        >
          {{ $t("button.service_not_found") }} +
        </UButton>
      </div>
    </div>
  </div>
</template>
