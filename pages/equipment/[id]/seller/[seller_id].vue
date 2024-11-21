<script setup>
import {
  ProductCarouselPrevButtonConfig,
  ProductCarouselNextButtonConfig,
  ProductTabConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const { t, locale } = useI18n();
const { setAuthModalOpen } = useAuth();
const route = useRoute();
const cookie_jwt = useCookie("jwt");
const { data, refresh } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `equipments/show-equipment/${route.params.id}/`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
);

const { data: seller } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL + `users/show/${route.params.seller_id}/`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
);

const { data: feedbacks } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `users/user-feedbacks/${route.params.seller_id}`
  )
);

const { data: equipments } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `equipments/user/${route.params.seller_id}`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
);

const tab_items = [
  {
    key: "sales",
    label: t("content.sale_products"),
  },
  {
    key: "rents",
    label: t("content.rent_products"),
  },
  {
    key: "reviews",
    label: t("content.reviews") + ` (${feedbacks.value?.data?.length})`,
  },
];

const show_all = ref(false);

useHead({
  title:
    seller?.value?.data?.[
      locale.value === "ru"
        ? "organisation_name"
        : `organisation_name_${locale}`
    ],
});
</script>
<template>
  <div>
    <div class="pharmacy-page bg-white main-container pb-16">
      <CommonUiBreadCrumb
        class="mt-10"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.equipment'), to: '/equipment' },
          {
            label:
              data?.data?.equipment?.equipment?.[
                locale === 'ru' ? 'name' : `name_${locale}`
              ],
            to: `/equipment/${$route.params.id}`,
          },
          {
            label: [3, 4].includes(seller?.data?.role?.id)
              ? seller?.data?.[
                  locale === 'ru'
                    ? 'organisation_name'
                    : `organisation_name_${locale}`
                ]
              : `${seller?.data?.first_name} ${seller?.data?.last_name}`,
          },
        ]"
      />

      <div
        class="pharmacy-info w-full flex flex-wrap md:flex-nowrap gap-6 mt-11"
      >
        <div class="w-full md:w-1/2">
          <UCarousel
            v-slot="{ item }"
            :items="
              seller?.data?.avatar && seller?.data?.avatar[0]
                ? seller?.data?.avatar
                : ['/common/avatar.png']
            "
            :ui="{
              item: 'basis-full',
              container: 'rounded-lg max-h-[600px]',
            }"
            :prev-button="ProductCarouselPrevButtonConfig()"
            :next-button="ProductCarouselNextButtonConfig()"
            class="rounded-lg overflow-hidden"
            arrows
            indicators
          >
            <img
              :src="item"
              class="w-full object-cover rounded-2xl"
              draggable="false"
            />
          </UCarousel>
        </div>
        <div class="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <div class="flex justify-between relative items-center">
              <p class="font-semibold text-[28px]">
                {{
                  seller?.data?.[
                    locale === "ru"
                      ? "organisation_name"
                      : `organisation_name_${locale}`
                  ]
                }}
              </p>
              <CommonUiButtonAddFavouriteProduct
                :is_favourite="data?.data?.is_in_favorite"
                :url="`users/favorite-user/${$route.params.seller_id}`"
              />
            </div>
            <div class="flex justify-between mt-3">
              <CommonUiRatingBlockProduct
                :rating="data?.data?.equipment?.rating ?? 5"
              />
            </div>
            <div v-if="seller?.data?.address" class="flex mt-8">
              <img src="~assets/svg/common/location-black.svg" alt="" />
              <p class="font-normal text-xl ms-3">
                {{ seller?.data?.address }}
              </p>
            </div>
            <Map
              :center="[seller?.data?.lat, seller?.data?.long]"
              class="mt-5"
            />
          </div>
          <CommonUiModalConnect
            :phone="changePhoneMask('7' + seller?.data?.phone)"
            :phones="seller?.data?.phones"
            :whatsapp_phone="seller?.data?.whatsapp_phone"
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
          <div v-if="item.key === 'sales' || item.key === 'rents'" class="mt-6">
            <div
              v-for="seller in item.key === 'sales'
                ? equipments.data.filter((es) => es.type === 'sale')
                : equipments.data.filter((es) => es.type === 'rent')"
              :key="seller.id"
              class="flex flex-wrap md:flex-nowrap py-1 mb-4"
            >
              <div class="w-1/2 md:w-1/2">
                <p class="font-semibold text-sm">
                  {{
                    seller.equipment?.[
                      locale === "ru" ? "name" : `name_${locale}`
                    ]
                  }}
                </p>
                <p class="font-semibold text-sm text-pumice">
                  {{ priceFormat(seller.price) }}
                </p>
              </div>
              <div
                class="w-full md:w-1/2 flex justify-between md:justify-end items-center"
              >
                <div class="flex align-middle">
                  <CommonUiButtonAddFavouriteSmall
                    :is_favourite="seller.is_in_favorite"
                    :url="`equipments/favorite-equipment/${seller.id}`"
                  />
                  <UButton
                    class="py-2 px-5 ms-2 rounded-lg"
                    :ui="MainButtonConfig()"
                    :to="`/equipment/${seller?.id}`"
                    variant="outline"
                    >{{
                      seller.type === "rent"
                        ? $t("button.rent")
                        : $t("button.buy")
                    }}</UButton
                  >
                </div>
              </div>
            </div>
            <UButton
              v-if="
                !show_all &&
                equipments.data.filter((es) => es.type === 'sale').length > 10
              "
              variant="link"
              :ui="{ padding: 'p-0' }"
              class="text-japanese-laurel mt-3"
              @click="() => (show_all = true)"
              >{{ $t("catalog.show_all") }}</UButton
            >
            <UButton
              v-if="show_all"
              variant="link"
              :ui="{ padding: 'p-0' }"
              class="text-japanese-laurel mt-3"
              @click="() => (show_all = false)"
              >{{ $t("catalog.show_less") }}</UButton
            >
          </div>
          <div v-else class="mt-6">
            <div v-if="feedbacks.data">
              <CommonUiReview
                v-for="review in feedbacks.data"
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
