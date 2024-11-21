<script setup>
import {
  TransparentButtonConfig,
  ProductCarouselPrevButtonConfig,
  ProductCarouselNextButtonConfig,
  ProductTabConfig,
  MainProductBadgeConfig,
  ActiveProductBadgeConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const cookie_user = useCookie("user");
const { setAuthModalOpen } = useAuth();
const route = useRoute();
const cookie_jwt = useCookie("jwt");
const { t, locale } = useI18n();

const dicts = ref();
const showFullOpen = ref(false);
const medicine_params = reactive({
  search: undefined,
  category_id: undefined,
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
        `services/clinic-services/${route.params.id}`,
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

const { data: categories } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL + `entity/categories/${route.params.id}`
  )
);

const selected_servcies = ref([]);

const tab_items = [
  {
    key: "products",
    label: t("content.all_services"),
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
  medicine_params.category_id =
    activeCategory.value !== 0 ? activeCategory.value : undefined;
};

const addToSelected = (e, id) => {
  e.preventDefault();

  if (selected_servcies.value.includes(id)) {
    selected_servcies.value = selected_servcies.value.filter((ss) => ss !== id);
  } else {
    selected_servcies.value.push(id);
  }
};

const onClickSign = () => {
  if (!cookie_user?.value?.id) {
    setAuthModalOpen(true);
    return;
  }
  if (selected_servcies.value.length === 0) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.select_service"),
    });
    return;
  }
  if (
    cookie_user.value?.role_id &&
    (cookie_user.value?.role_id === 3 || cookie_user.value?.role_id === 4) &&
    cookie_user.value?.status === "active"
  ) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("content.service_legal_unavailable"),
    });
    return;
  }

  useRouter().push(
    `/clinics/${route.params.id}/appointment/${selected_servcies.value.join(
      ","
    )}`
  );
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
          data?.data?.organisation_type?.id === 1
            ? { label: $t('bread_crumb.clinics'), to: '/clinics' }
            : { label: $t('bread_crumb.dentistry'), to: '/dentistry' },
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
              data?.data?.avatar && data?.data?.avatar?.length > 0
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
              class="w-full max-h-[560px] object-cover"
              draggable="false"
              @click="showFullOpen = true"
            />
          </UCarousel>
          <CommonUiModalPhotoCarousel
            v-model="showFullOpen"
            :images="
              data?.data?.avatar && data?.data?.avatar?.length > 0
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
            <div class="mt-5">
              <UBadge
                v-for="cat in categories.data"
                :key="cat.id"
                :ui="
                  cat.id === activeCategory
                    ? ActiveProductBadgeConfig()
                    : MainProductBadgeConfig()
                "
                class="mb-2"
                @click="setActiveCategory(cat.id)"
                >{{
                  cat?.[`name${locale === "ru" ? "" : "_" + locale}`]
                }}</UBadge
              >
            </div>
            <div class="mt-6">
              <nuxt-link
                v-for="product in show_all
                  ? medicines?.data
                  : medicines?.data?.slice(0, 10)"
                :key="product.id"
                :to="`/clinics/${route.params.id}/service/${product.service?.id}`"
              >
                <div class="medicine-block flex justify-between mb-4">
                  <div class="">
                    <p class="font-medium text-base">
                      {{
                        product?.service?.[
                          locale === "ru"
                            ? "service_type"
                            : `service_type_${locale}`
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
                      :url="`services/favorite-service/${product.id}`"
                    />
                    <div
                      class="starred_button cursor-pointer"
                      @click="addToSelected($event, product.id)"
                    >
                      <img
                        v-if="selected_servcies.includes(product.id)"
                        src="~assets/svg/common/checkmark-black-basket-small.svg"
                        alt=""
                      />
                      <img
                        v-else
                        src="~assets/svg/common/plus-gray-basket-small.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </nuxt-link>
              <UButton
                v-if="!show_all && medicines?.data?.length > 10"
                variant="link"
                :ui="{ padding: 'p-0' }"
                class="text-japanese-laurel mt-3"
                @click="() => (show_all = true)"
                >{{ $t("catalog.show_all") }}</UButton
              >
              <UButton
                v-if="show_all && medicines?.data?.length > 10"
                variant="link"
                :ui="{ padding: 'p-0' }"
                class="text-japanese-laurel mt-3"
                @click="() => (show_all = false)"
                >{{ $t("catalog.show_less") }}</UButton
              >
            </div>
            <UButton
              @click="onClickSign"
              class="w-full flex justify-center mt-6"
              :ui="MainButtonConfig()"
              >{{ $t("button.make_appoint") }}</UButton
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
