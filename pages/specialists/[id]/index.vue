<script setup>
import {
  TransparentButtonConfig,
  ProductCarouselPrevButtonConfig,
  ProductCarouselNextButtonConfig,
  ProductTabConfig,
  WhiteButtonConfig,
} from "~/composables/ui/useConfig";
const cookie_jwt = useCookie("jwt");
const { setAuthModalOpen } = useAuth();
const { t, locale } = useI18n();
const selected_servcies = ref([]);
const cookie_user = useCookie("user");

const route = useRoute();
const showFullOpen = ref(false);

const { data, refresh } = await useAsyncData("specialist_account", () =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${route.params.id}/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);

const { data: services } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `services/specialist-services/${route.params.id}/`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
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
    label: t("fields.categories.service"),
  },
  {
    key: "reviews",
    label: t("content.reviews") + ` (${feedbacks.value?.data?.length})`,
  },
];

const show_all = ref(false);

const toAppointment = () => {
  if (!cookie_jwt?.value) {
    setAuthModalOpen(true);
    return;
  }

  if (selected_servcies.value.length === 0) {
    if (selected_servcies.value.length === 0) {
      useToast().add({
        title: t("toast.error"),
        color: "red",
        description: t("toast.select_service"),
      });
      return;
    }
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
    `/specialists/${route.params.id}/appointment/${selected_servcies.value.join(
      ","
    )}`
  );
};

const addToSelected = (e, id) => {
  e.preventDefault();

  if (selected_servcies.value.includes(id)) {
    selected_servcies.value = selected_servcies.value.filter((ss) => ss !== id);
  } else {
    selected_servcies.value.push(id);
  }
};

useHead({
  title: `${data?.value?.data?.first_name} ${data?.value?.data?.last_name}`,
});
</script>
<template>
  <div>
    <div class="pharmacy-page bg-white main-container pb-16">
      <CommonUiBreadCrumb
        class="mt-10"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.specialists'), to: '/specialists' },
          { label: `${data?.data?.first_name} ${data?.data?.last_name}` },
        ]"
      />

      <div
        class="pharmacy-info w-full flex flex-wrap md:flex-nowrap gap-6 mt-11"
      >
        <div class="w-full md:w-1/2">
          <UCarousel
            v-slot="{ item }"
            :items="
              data?.data?.avatar?.length > 0
                ? data?.data?.avatar
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
              data?.data?.avatar?.length > 0
                ? data?.data?.avatar
                : ['/common/avatar.png']
            "
          />
        </div>
        <div class="w-full md:w-1/2">
          <div class="flex justify-between relative items-center">
            <p class="font-semibold text-[28px]">
              {{ `${data?.data?.first_name} ${data?.data?.last_name}` }}
            </p>
            <CommonUiButtonAddFavouriteProduct
              :is_favourite="data?.data?.is_in_favorite"
              :url="`users/favorite-user/${data?.data?.id}`"
            />
          </div>
          <div class="flex justify-between items-center mt-1">
            <p class="text-xl font-medium">
              {{
                data?.data?.category?.[
                  `name${locale === "ru" ? "" : "_" + locale}`
                ]
              }}
            </p>
            <CommonUiRatingBlockProduct
              :rating="data?.data?.rating ?? 5"
              class="mt-3"
            />
          </div>

          <div v-if="data?.data?.address" class="flex mt-8">
            <img src="~assets/svg/common/location-black.svg" alt="" />
            <p class="font-normal text-xl ms-3">
              {{ data?.data?.address }}
            </p>
          </div>
          <p
            v-if="
              data?.data?.[
                locale === 'ru' ? 'about_doctor' : `about_doctor_${locale}`
              ]
            "
            class="font-normal text-xl mt-6"
          >
            {{ $t("form.about_doctor") }}
          </p>
          <p class="font-normal text-base mt-3">
            {{
              data?.data?.[
                locale === "ru" ? "about_doctor" : `about_doctor_${locale}`
              ]
            }}
          </p>
          <p
            v-if="data?.data?.doctor_document"
            class="text-base font-medium mt-5"
          >
            {{ $t("service.specialist_documents") }}
          </p>
          <UButton
            v-if="data?.data?.doctor_document"
            class="w-full flelx justify-center mt-3"
            :ui="WhiteButtonConfig()"
            :to="data?.data?.doctor_document"
          >
            <img src="~assets/svg/common/document-icon.svg" alt="" />
            <div>
              <p class="font-normal text-sm">
                {{ data?.data?.doctor_document.split("/").pop() }}
              </p>
              <p class="font-normal text-sm text-pumice text-start">12 MB</p>
            </div>
          </UButton>
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
              <nuxt-link
                v-for="service in show_all
                  ? services.data
                  : services.data.slice(0, 10)"
                :key="service.id"
              >
                <div class="medicine-block flex justify-between mb-4">
                  <div class="">
                    <p class="font-medium text-base">
                      {{
                        service?.OrganisationService?.service?.[
                          locale === "ru"
                            ? "service_type"
                            : `service_type_${locale}`
                        ]
                      }}
                    </p>
                    <span
                      :class="
                        service?.OrganisationService?.is_promotion
                          ? 'line-through text-pumice'
                          : ''
                      "
                      class="font-semibold text-sm"
                    >
                      {{ priceFormat(service?.OrganisationService?.price) }}
                    </span>
                    <span
                      v-if="service?.OrganisationService?.is_promotion"
                      class="font-semibold text-sm ms-2"
                    >
                      {{ priceFormat(service?.OrganisationService?.promotion) }}
                    </span>
                  </div>
                  <div class="flex gap-[6px]">
                    <CommonUiButtonAddFavouriteSmall
                      :is_favourite="service.is_in_favorite"
                      :url="`services/favorite-service/${service.OrganisationService?.id}`"
                    />

                    <div
                      class="starred_button cursor-pointer"
                      @click="
                        addToSelected($event, service.OrganisationService?.id)
                      "
                    >
                      <img
                        v-if="
                          selected_servcies.includes(
                            service.OrganisationService?.id
                          )
                        "
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
                v-if="!show_all && services.data.length > 10"
                variant="link"
                :ui="{ padding: 'p-0' }"
                class="text-japanese-laurel mt-3"
                @click="() => (show_all = true)"
                >{{ $t("catalog.show_all") }}</UButton
              >
              <UButton
                v-if="show_all && services.data.length > 10"
                variant="link"
                :ui="{ padding: 'p-0' }"
                class="text-japanese-laurel mt-3"
                @click="() => (show_all = false)"
                >{{ $t("catalog.show_less") }}</UButton
              >
            </div>
            <UButton
              @click="toAppointment"
              class="w-full mt-6"
              :ui="TransparentButtonConfig()"
              >{{ $t("button.make_appoint") }}</UButton
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
