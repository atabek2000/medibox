<script setup>
import { MainButtonConfig } from "~/composables/ui/useConfig";

const emit = defineEmits(["rent"]);
const { locale } = useI18n();

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

const isOpen = defineModel({ required: true });
</script>
<template>
  <div class="rent-modal">
    <UModal v-model="isOpen" :ui="{ rounded: 'rounded-2xl' }">
      <div class="p-8">
        <div class="flex justify-end">
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="() => (isOpen = false)"
          >
            <img src="~assets/svg/common/close-modal.svg" alt="close"
          /></UButton>
        </div>
        <div class="mt-5 flex gap-3">
          <img
            :src="
              data.equipment?.equipment?.equipment?.photo?.[0] ??
              '/common/avatar.png'
            "
            alt="room"
            class="max-w-28"
          />
          <div class="w-full">
            <p class="font-semibold text-sm">
              {{
                data.equipment?.equipment?.equipment?.[
                  locale === "ru" ? "name" : `name_${locale}`
                ]
              }}
            </p>
            <div class="flex justify-between">
              <p class="font-medium text-xs text-japanese-laurel">
                {{ $t("modal.med_center") }}
                {{
                  data.equipment?.equipment?.user?.[
                    locale === "ru"
                      ? "organisation_name"
                      : `organisation_name_${locale}`
                  ]
                }}
              </p>
              <CommonUiRatingBlockGray
                :rating="data.equipment?.equipment?.user?.rating ?? 5"
              />
            </div>
            <p
              v-if="data.equipment?.equipment?.type === 'rent'"
              class="bg-pumice font-normal text-xs px-2 py-1 rounded-lg mb-1 h-fit me-2 w-fit"
            >
              {{ $t(`fields.duration.${data.equipment?.equipment?.duration}`) }}
            </p>
          </div>
        </div>
        <div class="flex gap-3 mt-4">
          <div class="w-1/2">
            <p class="text-base font-normal text-pumice">
              {{ $t("modal.payment") }}
            </p>
            <p class="text-base font-medium">
              {{
                priceFormat(
                  Number(data.equipment?.equipment?.price) +
                    Number(data.delivery_price)
                )
              }}
            </p>
          </div>
          <div class="w-1/2">
            <p class="text-base font-normal text-pumice">
              {{ $t("modal.time_and_address") }}
            </p>
            <p class="text-base font-medium" v-if="data.user_address">
              {{
                `${$t("content.city_short")} ${
                  data.user_address?.city_id?.[
                    locale === "ru" ? "name" : `name_${locale}`
                  ]
                } ${$t("content.street_short")} ${data.user_address.street}, ${
                  data.user_address.house
                } ${
                  data.user_address.flat
                    ? $t("content.apart_short") + data.user_address.flat
                    : ""
                }`
              }}
            </p>
            <p class="text-base font-medium" v-else>
              {{ data.equipment?.equipment?.user?.address }}
            </p>
          </div>
        </div>
        <UButton
          @click="emit('rent')"
          :ui="MainButtonConfig()"
          class="w-full flex justify-center mt-6"
        >
          {{
            data.equipment?.equipment?.type === "sale"
              ? $t("button.buy")
              : $t("button.rent")
          }}
        </UButton>
      </div>
    </UModal>
  </div>
</template>
