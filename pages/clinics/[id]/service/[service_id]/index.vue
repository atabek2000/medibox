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
const selected_service = ref();
const showFullOpen = ref(false);

const dicts = ref();
const medicine_params = reactive({
  search: undefined,
  medicine_category_id: undefined,
});
const { data, refresh, pending } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `services/show/${route.params.service_id}/`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
);

const { data: medicines } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `services/clinics/${route.params.service_id}/`
  )
);

const { data: clinic } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${route.params.id}/`)
);

const { data: feedbacks, refresh: refreshFeedback } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `users/user-feedbacks/${route.params.id}`
  )
);

const setSelectedPharmacy = (id) => {
  if (selected_service.value == id) {
    selected_service.value = undefined;
  } else {
    selected_service.value = id;
  }
};

const selected_servcies = ref([]);

const tab_items = [
  {
    key: "products",
    label: t("fields.categories.organisation"),
  },
];

const show_all = ref(false);

const activeCategory = ref(0);
const setActiveCategory = (id) => {
  activeCategory.value = activeCategory.value === id ? 0 : id;
  medicine_params.medicine_category_id = activeCategory.value;
};

const addToSelected = (id) => {
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
  if (!selected_service.value) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.select_medical_center"),
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
    selected_service.value?.user?.role?.id > 2
      ? `${route.path.includes("clinics") ? "/clinics" : "/dentistry"}/${
          route.params.id
        }/service/${selected_service.value.id}/appointment`
      : `/specialists/${selected_service.value?.user?.id}/appointment/${selected_service.value.id}`
  );
};

useHead({
  title:
    data?.value?.data?.[
      locale.value === "ru" ? "service_type" : `service_type_${locale}`
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
          clinic.data?.organisation_type?.id === 1
            ? { label: $t('bread_crumb.clinics'), to: '/clinics' }
            : { label: $t('bread_crumb.dentistry'), to: '/dentistry' },
          {
            label:
              clinic?.data?.[
                locale === 'ru'
                  ? 'organisation_name'
                  : `organisation_name_${locale}`
              ],
            to: `/clinics/${route.params.id}`,
          },
          {
            label:
              data?.data?.[
                locale === 'ru' ? 'service_type' : `service_type_${locale}`
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
              data?.data?.photo && data?.data?.photo.length > 0
                ? data?.data?.photo
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
              data?.data?.photo && data?.data?.photo.length > 0
                ? data?.data?.photo
                : ['/common/avatar.png']
            "
          />
        </div>
        <div class="w-full md:w-1/2">
          <div class="flex justify-between relative items-center">
            <p class="font-semibold text-[28px]">
              {{
                data?.data?.[
                  locale === "ru" ? "service_type" : `service_type_${locale}`
                ]
              }}
            </p>

            <!-- <CommonUiButtonAddFavouriteProduct
              :is_favourite="data?.data?.is_in_favorite"
              :url="`users/favorite-user/${data?.data?.id}`"
            /> -->
          </div>
          <p class="text-japanese-laurel font-normal text-xl mt-1">
            {{
              clinic?.data?.[
                locale === "ru"
                  ? "organisation_name"
                  : `organisation_name_${locale}`
              ]
            }}
          </p>
          <CommonUiRatingBlockProduct
            :rating="data?.data?.rating ?? 5"
            class="mt-3"
          />
          <p class="font-medium text-xl mt-8">
            {{ $t("content.description") }}
          </p>
          <p class="font-normal text-base mt-3">
            {{
              locale === "ru"
                ? data?.data?.description
                : data?.data?.[`description_${locale}`]
            }}
          </p>
          <CommonUiModalConnect
            v-if="selected_service"
            :phone="changePhoneMask('7' + selected_service?.user?.phone)"
            :phones="selected_service?.user?.phones"
            :whatsapp_phone="selected_service?.user?.whatsapp_phone"
            :url="`services/complaint-service/${data?.data?.id}`"
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
                v-for="seller in medicines?.data"
                :key="seller?.user?.id"
                class="flex py-1 mb-4 flex-wrap md:flex-nowrap gap-y-2"
              >
                <div class="w-1/2 md:w-1/3">
                  <p
                    v-if="[3, 4].includes(seller?.user?.role?.id)"
                    class="font-semibold text-sm"
                  >
                    {{
                      seller?.user?.[
                        locale === "ru"
                          ? "organisation_name"
                          : `organisation_name_${locale}`
                      ]
                    }}
                  </p>
                  <p v-else class="font-semibold text-sm">
                    {{
                      `${seller?.user?.first_name} ${seller?.user?.last_name}`
                    }}
                  </p>

                  <div class="flex mt-1">
                    <img
                      v-for="n in Number.isNaN(
                        Number.parseInt(seller?.user?.rating ?? 5)
                      )
                        ? 1
                        : Number.parseInt(seller?.user?.rating ?? 5)"
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
                    v-if="selected_service?.id == seller?.id"
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
        </template>
      </UTabs>
    </div>
  </div>
</template>
