<script setup>
import {
  MainButtonConfig,
  WhiteButtonConfig,
} from "~/composables/ui/useConfig";
const { startLoading, stopLoading } = useLoader();
const isOpen = defineModel();
const props = defineProps({
  services: {
    type: Array,
    default: [],
  },
});
const { locale } = useI18n();

const emit = defineEmits(["showSuccessModal"]);
const closeModal = () => {
  // useFetchApi(`services/make-appointment`, {
  //   method: "POST",
  //   body: props.services.map((ss) => {
  //     return {
  //       id: ss.id,
  //       date: ss.date,
  //       service_time: ss.time,
  //       specialist_id: ss.specialist?.id ?? undefined,
  //       is_acquainted: 1,
  //     };
  //   }),
  //   onResponse() {
  //     stopLoading();
  //   },
  // });
  emit("showSuccessModal");
};
</script>
<template>
  <div class="appointment-confirm-modal">
    <UModal v-if="props.services.length > 0" v-model="isOpen">
      <div class="p-8">
        <div class="flex justify-end">
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="() => (isOpen = false)"
          >
            <img src="~assets/svg/common/close-modal.svg" alt=""
          /></UButton>
        </div>
        <div v-for="(service, index) in props.services" :key="service.id">
          <div class="flex gap-3">
            <img
              :src="
                service.photo && service.photo[0]
                  ? service.photo[0]
                  : '/common/avatar.png'
              "
              alt="avatar"
              class="w-1/5 rounded-md"
            />
            <div class="w-full">
              <p class="font-semibold text-sm">
                {{
                  service?.[
                    locale === "ru" ? "service_type" : `service_type_${locale}`
                  ]
                }}
              </p>
              <div
                v-if="
                  service?.[
                    locale === 'ru'
                      ? 'organisation_name'
                      : `organisation_name_${locale}`
                  ]
                "
                class="flex justify-between"
              >
                <p class="font-medium text-xs text-japanese-laurel">
                  {{ $t("modal.med_center") }}
                  {{
                    service?.[
                      locale === "ru"
                        ? "organisation_name"
                        : `organisation_name_${locale}`
                    ]
                  }}
                </p>
                <CommonUiRatingBlock :rating="service.rating ?? 5" />
              </div>
              <p class="font-semibold text-sm">{{ service.address }}</p>
            </div>
          </div>
          <p class="font-medium text-base mt-4">
            {{
              service?.[
                locale === "ru" ? "service_type" : `service_type_${locale}`
              ]
            }}
          </p>
          <p class="text-pumice font-semibold text-sm">
            {{ priceFormat(service.price) }}
          </p>
          <div class="flex justify-between mt-3">
            <div>
              <p class="font-normal text-sm text-pumice">
                {{ $t("modal.date") }}
              </p>
              <p class="font-medium text-base">{{ service.date }}</p>
            </div>
            <div>
              <p class="font-normal text-sm text-pumice">
                {{ $t("modal.time") }}
              </p>
              <p class="font-medium text-base">{{ service.time }}</p>
            </div>
            <div>
              <p class="font-normal text-sm text-pumice">
                {{ $t("modal.duration") }}
              </p>
              <p class="font-medium text-base">{{ service.duration }}</p>
            </div>
          </div>
          <UButton :ui="WhiteButtonConfig()" class="w-full mt-4">
            <img
              v-if="
                service.specialist && service.specialist?.avatar?.length > 0
              "
              :src="service.specialist?.avatar[0]"
              class="w-5 h-5 rounded-full"
              alt="avatar"
            />
            <img
              v-else
              src="~assets/svg/common/user-black.svg"
              alt=""
              class="w-5 h-5"
            />
            {{
              service.specialist
                ? `${service.specialist?.first_name} ${service.specialist?.last_name}`
                : $t("catalog.any_doctor")
            }}
          </UButton>
          <UDivider v-if="index !== services.length - 1" class="my-4" />
        </div>
        <UButton
          @click="closeModal"
          :ui="MainButtonConfig()"
          class="w-full flex justify-center mt-4"
          >{{ $t("button.confirm") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>
