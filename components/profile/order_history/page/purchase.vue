<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { startLoading, stopLoading } = useLoader();
const router = useRouter();
const route = useRoute();
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
  await useFetchApi(
    route.query.type === "equipment"
      ? `users/delete-rental/${props.order?.id}`
      : `users/delete-purchase/${props.order?.id}`,
    {
      method: "DELETE",
      async onResponse({ request, response, options }) {
        stopLoading();
        router.push("/profile/history");
      },
    }
  );
};

const cancelOrderVisible = ref(false);
const setCancelOrderVisible = (val) => {
  cancelOrderVisible.value = val;
};
const cancelOrder = async () => {
  startLoading();
  await useFetchApi(
    route.query.type === "equipment"
      ? `users/cancel-rental/${props.order?.id}`
      : `users/cancel-purchase/${props.order?.id}`,
    {
      method: "POST",
      async onResponse({ request, response, options }) {
        stopLoading();
        emit("refresh");
      },
    }
  );
};
</script>

<template>
  <div class="rental-page bg-white max-w-xl">
    <div class="flex gap-3 justify-between">
      <p class="text-xl font-semibold">
        {{ $t("bread_crumb.order", { number: order.id }) }}
      </p>
      <p class="text-xl font-semibold">
        {{ dateToString(order.created_at?.split("T")[0]) }}
      </p>
      <p
        v-if="order.status === 'pending' || order.status === 'new'"
        class="text-xl font-semibold text-indigo"
      >
        {{ $t("fields.status.wait") }}
      </p>
      <p
        v-if="order.status === 'canceled'"
        class="text-xl font-semibold text-valencia"
      >
        {{ $t("fields.status.canceled") }}
      </p>
      <p
        v-else-if="order.status === 'delivered'"
        class="text-xl font-semibold text-japanese-laurel"
      >
        {{ $t("fields.status.delivered") }}
      </p>
    </div>
    <UButton
      v-if="
        (order.organisationEquipment?.is_feedback ||
          order.userProduct?.is_feedback) &&
        (order?.status === 'delivered' || order?.status === 'canceled')
      "
      :ui="TransparentButtonConfig()"
      class="text-black border border-japanese-laurel mt-3"
      @click="showReviewModal"
      >{{ $t("button.leave_review") }}</UButton
    >
    <BasketReviewCreateModal
      v-model="review_modal"
      :product="order.userProduct?.medicine"
      :url="
        $route.query.type === 'medicine'
          ? `medicines/feedback-medicine/${order.userProduct?.id}`
          : `equipments/feedback-equipment/${order.organisationEquipment?.id}`
      "
      @refresh="emit('refresh')"
    />

    <p class="text-base font-semibold mt-6">
      {{ $t("content.order_info") }}
    </p>
    <div class="flex justify-between mt-1">
      <p class="text-base font-normal text-heavy-metal text-opacity-80">
        {{ $t("content.sum_deliverless") }}
      </p>
      <p class="text-base font-medium">
        {{
          order?.type === "equipment"
            ? priceFormat(
                order.organisationEquipment?.promotion ??
                  order?.organisationEquipment?.price
              )
            : priceFormat(
                order.userProduct?.promotion ?? order?.userProduct?.price
              )
        }}
      </p>
    </div>
    <div class="flex justify-between mt-3">
      <p class="text-base font-normal text-heavy-metal text-opacity-80">
        {{ $t("content.delivery") }}
      </p>
      <p class="text-base font-medium">
        {{ priceFormat(order.delivery?.delivery_price) }}
      </p>
    </div>
    <div class="flex justify-between mt-3">
      <p class="text-base font-normal text-heavy-metal text-opacity-80">
        {{ $t("content.total") }}
      </p>
      <p class="text-base font-medium">
        {{ priceFormat(order.price) }}
      </p>
    </div>
    <!-- <div class="flex justify-between mt-3">
      <p class="text-base font-normal text-heavy-metal text-opacity-80">
        {{ $t("content.pay_method") }}
      </p>
      <p class="text-base font-medium">6918 **** **89</p>
    </div> -->

    <p class="text-base font-semibold mt-6">
      {{ $t("content.address_delivery_time") }}
    </p>
    <p class="text-base font-normal mt-1 text-heavy-metal text-opacity-80">
      {{
        order.delivery?.delivery_type === "pickup"
          ? $t("basket.self_pick_up") +
            " " +
            $t("content.to_date", { date: dateToString(order.delivery?.date) })
          : dateToString(order.delivery?.date)
      }}
    </p>
    <p
      v-if="
        order.delivery?.delivery_type === 'delivery' ||
        order.delivery?.delivery_type === 'express'
      "
      class="text-base font-normal text-heavy-metal text-opacity-80 mt-2"
    >
      {{
        `${$t("content.city_short")} ${
          order.delivery?.user_address?.city_id?.[
            locale === "ru" ? "name" : `name_${locale}`
          ]
        } ${$t("content.street_short")} ${
          order.delivery?.user_address?.street
        }, ${order.delivery?.user_address?.house} ${
          order.delivery?.user_address?.flat
            ? $t("content.apart_short") + order.delivery?.user_address?.flat
            : ""
        }`
      }}
    </p>
    <p
      v-else-if="order.delivery?.delivery_type === 'pickup'"
      class="text-base font-normal text-heavy-metal text-opacity-80 mt-2"
    >
      {{
        order.type === "medicine"
          ? order.userProduct?.user?.address
          : order?.organisationEquipment?.user?.address
      }}
    </p>
    <UButton
      v-if="
        order?.delivery?.status === 'pending' ||
        order?.delivery?.status === 'new' ||
        order?.delivery?.status === 'signed'
      "
      class="w-full bg-valencia-200 hover:bg-valencia-100 text-valencia mt-3"
      color="valencia"
      :ui="TransparentButtonConfig()"
      @click="setCancelOrderVisible(true)"
      >{{ $t("button.cancel_app") }}</UButton
    >
    <UButton
      v-if="
        order?.delivery?.status === 'canceled' ||
        order?.delivery?.status === 'completed' ||
        order?.delivery?.status === 'delivered'
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
