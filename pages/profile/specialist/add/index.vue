<script setup>
import {
  MainButtonConfig,
  MainPagination,
  TransparentButtonConfig,
} from "~/composables/ui/useConfig";
const cookie_user = useCookie("user");
const cookie_jwt = useCookie("jwt");
const { useFilter, setFilters } = usePageFilter();
const { t, locale } = useI18n();
const { startLoading, stopLoading } = useLoader();

const search_params = reactive({
  search: "",
});

const { data, refresh, pending } = await useAsyncData(
  () =>
    $fetch(useRuntimeConfig().public.API_URL + `main/specialists/`, {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      params: search_params,
    }),
  { watch: [search_params, useFilter().value.page] }
);

const addSpecialist = async (id) => {
  startLoading();
  await useFetchApi(`entity/add-specialist/${id}`, {
    method: "POST",
    onResponse() {
      stopLoading();
      useToast().add({
        title: t("toast.success"),
        description: t("toast.success_added"),
      });
    },
  });
};

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
          { label: $t('bread_crumb.my_specialist'), to: '/profile/specialist' },
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
          v-if="data?.data?.items && data?.data?.items?.length > 0 && !pending"
        >
          <div
            v-for="medicine in data?.data?.items"
            :key="medicine.id"
            class="w-[48%] md:w-fit md:max-w-[276px]"
          >
            <img
              class="w-full md:w-[276px] h-[276px] object-cover rounded-xl"
              :src="
                medicine.avatar?.length > 0
                  ? medicine.avatar[0]
                  : '/common/avatar.png'
              "
              alt="avatar"
            />
            <p class="mt-3 font-semibold text-base">
              {{ medicine.first_name }} {{ medicine.last_name }}
            </p>
            <p class="font-normal text-sm">
              {{
                medicine.category?.[
                  `name${locale === "ru" ? "" : "_" + locale}`
                ]
              }}
            </p>
            <UButton
              class="mt-3 w-full flex justify-center"
              :ui="TransparentButtonConfig()"
              @click="addSpecialist(medicine.id)"
            >
              {{ $t("button.select") }}
            </UButton>
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
          to="/profile/specialist/add/new"
        >
          {{ $t("button.spec_not_found") }} +
        </UButton>
      </div>
    </div>
  </div>
</template>
