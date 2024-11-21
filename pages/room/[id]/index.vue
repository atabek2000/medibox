<script setup>
import {
  ProductCarouselPrevButtonConfig,
  ProductCarouselNextButtonConfig,
  ProductTabConfig,
} from "~/composables/ui/useConfig";
const cookie_user = useCookie("user");
const { setAuthModalOpen } = useAuth();
const { t, locale } = useI18n();

const route = useRoute();

const { data, refresh } = await useAsyncData("specialist_account", () =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `premises/show-premise/${route.params.id}/`
  )
);
const showFullOpen = ref(false);

const tab_items = [
  {
    key: "products",
    label: t("content.desc_char"),
  },
];

const show_all = ref(false);

const toAppointment = () => {
  if (!cookie_user?.value?.id) {
    setAuthModalOpen(true);
    return;
  }

  useRouter().push(`/specialists/${route.params.id}/appointment`);
};

useHead({
  title:
    data?.value?.data?.purpose?.[
      `name${locale.value === "ru" ? "" : "_" + locale.value}`
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
          { label: $t('bread_crumb.room'), to: '/room' },
          {
            label: `${
              data?.data?.purpose?.[
                `name${locale === 'ru' ? '' : '_' + locale}`
              ]
            }`,
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
              data?.data?.photo?.length > 0
                ? data?.data?.photo
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
              data?.data?.photo?.length > 0
                ? data?.data?.photo
                : ['/common/avatar.png']
            "
          />
        </div>
        <div class="w-full md:w-1/2">
          <div class="flex justify-between relative items-center">
            <p class="font-semibold text-[28px]">
              {{
                data?.data?.purpose?.[
                  `name${locale === "ru" ? "" : "_" + locale}`
                ]
              }}
            </p>
          </div>
          <div class="flex justify-between items-center mt-1">
            <p class="bg-pumice font-normal text-xs px-2 py-1 rounded-lg mb-1">
              {{ $t(`fields.duration.${data?.data?.duration}`) }}
            </p>
            <div class="flex gap-x-3">
              <p class="text-2xl font-bold">
                {{ priceFormat(data?.data?.price) }}
              </p>
              <span class="text-pumice">•</span>
              <span class="font-medium text-base text-pumice align-[4px]">
                {{ $t("content.per_month") }}
              </span>
            </div>
          </div>

          <div class="flex mt-8">
            <img src="~assets/svg/common/location-black.svg" alt="" />
            <p class="font-normal text-xl ms-3">
              {{ data?.data?.address }}
            </p>
          </div>
          <p
            v-if="data?.data?.description"
            class="font-semibold text-base mt-8"
          >
            {{ $t("content.description") }}
          </p>
          <p class="font-medium text-sm mt-2">
            {{
              locale === "ru"
                ? data?.data?.description
                : data?.data?.[`description_${locale}`]
            }}
          </p>
          <CommonUiModalConnect
            :phone="changePhoneMask('7' + data?.data?.phone)"
            :phones="data?.data?.phones"
            :whatsapp_phone="data?.data?.whatsapp_phone"
            :url="`premises/complaint-premise/${route.params.id}`"
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
            <div class="flex justify-between py-2 mt-6">
              <span class="font-normal text-sm text-heavy-metal">{{
                $t("content.room_build_year")
              }}</span
              ><span class="font-medium text-sm">{{
                data?.data?.year_construction
              }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="font-normal text-sm text-heavy-metal">{{
                $t("content.object_area")
              }}</span
              ><span class="font-medium text-sm">{{ data?.data?.square }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="font-normal text-sm text-heavy-metal">{{
                $t("content.room_count")
              }}</span
              ><span class="font-medium text-sm">{{
                data?.data?.room_count
              }}</span>
            </div>
            <!-- <div class="flex justify-between py-2">
              <span class="font-normal text-sm text-heavy-metal">{{
                $t("content.placing")
              }}</span
              ><span class="font-medium text-sm">{{
                data?.data?.placing
              }}</span>
            </div> -->
            <div class="flex justify-between py-2">
              <span class="font-normal text-sm text-heavy-metal">{{
                $t("content.ceiling_height")
              }}</span
              ><span class="font-medium text-sm">{{
                data?.data?.ceiling_height
              }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="font-normal text-sm text-heavy-metal">{{
                $t("content.condition")
              }}</span
              ><span class="font-medium text-sm">{{
                data?.data?.condition
              }}</span>
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
