<script setup>
import {
  MainButtonConfig,
  MainPagination,
  TransparentButtonConfig,
} from "~/composables/ui/useConfig";
const cookie_jwt = useCookie("jwt");
const { useFilter, setFilters } = usePageFilter();
const { locale } = useI18n();

const search_params = reactive({
  search: "",
});

const { data, refresh, pending } = await useAsyncData(
  () =>
    $fetch(useRuntimeConfig().public.API_URL + `equipments/equipment-search/`, {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      params: { ...search_params, page: useFilter().value.page },
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
          { label: $t('bread_crumb.my_equipments'), to: '/profile/equipment' },
          { label: $t('bread_crumb.new_equipment') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <CommonUiSearchProduct v-model="search_params.search" />
        <div
          class="flex flex-wrap mt-5 gap-3 gap-y-6 md:gap-6"
          v-if="data?.data && data?.data?.length > 0 && !pending"
        >
          <div
            v-for="equipment in data?.data"
            :key="equipment.id"
            class="w-[48%] md:w-fit md:max-w-[276px]"
          >
            <nuxt-link
              :to="`/profile/equipment/add/${equipment.id}/add`"
              class="relative h-full flex flex-col justify-between"
            >
              <p
                class="px-2 py-1 mt-2 bg-emerald-100 text-japanese-laurel rounded-lg w-fit absolute left-2 z-10"
              >
                {{ $t(`filter.${equipment.type}`) }}
              </p>
              <p
                v-if="equipment.type === 'rent' && equipment.duration"
                class="px-2 py-1 mt-2 bg-emerald-100 text-japanese-laurel rounded-lg w-fit absolute right-2"
              >
                {{ $t(`fields.duration.${equipment.duration}`) }}
              </p>
              <img
                class="w-full md:w-[276px] h-[160px] object-cover rounded-xl"
                :src="
                  equipment.photo.length > 0
                    ? equipment.photo[0]
                    : '/common/avatar.png'
                "
                alt="avatar"
              />
              <p class="mt-3 font-semibold text-base">
                {{ equipment?.[locale === "ru" ? "name" : `name_${locale}`] }}
              </p>
              <UButton
                class="mt-3 w-full flex justify-center"
                :ui="TransparentButtonConfig()"
                :to="`/profile/equipment/add/${equipment.id}/add`"
              >
                {{ $t("button.select") }}
              </UButton>
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
        <div v-else>
          <CommonUiSpin :pending="pending" />
        </div>
        <UButton
          class="mt-10 w-full flex justify-center"
          :ui="MainButtonConfig()"
          to="/profile/equipment/add/new"
        >
          {{ $t("button.equipment_not_found") }} +
        </UButton>
      </div>
    </div>
  </div>
</template>
