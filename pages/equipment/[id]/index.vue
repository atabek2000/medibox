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
const runtimeConfig = useRuntimeConfig();
const show_all = ref(false);
const sellers = ref([]);
const showFullOpen = ref(false);

const selected_seller = ref(undefined);
const { data, refresh, error } = await useAsyncData(() =>
  $fetch(
    runtimeConfig.public.API_URL +
      `equipments/show-equipment/${route.params.id}/`,
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
      `equipments/feedbacks/${route.params.id}`
  )
);

const tab_items = [
  {
    key: "renter",
    label:
      data.value?.data?.equipment?.type === "sale"
        ? t("fields.categories.seller")
        : t("content.lessor"),
  },
  {
    key: "reviews",
    label: t("content.reviews") + ` (${feedbacks.value?.data?.length})`,
  },
];

const selectSeller = (e, seller) => {
  e.preventDefault();
  selected_seller.value = seller;
};

const onClickSign = () => {
  if (!cookie_jwt.value) {
    setAuthModalOpen(true);
    return;
  }
  if (!selected_seller.value?.id) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("content.select_landlord"),
    });
    return;
  }
  useRouter().push(`/equipment/${selected_seller.value?.id}/rent`);
};

useHead({
  title:
    data?.value?.data?.equipment?.equipment?.[
      locale.value === "ru" ? "name" : `name_${locale}`
    ],
});

onMounted(async () => {
  await useFetchApi(
    `equipments/user-equipments/${data?.value.data?.equipment?.equipment?.id}`,
    {
      onResponse({ response }) {
        if (response.ok) sellers.value = response._data?.data;
      },
    }
  );
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
              data?.data?.equipment?.equipment?.photo &&
              data?.data?.equipment?.equipment?.photo[0]
                ? data?.data?.equipment?.equipment?.photo
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
              @click="showFullOpen = true"
            />
          </UCarousel>
          <CommonUiModalPhotoCarousel
            v-model="showFullOpen"
            :images="
              data?.data?.equipment?.equipment?.photo &&
              data?.data?.equipment?.equipment?.photo[0]
                ? data?.data?.equipment?.equipment?.photo
                : ['/common/avatar.png']
            "
          />
        </div>
        <div class="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <div class="flex justify-between relative items-center">
              <p class="font-semibold text-[28px]">
                {{
                  data?.data?.equipment?.equipment?.[
                    locale === "ru" ? "name" : `name_${locale}`
                  ]
                }}
              </p>
              <CommonUiButtonAddFavouriteProduct
                :is_favourite="data?.data?.equipment?.is_in_favorite"
                :url="`equipments/favorite-equipment/${data?.data?.equipment?.id}`"
              />
            </div>
            <div class="flex justify-between items-center mt-1">
              <p class="text-xl font-medium text-japanese-laurel">
                {{
                  data?.data?.equipment?.user?.[
                    locale === "ru"
                      ? "organisation_name"
                      : `organisation_name_${locale}`
                  ]
                }}
              </p>
              <p class="text-2xl font-bold">
                {{ priceFormat(data?.data?.equipment?.price) }}
              </p>
            </div>
            <div class="flex justify-between mt-3">
              <CommonUiCardInfoHorizontal
                :duration="data?.data?.equipment?.equipment?.duration"
                :status="data?.data?.equipment?.equipment?.status"
              />
              <CommonUiRatingBlockProduct
                :rating="data?.data?.equipment?.equipment?.rating ?? 5"
              />
            </div>
            <p class="font-normal text-xl mt-6">
              {{ $t("content.characteristic") }}
            </p>
            <p class="font-normal text-base mt-3">
              {{
                locale === "ru"
                  ? data?.data?.equipment?.equipment?.description
                  : data?.data?.equipment?.equipment?.[`description_${locale}`]
              }}
            </p>
          </div>
          <CommonUiModalConnect
            v-if="selected_seller"
            :phone="changePhoneMask('7' + selected_seller?.user?.phone)"
            :phones="selected_seller?.user?.phones"
            :whatsapp_phone="selected_seller?.user?.whatsapp_phone"
            :url="`equipments/complaint/${data?.data?.equipment?.id}`"
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
          <div v-if="item.key === 'renter'" class="mt-6">
            <nuxt-link
              v-for="seller in show_all ? sellers : sellers?.slice(0, 10)"
              :key="seller.id"
              :to="`/equipment/${$route.params.id}/seller/${seller?.user?.id}`"
              class="flex flex-wrap md:flex-nowrap py-1 mb-4"
            >
              <div class="w-1/2 md:w-1/3">
                <p class="font-semibold text-sm">
                  {{
                    [3, 4].includes(seller.user?.role?.id)
                      ? seller.user?.[
                          locale === "ru"
                            ? "organisation_name"
                            : `organisation_name_${locale}`
                        ]
                      : `${seller.user?.first_name} ${seller.user?.last_name}`
                  }}
                </p>
                <div class="flex mt-1">
                  <img
                    v-for="n in Number.isNaN(
                      Number.parseInt(seller.user?.rating)
                    )
                      ? 5
                      : Number.parseInt(seller.user?.rating)"
                    :key="n"
                    src="~assets/svg/common/star-gold.svg"
                    alt=""
                  />
                  <p
                    v-if="seller.user?.feedbacks"
                    class="text-dove-gray-200 font-normal text-xs ms-2"
                  >
                    ({{ seller.user?.feedbacks }} {{ $t("content.review") }})
                  </p>
                </div>
              </div>
              <div class="w-1/2 md:w-1/3">
                <p class="font-normal text-xs">
                  {{ $t("basket.delivery") }} {{ seller.delivery }}
                </p>
                <p class="font-normal text-xs">
                  {{ $t("basket.self_pick_up") }}: {{ seller.pickup }}
                </p>
              </div>
              <div
                class="w-full md:w-1/3 flex justify-between md:justify-end items-center"
              >
                <p class="font-semibold text-base">
                  {{ priceFormat(seller.price) }}
                </p>
                <UButton
                  v-if="selected_seller?.id == seller?.id"
                  @click="selectSeller($event, seller)"
                  class="py-2 px-5 ms-5 rounded-lg bg-emerald bg-opacity-20"
                  :ui="MainButtonConfig()"
                  variant="outline"
                  color="japanese-laurel"
                  >{{ $t("button.selected") }}</UButton
                >
                <UButton
                  v-else
                  @click="selectSeller($event, seller)"
                  class="py-2 px-5 ms-5 rounded-lg"
                  :ui="MainButtonConfig()"
                  variant="outline"
                  >{{ $t("button.select") }}</UButton
                >
              </div>
            </nuxt-link>
            <UButton
              v-if="!show_all && sellers.data?.length > 10"
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
            <UButton
              v-if="data?.data?.equipment?.type === 'sale'"
              @click="onClickSign"
              :ui="MainButtonConfig()"
              class="w-full mt-6 flex justify-center"
              >{{ $t("button.buy") }}</UButton
            >
            <UButton
              v-else
              @click="onClickSign"
              :ui="MainButtonConfig()"
              class="w-full mt-6 flex justify-center"
              >{{ $t("button.rent") }}</UButton
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
