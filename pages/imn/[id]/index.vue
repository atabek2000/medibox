<script setup>
import {
  ProductCarouselPrevButtonConfig,
  ProductCarouselNextButtonConfig,
  ProductTabConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const route = useRoute();
const cookie_jwt = useCookie("jwt");
const { t, locale } = useI18n();
const dicts = ref();
const showFullOpen = ref(false);

const medicine_params = reactive({
  search: undefined,
  medicine_category_id: undefined,
  type: "product",
});
const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${route.params.id}/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);
const { data: medicines } = await useAsyncData(
  () =>
    $fetch(
      useRuntimeConfig().public.API_URL +
        `medicines/all-medicines/${route.params.id}`,
      {
        params: medicine_params,
        headers: {
          Authorization: `Bearer ${cookie_jwt.value}`,
        },
      }
    ),
  { watch: medicine_params }
);

const { data: feedbacks, refresh: refreshFeedback } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `users/user-feedbacks/${route.params.id}`
  )
);

const tab_items = [
  {
    key: "products",
    label: t("content.all_products"),
  },
  {
    key: "reviews",
    label: t("content.reviews") + ` (${feedbacks.value.data.length})`,
  },
];

const show_all = ref(false);

const activeCategory = ref(0);
const setActiveCategory = (id) => {
  activeCategory.value = activeCategory.value === id ? 0 : id;
  medicine_params.medicine_category_id = activeCategory.value;
};

useHead({
  title:
    data?.value?.data?.[
      locale.value === "ru"
        ? "organisation_name"
        : `organisation_name_${locale}`
    ],
});

onMounted(() => {
  const { useDicts } = useDict();
  dicts.value = useDicts();
});
</script>
<template>
  <div>
    <div class="pharmacy-page bg-white main-container pb-16">
      <CommonUiBreadCrumb
        class="mt-10"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.imn'), to: '/imn' },
          {
            label:
              data?.data?.[
                locale === 'ru'
                  ? 'organisation_name'
                  : `organisation_name_${locale}`
              ],
          },
        ]"
      />

      <div
        class="pharmacy-info w-full flex flex-wrap md:flex-nowrap gap-y-3 md:gap-6 mt-11"
      >
        <div class="w-full md:w-1/2">
          <UCarousel
            v-slot="{ item }"
            :items="
              data?.data?.avatar && data?.data?.avatar[0]
                ? data?.data?.avatar
                : ['/common/avatar.png']
            "
            :ui="{
              item: 'basis-full',
              container: 'rounded-lg',
            }"
            :prev-button="ProductCarouselPrevButtonConfig()"
            :next-button="ProductCarouselNextButtonConfig()"
            class="rounded-lg overflow-hidden"
            arrows
            indicators
          >
            <img
              :src="item"
              class="w-full max-h-[600px] object-cover"
              draggable="false"
              @click="showFullOpen = true"
            />
          </UCarousel>
          <CommonUiModalPhotoCarousel
            v-model="showFullOpen"
            :images="
              data?.data?.avatar && data?.data?.avatar[0]
                ? data?.data?.avatar
                : ['/common/avatar.png']
            "
          />
        </div>
        <div class="w-full md:w-1/2">
          <div class="flex justify-between relative items-center">
            <p class="font-semibold text-[28px]">
              {{
                data?.data?.[
                  locale === "ru"
                    ? "organisation_name"
                    : `organisation_name_${locale}`
                ]
              }}
            </p>
            <CommonUiButtonAddFavouriteProduct
              :is_favourite="data?.data?.is_in_favorite"
              :url="`users/favorite-user/${data?.data?.id}`"
            />
          </div>
          <CommonUiRatingBlockProduct
            :rating="data?.data?.rating ?? 5"
            class="mt-3"
          />
          <div v-if="data?.data?.address" class="flex mt-8">
            <img src="~assets/svg/common/location-black.svg" alt="" />
            <p class="font-normal text-xl ms-3">
              {{ data?.data?.address }}
            </p>
          </div>
          <Map :center="[data?.data?.lat, data?.data?.long]" class="mt-5" />
          <CommonUiModalConnect
            :phone="changePhoneMask('7' + data?.data?.phone)"
            :phones="data?.data?.phones"
            :whatsapp_phone="data?.data?.whatsapp_phone"
            class="mt-6"
          />
        </div>
      </div>
    </div>
    <div class="tiny-container bg-wild-sand-300 pt-16">
      <UTabs
        :items="tab_items"
        :ui="ProductTabConfig()"
        class="bg-none pb-[80px]"
      >
        <template #item="{ item }">
          <div v-if="item.key === 'products'" class="mt-6">
            <CommonUiSearchProduct v-model="medicine_params.search" />
            <div class="mt-6">
              <nuxt-link
                v-for="product in show_all
                  ? medicines.data
                  : medicines.data.slice(0, 10)"
                :key="product.id"
                :to="`/imn/${$route?.params?.id}/${product.id}`"
              >
                <div class="medicine-block flex justify-between mb-4">
                  <div class="">
                    <p class="font-medium text-base">
                      {{
                        product?.medicine?.[
                          locale === "ru" ? "name" : `name_${locale}`
                        ]
                      }}
                    </p>
                    <span
                      :class="product?.is_promotion ? 'line-through' : ''"
                      class="font-semibold text-sm text-pumice"
                    >
                      {{ priceFormat(product.price) }}
                    </span>
                    <span
                      v-if="product?.is_promotion"
                      class="font-semibold text-sm text-pumice ms-2"
                    >
                      {{ priceFormat(product.promotion) }}
                    </span>
                  </div>
                  <div class="flex gap-[6px]">
                    <CommonUiButtonAddFavouriteSmall
                      :is_favourite="product.is_in_favorite"
                      :url="`medicines/favorite-medicine/${product.id}`"
                    />

                    <CommonUiButtonAddBasketSmall
                      :is_selected="product.is_in_basket"
                      :url="`medicines/basket-medicine/${product.id}`"
                    />
                  </div>
                </div>
              </nuxt-link>
              <UButton
                v-if="!show_all && medicines.data.length > 10"
                variant="link"
                :ui="{ padding: 'p-0' }"
                class="text-japanese-laurel mt-3"
                @click="() => (show_all = true)"
                >{{ $t("catalog.show_all") }}</UButton
              >
              <UButton
                v-if="show_all && medicines.data.length > 10"
                variant="link"
                :ui="{ padding: 'p-0' }"
                class="text-japanese-laurel mt-3"
                @click="() => (show_all = false)"
                >{{ $t("catalog.show_less") }}</UButton
              >
            </div>
            <UButton
              to="/basket"
              class="w-full flex justify-center mt-6"
              :ui="MainButtonConfig()"
              >{{ $t("button.go_to_basket") }}</UButton
            >
          </div>
          <div v-else class="mt-6">
            <div v-if="feedbacks?.data">
              <CommonUiReview
                v-for="review in feedbacks?.data"
                :key="review.id"
                :review="review"
              />
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
