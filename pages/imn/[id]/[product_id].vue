<script setup>
import {
  ProductCarouselPrevButtonConfig,
  ProductCarouselNextButtonConfig,
  ProductTabConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const route = useRoute();
const cookie_jwt = useCookie("jwt");
const { setAuthModalOpen } = useAuth();
const pharmacies = ref([]);
const { startLoading, stopLoading } = useLoader();
const { t, locale } = useI18n();
const showFullOpen = ref(false);

const { data } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `medicines/show-medicine/${route.params.product_id}/`,
    {
      headers: {
        "Content-Language": locale.value,
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      async onResponse({ response }) {
        useFetchApi(
          `medicines/medicine-pharmacies/${response._data.data?.medicine?.id}/`,
          {
            async onResponse({ response }) {
              pharmacies.value = response._data;
            },
          }
        );
      },
    }
  )
);

const { data: medicine } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${route.params.id}/`, {
    headers: {
      "Content-Language": locale.value,
    },
  })
);

const tab_items = [
  {
    key: "products",
    label: t("fields.categories.seller"),
  },
];

const selected_pharmacy = ref();

const show_all = ref(false);

const setSelectedPharmacy = (id) => {
  if (selected_pharmacy.value == id) {
    selected_pharmacy.value = undefined;
  } else {
    selected_pharmacy.value = id;
  }
};

const goToBasket = () => {
  if (!cookie_jwt.value) {
    setAuthModalOpen(true);
    return;
  }

  if (selected_pharmacy.value) {
    startLoading();
    useFetchApi(`medicines/basket-medicine/${selected_pharmacy.value?.id}`, {
      method: "POST",
      onResponse() {
        stopLoading();
        useRouter().push("/basket");
      },
    });
  }
};

useHead({
  title:
    data?.value?.data?.medicine?.[
      locale.value === "ru" ? "name" : `name_${locale}`
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

          { label: $t('bread_crumb.imn'), to: '/imn' },
          {
            label:
              data?.data?.user?.[
                locale === 'ru'
                  ? 'organisation_name'
                  : `organisation_name_${locale}`
              ],
            to: `/imn/${$route?.params?.id}`,
          },
          {
            label:
              data?.data?.medicine?.[
                locale === 'ru' ? 'name' : `name_${locale}`
              ],
          },
        ]"
      />

      <div class="pharmacy-info w-full flex gap-6 mt-11">
        <div class="w-1/2">
          <UCarousel
            v-slot="{ item }"
            :items="
              data?.data?.medicine?.photo && data?.data?.medicine?.photo[0]
                ? data?.data?.medicine?.photo
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
              class="w-full max-h-[560px] object-cover rounded-2xl"
              draggable="false"
              @click="showFullOpen = true"
            />
          </UCarousel>
          <CommonUiModalPhotoCarousel
            v-model="showFullOpen"
            :images="
              data?.data?.medicine?.photo && data?.data?.medicine?.photo[0]
                ? data?.data?.medicine?.photo
                : ['/common/avatar.png']
            "
          />
        </div>
        <div class="w-1/2 flex flex-col justify-between">
          <div>
            <div class="flex justify-between relative items-center">
              <p class="font-semibold text-[28px]">
                {{
                  data?.data?.medicine?.[
                    locale === "ru" ? "name" : `name_${locale}`
                  ]
                }}
              </p>
              <CommonUiButtonAddFavouriteProduct
                :is_favourite="data?.data?.is_in_favorite"
                :url="`medicines/favorite-medicine/${data?.data?.id}`"
              />
            </div>
            <p class="text-japanese-laurel font-normal text-xl mt-1">
              {{
                data?.data?.user?.[
                  locale === "ru"
                    ? "organisation_name"
                    : `organisation_name_${locale}`
                ]
              }}
            </p>
            <CommonUiRatingBlockProduct
              :rating="data?.data?.user?.rating ?? 5"
              class="mt-3"
            />
            <p class="font-medium text-xl mt-8">
              {{ $t("content.characteristic") }}
            </p>
            <p class="font-normal text-base mt-3">
              {{
                locale === "ru"
                  ? data?.data?.medicine?.description
                  : data?.data?.medicine?.[`description_${locale}`]
              }}
            </p>
          </div>
          <CommonUiModalConnect
            v-if="selected_pharmacy"
            :phone="changePhoneMask('7' + selected_pharmacy?.user?.phone)"
            :phones="selected_pharmacy?.user?.phones"
            :whatsapp_phone="selected_pharmacy?.user?.whatsapp_phone"
            :url="`medicines/complaint/${data?.data?.medicine?.id}`"
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
            <div class="mt-6">
              <div
                v-for="seller in pharmacies?.data"
                :key="seller?.user?.id"
                class="flex py-1 mb-4 flex-wrap md:flex-nowrap"
              >
                <div class="w-1/2 md:w-1/3">
                  <p class="font-semibold text-sm">
                    {{
                      seller?.user?.[
                        locale === "ru"
                          ? "organisation_name"
                          : `organisation_name_${locale}`
                      ]
                    }}
                  </p>
                  <div class="flex mt-1">
                    <img
                      v-for="n in Number.isNaN(
                        Number.parseInt(seller?.user?.rating)
                      )
                        ? 5
                        : Number.parseInt(seller?.user?.rating)"
                      :key="n"
                      src="~assets/svg/common/star-gold.svg"
                      alt=""
                    />
                    <p
                      v-if="seller?.user?.feedbacks"
                      class="text-dove-gray-200 font-normal text-xs ms-2"
                    >
                      ({{ seller?.user?.feedbacks }} {{ $t("content.review") }})
                    </p>
                  </div>
                </div>
                <div class="w-1/2 md:w-1/3">
                  <p class="font-normal text-xs">
                    {{ $t("basket.delivery") }} завтра
                  </p>
                  <p class="font-normal text-xs">
                    {{ $t("basket.self_pick_up") }}: завтра, бесплатно
                  </p>
                </div>
                <div
                  class="w-full md:w-1/3 flex justify-between md:justify-end items-center"
                >
                  <div>
                    <span
                      :class="
                        seller?.is_promotion ? 'line-through text-pumice' : ''
                      "
                      class="font-semibold text-base"
                    >
                      {{ priceFormat(seller.price) }}
                    </span>
                    <span
                      v-if="seller?.is_promotion"
                      class="font-semibold text-base ms-2"
                    >
                      {{ priceFormat(seller.promotion) }}
                    </span>
                  </div>
                  <UButton
                    v-if="selected_pharmacy?.id == seller?.id"
                    @click="setSelectedPharmacy(seller)"
                    class="py-2 px-5 ms-5 rounded-lg bg-emerald bg-opacity-20"
                    :ui="MainButtonConfig()"
                    variant="outline"
                    color="japanese-laurel"
                    >{{ $t("button.selected") }}</UButton
                  >
                  <UButton
                    v-else
                    @click="setSelectedPharmacy(seller)"
                    class="py-2 px-5 ms-5 rounded-lg"
                    :ui="MainButtonConfig()"
                    variant="outline"
                    >{{ $t("button.select") }}</UButton
                  >
                </div>
              </div>
              <UButton
                v-if="!show_all"
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
            <UButton
              @click="goToBasket"
              class="w-full flex justify-center mt-6"
              :ui="MainButtonConfig()"
              >{{ $t("button.go_to_basket") }}</UButton
            >
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
