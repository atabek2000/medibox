<script setup>
import { z } from "zod";
import {
  TransparentButtonConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";

const cookie_jwt = useCookie("jwt");
const runtimeConfig = useRuntimeConfig();
const { startLoading, stopLoading } = useLoader();
const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const { data, refresh } = await useAsyncData(() =>
  $fetch(
    runtimeConfig.public.API_URL +
      `services/show-appointment/${route.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
);

const confirmOrderVisible = ref(false);
const setConfirmOrderVisible = (val) => {
  confirmOrderVisible.value = val;
};
const confirmOrder = async () => {
  startLoading();
  await useFetchApi(`entity/accept-request/${route.params.id}`, {
    method: "POST",
    async onResponse({ request, response, options }) {
      stopLoading();
      refresh();
    },
  });
};

const cancelOrderVisible = ref(false);
const cancelReasonsVisible = ref(false);

const setCancelOrderVisible = (val, id) => {
  cancelReasonsVisible.value = val;
};
const setCancelReason = async (id) => {
  cancelReasonsVisible.value = false;
  await useFetchApi(`entity/cancel-request/${route.params.id}`, {
    body: {
      refusal_reason_id: id,
    },
    method: "POST",
    async onResponse({ request, response, options }) {
      stopLoading();
      cancelOrderVisible.value = false;
      refresh();
    },
  });
};
const otherReason = () => {
  cancelReasonsVisible.value = false;
  cancelOrderVisible.value = true;
};
const cancelOrder = async (reason) => {
  startLoading();
  await useFetchApi(`entity/cancel-request/${route.params.id}`, {
    body: {
      other_reason: reason,
    },
    method: "POST",
    async onResponse({ request, response, options }) {
      stopLoading();
      cancelOrderVisible.value = false;
      refresh();
    },
  });
};

const deleteOrderVisible = ref(false);
const setDeleteOrderVisible = (val) => {
  deleteOrderVisible.value = val;
};
const deleteOrder = async () => {
  startLoading();
  await useFetchApi(`entity/delete-request/${route.params.id}`, {
    method: "DELETE",
    async onResponse({ request, response, options }) {
      stopLoading();
      router.push("/profile/application");
    },
  });
};
</script>

<template>
  <div class="product-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.applications'), to: '/profile/application' },
          {
            label: `${data?.data?.client?.first_name} ${data?.data?.client?.last_name}`,
          },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full md:w-1/2 2xl:w-1/3">
        <p
          class="text-xl font-bold"
          :class="{
            ' text-indigo':
              data?.data?.status === 'signed' ||
              data?.data?.status === 'accepted',
            ' text-valencia': data?.data?.status === 'canceled',
            ' text-japanese-laurel': data?.data?.status === 'completed',
          }"
        >
          {{
            $t(
              `fields.application_status.${data?.data?.status}${
                !data?.data?.canceled_user ||
                data?.data?.canceled_user?.role?.id === 4
                  ? ""
                  : data?.data?.canceled_user?.role?.id === 2
                  ? "_spec"
                  : "_client"
              }`
            )
          }}
        </p>
        <div class="flex gap-4 mt-6">
          <img
            class="w-20 h-20 object-cover rounded-full"
            :src="
              data?.data?.client?.avatar[0]
                ? data?.data?.client?.avatar[0]
                : '/common/avatar.png'
            "
            alt="avatar"
          />
          <div>
            <p class="text-base font-bold">
              {{
                `${data?.data?.client?.first_name} ${data?.data?.client?.last_name}`
              }}
            </p>
            <div class="flex gap-1 mt-2">
              <img src="~assets/svg/common/phone-green.svg" alt="" />
              <span class="font-normal text-sm">{{
                changePhoneMask("7" + data?.data?.client?.phone)
              }}</span>
            </div>
            <div class="flex gap-1 mt-2">
              <img src="~assets/svg/common/calendar-green.svg" alt="" />
              <span class="font-normal text-sm">{{
                `${dateToString(
                  data?.data?.created_at?.split("T")[0]
                )}, ${new Date(data?.data?.created_at)
                  .toLocaleString("sv-SE")
                  ?.split(" ")[1]
                  ?.split(":")
                  ?.splice(0, 2)
                  ?.join(":")}
                `
              }}</span>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-base font-semibold">
            {{ $t("content.type_service") }}
          </p>
          <p class="text-base font-normal text-heavy-metal-200 mt-1">
            {{
              data?.data?.organisation_service?.service?.[
                locale === "ru" ? "service_type" : `service_type_${locale}`
              ]
            }}
          </p>
          <p class="text-base font-medium mt-1">
            {{ priceFormat(data?.data?.organisation_service?.price) }}
          </p>
        </div>
        <div class="mt-4">
          <p class="text-base font-semibold">
            {{ $t("content.app_time_and_address") }}
          </p>
          <p class="text-base font-normal text-heavy-metal-200 mt-1">
            {{ dateToString(data?.data?.date) }},
            {{ data?.data?.service_time?.split(":")?.splice(0, 2)?.join(":") }}
          </p>
        </div>

        <UButton
          v-if="data?.data?.status === 'signed'"
          :ui="MainButtonConfig()"
          class="w-full flex justify-center mt-3"
          @click="setConfirmOrderVisible(true)"
          >{{ $t("button.confirm") }}</UButton
        >
        <UButton
          v-if="
            data?.data?.status === 'signed' || data?.data?.status === 'accepted'
          "
          class="w-full bg-valencia-200 hover:bg-valencia-100 text-valencia mt-3"
          color="valencia"
          :ui="TransparentButtonConfig()"
          @click="setCancelOrderVisible(true)"
          >{{ $t("button.cancel_app") }}</UButton
        >
        <UButton
          v-if="
            data?.data?.status === 'canceled' ||
            data?.data?.status === 'completed'
          "
          class="w-full bg-valencia-200 hover:bg-valencia-100 text-valencia mt-3"
          color="valencia"
          :ui="TransparentButtonConfig()"
          @click="setDeleteOrderVisible(true)"
          >{{ $t("button.delete") }}</UButton
        >
      </div>
    </div>
    <CommonUiModalConfirm
      v-model="confirmOrderVisible"
      :title="$t('modal.confirm')"
      :body="$t('modal.confirm_app')"
      @handleOk="confirmOrder"
    />
    <ProfileOrderCancelReasonsModal
      v-model="cancelReasonsVisible"
      @setReason="setCancelReason"
      @otherReason="otherReason"
      :type="'service'"
    />
    <ProfileOrderCancelReasonForm
      v-model="cancelOrderVisible"
      @setReason="cancelOrder"
    />

    <CommonUiModalConfirm
      v-model="deleteOrderVisible"
      :title="$t('modal.delete')"
      :body="$t('modal.delete_app')"
      @handleOk="deleteOrder"
    />
  </div>
</template>
