<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { startLoading, stopLoading } = useLoader();
const router = useRouter();
const { locale } = useI18n();
const props = defineProps({
  order: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["refresh"]);

const review_modal = ref(false);
const showReviewModal = () => {
  review_modal.value = true;
};

const deleteOrderVisible = ref(false);
const setDeleteOrderVisible = (val) => {
  deleteOrderVisible.value = val;
};
const deleteOrder = async () => {
  startLoading();
  await useFetchApi(`users/delete-service/${props.order?.id}`, {
    method: "DELETE",
    async onResponse({ request, response, options }) {
      stopLoading();
      router.push("/profile/history");
    },
  });
};

const cancelOrderVisible = ref(false);
const setCancelOrderVisible = (val) => {
  cancelOrderVisible.value = val;
};
const cancelOrder = async () => {
  startLoading();
  await useFetchApi(`users/cancel-service/${props.order?.id}`, {
    method: "POST",
    async onResponse({ request, response, options }) {
      stopLoading();
      emit("refresh");
    },
  });
};
</script>

<template>
  <div class="rental-page bg-white max-w-xl">
    <div class="flex gap-3">
      <p class="text-xl font-semibold">
        {{ dateToString(order.created_at.split("T")[0]) }}
      </p>
      <p
        v-if="order.status === 'signed'"
        class="text-xl font-semibold text-indigo"
      >
        {{ $t("fields.status.wait") }}
      </p>
      <p
        v-if="order.status === 'accepted'"
        class="text-xl font-semibold text-indigo"
      >
        {{ $t("fields.status.accepted") }}
      </p>
      <p
        v-if="order.status === 'canceled'"
        class="text-xl font-semibold text-valencia"
      >
        {{ $t("fields.status.canceled") }}
      </p>
      <p
        v-if="order.status === 'completed'"
        class="text-xl font-semibold text-japanese-laurel"
      >
        {{ $t("fields.status.service_done") }}
      </p>
    </div>

    <UButton
      v-if="
        order.organisation_service?.is_feedback &&
        (order?.status === 'completed' || order?.status === 'canceled')
      "
      :ui="TransparentButtonConfig()"
      class="text-black border border-japanese-laurel mt-3"
      @click="showReviewModal"
      >{{ $t("button.leave_review") }}</UButton
    >
    <BasketReviewCreateModal
      v-model="review_modal"
      :product="order.userProduct?.medicine"
      :url="`services/feedback-service/${order.organisation_service?.id}`"
      @refresh="emit('refresh')"
    />

    <p class="text-base font-semibold mt-6">
      {{ $t("content.type_service") }}
    </p>
    <div class="flex justify-between mt-1">
      <p class="text-base font-normal text-heavy-metal text-opacity-80">
        {{
          order.organisation_service?.service?.[
            locale === "ru" ? "service_type" : `service_type_${locale}`
          ]
        }}
      </p>
      <p class="text-base font-medium">
        {{
          priceFormat(
            order.organisation_service?.promotion ??
              order.organisation_service?.price
          )
        }}
      </p>
    </div>

    <p class="text-base font-semibold mt-6">
      {{ $t("content.app_time_and_address") }}
    </p>
    <p class="text-base font-normal mt-1 text-heavy-metal text-opacity-80">
      {{ dateToString(order.date) }},
      {{ order.service_time?.split(":")?.slice(0, 2)?.join(":") }}
    </p>
    <p class="text-base font-normal mt-3 text-heavy-metal text-opacity-80">
      {{
        order.organisation_service?.user?.city?.[
          locale === "ru" ? "name" : `name_${locale}`
        ]
      }},
      {{ order.organisation_service?.user?.address }}
    </p>

    <UButton
      v-if="
        order?.status === 'pending' ||
        order?.status === 'new' ||
        order?.status === 'accepted' ||
        order?.status === 'signed'
      "
      class="w-full bg-valencia-200 hover:bg-valencia-100 text-valencia mt-3"
      color="valencia"
      :ui="TransparentButtonConfig()"
      @click="setCancelOrderVisible(true)"
      >{{ $t("button.cancel_app") }}</UButton
    >
    <UButton
      v-if="
        order?.status === 'canceled' ||
        order?.status === 'completed' ||
        order?.status === 'delivered'
      "
      class="w-full bg-valencia-200 hover:bg-valencia-100 text-valencia mt-3"
      color="valencia"
      :ui="TransparentButtonConfig()"
      @click="setDeleteOrderVisible(true)"
      >{{ $t("button.delete") }}</UButton
    >
    <CommonUiModalConfirm
      v-model="deleteOrderVisible"
      :title="$t('modal.delete')"
      :body="$t('modal.delete_app')"
      @handleOk="deleteOrder"
    />
    <CommonUiModalConfirm
      v-model="cancelOrderVisible"
      :title="$t('modal.cancel')"
      :body="$t('modal.cancel_order')"
      @handleOk="cancelOrder"
    />
  </div>
</template>
