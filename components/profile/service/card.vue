<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { locale } = useI18n();
const props = defineProps({
  service: {
    type: Object,
    default: {},
  },
});
</script>
<template>
  <div class="service-card">
    <nuxt-link :to="`/profile/service/edit/${service.id}`">
      <div>
        <img
          :src="
            service.service?.photo?.length > 0
              ? service.service?.photo[0]
              : '/common/avatar.png'
          "
          alt="avatar"
          class="rounded-2xl object-cover w-full md:min-w-[200px] md:w-[200px] h-[200px] bg-seashell"
        />
        <p class="text-base font-semibold mt-3">
          {{
            service.service?.[
              locale === "ru" ? "service_type" : `service_type_${locale}`
            ]
          }}
        </p>
        <p class="text-pumice text-sm font-normal">
          {{ service.user.address }}
        </p>
        <div class="mt-2">
          <p
            v-if="service.promotion && service.is_promotion"
            class="text-base font-bold text-valencia"
          >
            {{ priceFormat(service.promotion) }}
            <span class="text-pumice text-base font-normal ms-2"
              ><del>{{ priceFormat(service.price) }}</del></span
            >
          </p>
          <p v-else class="text-base font-bold">
            {{ priceFormat(service.price) }}
          </p>
        </div>

        <UButton
          :ui="TransparentButtonConfig()"
          class="flex justify-center w-full mt-4"
          >{{ $t("button.edit") }}
          <img src="~assets/svg/common/edit-pen.svg" alt="" class="ms-2" />
        </UButton></div
    ></nuxt-link>
  </div>
</template>
