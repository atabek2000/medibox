<script setup>
import {
  TransparentButtonConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const { useDicts } = useDict();
const cancel_reasons = ref([]);
const { startLoading, stopLoading } = useLoader();
const emit = defineEmits(["refresh"]);
const productId = ref(0);
const cookie_user = useCookie("user");
const { locale } = useI18n();
const manifest_url = ref("");

const props = defineProps({
  order: {
    type: Object,
    default: {},
  },
});

const router = useRouter();

const confirmOrderVisible = ref(false);
const setConfirmOrderVisible = (val, id) => {
  confirmOrderVisible.value = val;
  productId.value = id;
};
const confirmOrder = async () => {
  startLoading();
  await useFetchApi(`entity/accept/equipment-request/${productId.value}`, {
    method: "POST",
    async onResponse({ request, response, options }) {
      stopLoading();
      emit("refresh");
    },
  });
};

const cancelOrderVisible = ref(false);
const cancelReasonsVisible = ref(false);

const setCancelOrderVisible = (val, id) => {
  cancelReasonsVisible.value = val;
  productId.value = id;
};
const setCancelReason = async (id) => {
  cancelReasonsVisible.value = false;
  await useFetchApi(`entity/cancel/equipment-request/${productId.value}`, {
    body: {
      refusal_reason_id: id,
    },
    method: "POST",
    async onResponse({ request, response, options }) {
      stopLoading();
      cancelOrderVisible.value = false;
      emit("refresh");
    },
  });
};
const otherReason = () => {
  cancelReasonsVisible.value = false;
  cancelOrderVisible.value = true;
};
const cancelOrder = async (reason) => {
  startLoading();
  await useFetchApi(`entity/cancel/equipment-request/${productId.value}`, {
    body: {
      other_reason: reason,
    },
    method: "POST",
    async onResponse({ request, response, options }) {
      stopLoading();
      cancelOrderVisible.value = false;
      emit("refresh");
    },
  });
};

const deleteOrderVisible = ref(false);
const setDeleteOrderVisible = (val, id) => {
  productId.value = id;
  deleteOrderVisible.value = val;
};
const deleteOrder = async () => {
  startLoading();
  await useFetchApi(`entity/delete/equipment-request/${productId.value}`, {
    method: "DELETE",
    async onResponse({ request, response, options }) {
      stopLoading();
      router.push("/profile/order");
    },
  });
};

onMounted(async () => {
  cancel_reasons.value = useDicts().value;

  if (props.order?.moderatorPayment?.manifest_id)
    await useFetchApi(
      `delivery/manifest/${props.order?.moderatorPayment?.manifest_id}`,
      {
        async onResponse({ request, response, options }) {
          manifest_url.value = response._data?.data?.path;
        },
      }
    );
});
</script>

<template>
  <div class="w-full flex gap-8 flex-wrap md:flex-nowrap">
    <div class="w-full md:w-1/2 2xl:w-1/3">
      <p
        class="text-xl font-bold"
        :class="{
          ' text-indigo':
            order.delivery?.status === 'pending' ||
            order.delivery?.status === 'new',
          ' text-valencia': order.delivery?.status === 'canceled',
          ' text-japanese-laurel': order.delivery?.status === 'delivered',
        }"
      >
        {{
          order.delivery?.status === "canceled" &&
          order?.canceled_user?.id &&
          order?.canceled_user?.id !== cookie_user.id
            ? $t(`fields.order_status.canceled_client`)
            : $t(`fields.order_status.${order.delivery?.status}`)
        }}
      </p>
      <div class="flex gap-4 mt-6">
        <img
          class="w-20 h-20 object-cover rounded-full"
          :src="
            order.moderatorPayment?.user?.avatar[0]
              ? order.moderatorPayment?.user?.avatar[0]
              : '/common/avatar.png'
          "
          alt="avatar"
        />
        <div>
          <p class="text-base font-bold">
            {{
              order.moderatorPayment?.user?.first_name
                ? `${order.moderatorPayment?.user?.first_name} ${order.moderatorPayment?.user?.last_name}`
                : order.moderatorPayment?.user?.contact_person
            }}
          </p>
          <div class="flex gap-1 mt-2">
            <img src="~assets/svg/common/phone-green.svg" alt="" />
            <span class="font-normal text-sm">{{
              changePhoneMask("7" + order.moderatorPayment?.user?.phone)
            }}</span>
          </div>
          <div class="flex gap-1 mt-2">
            <img src="~assets/svg/common/calendar-green.svg" alt="" />
            <span class="font-normal text-sm">
              {{
                order.organisationEquipment?.type === "rent"
                  ? $t("content.rental_period") +
                    " " +
                    dateToString(order.start_date) +
                    " - " +
                    dateToString(order.end_date)
                  : dateToString(order.created_at?.split("T")[0]) +
                    ", " +
                    new Date(order.created_at)
                      ?.toLocaleTimeString("sv-SE")
                      ?.split(":")
                      ?.splice(0, 2)
                      ?.join(":")
              }}</span
            >
          </div>
        </div>
      </div>
      <nuxt-link
        :to="`/equipment/${order.organisationEquipment?.equipment?.id}`"
        class="border border-wild-sand-600 rounded-xl p-4 mb-6 flex gap-3 mt-6"
      >
        <img
          class="w-24 h-20 object-cover"
          :src="
            order?.organisationEquipment?.equipment?.photo[0] ??
            '/common/avatar.png'
          "
          alt="product"
        />
        <div>
          <p class="text-sm font-semibold">
            {{
              order?.organisationEquipment?.equipment?.[
                locale === "ru" ? "name" : `name_${locale}`
              ]
            }}
          </p>
          <p class="text-japanese-laurel text-xs font-medium">
            {{
              $t("content.from", {
                seller:
                  order.organisationEquipment?.user?.[
                    locale === "ru"
                      ? "organisation_name"
                      : `organisation_name_${locale}`
                  ],
              })
            }}
          </p>
          <p class="mt-3 text-base font-medium">
            {{ priceFormat(order.delivery?.price) }}
          </p>
        </div>
      </nuxt-link>
      <div class="mt-4">
        <p class="text-base font-semibold">
          {{ $t("content.order_info") }}
        </p>
        <div class="flex justify-between">
          <p class="text-base font-normal text-heavy-metal-200">
            {{ $t("content.sum_deliverless") }}
          </p>
          <p class="text-base font-medium">
            {{ priceFormat(order.delivery?.price) }}
          </p>
        </div>
        <div class="flex justify-between">
          <p class="text-base font-normal text-heavy-metal-200">
            {{ $t("content.delivery") }}
          </p>
          <p class="text-base font-medium">
            {{ priceFormat(order.delivery?.delivery_price) }}
          </p>
        </div>
        <div class="flex justify-between">
          <p class="text-base font-normal text-heavy-metal-200">
            {{ $t("content.total") }}
          </p>
          <p class="text-base font-medium">
            {{
              priceFormat(
                Number(order.delivery?.price) +
                  Number(order.delivery?.delivery_price)
              )
            }}
          </p>
        </div>
        <!-- <div class="flex justify-between">
          <p class="text-base font-normal text-heavy-metal-200">
            {{ $t("content.pay_method") }}
          </p>
          <p class="text-base font-medium">
            {{ priceFormat(order.delivery?.price) }}
          </p>
        </div> -->
      </div>
      <div class="mt-6 mb-4">
        <p class="text-base font-semibold">
          {{ $t("content.address_delivery_time") }}
        </p>
        <p class="text-base font-normal text-heavy-metal-200">
          {{
            order.delivery?.delivery_type === "pickup"
              ? $t("basket.self_pick_up") +
                " " +
                $t("content.to_date", {
                  date: dateToString(order.delivery?.date),
                })
              : dateToString(order.delivery?.date)
          }}
        </p>
        <p class="text-base font-normal text-heavy-metal-200">
          {{
            order.delivery?.delivery_type === "pickup"
              ? order.organisationEquipment?.user?.address
              : order.moderatorPayment?.user?.address
          }}
        </p>
      </div>
      <div>
        <UButton
          v-if="order.status === 'new'"
          :ui="MainButtonConfig()"
          class="w-full flex justify-center mt-3"
          @click="setConfirmOrderVisible(true, order.id)"
          >{{ $t("button.confirm") }}</UButton
        >
        <UButton
          v-if="order?.status === 'new' || order?.status === 'pending'"
          class="w-full bg-valencia-200 hover:bg-valencia-100 text-valencia mt-3"
          color="valencia"
          :ui="TransparentButtonConfig()"
          @click="setCancelOrderVisible(true, order.id)"
          >{{ $t("button.cancel_order") }}</UButton
        >
        <UButton
          v-if="order?.status === 'delivered' || order?.status === 'canceled'"
          class="w-full bg-valencia-200 hover:bg-valencia-100 text-valencia mt-3"
          color="valencia"
          :ui="TransparentButtonConfig()"
          @click="setDeleteOrderVisible(true, order.id)"
          >{{ $t("button.delete_from_list") }}</UButton
        >
      </div>

      <CommonUiModalConfirm
        v-model="confirmOrderVisible"
        :title="$t('modal.confirm')"
        :body="$t('modal.confirm_order')"
        @handleOk="confirmOrder"
      />

      <ProfileOrderCancelReasonsModal
        v-model="cancelReasonsVisible"
        @setReason="setCancelReason"
        @otherReason="otherReason"
        :type="'equipment'"
      />
      <ProfileOrderCancelReasonForm
        v-model="cancelOrderVisible"
        @setReason="cancelOrder"
      />
      <CommonUiModalConfirm
        v-model="deleteOrderVisible"
        :title="$t('modal.delete')"
        :body="$t('modal.delete_order')"
        @handleOk="deleteOrder"
      />
    </div>
    <div
      class="w-full md:w-1/2 2xl:w-1/3"
      v-if="manifest_url !== '' && order?.moderatorPayment?.manifest_id"
    >
      <div class="p-3 bg-wild-sand w-fit h-fit rounded-xl">
        <div class="flex justify-between mb-4">
          <p class="text-base font-semibold">{{ $t("content.invoice") }}</p>
          <UButton
            variant="link"
            color="japanese-laurel"
            class="p-0 ms-2"
            target="_blank"
            :to="manifest_url"
          >
            <span>{{ $t("content.download") }}</span>
            <UIcon name="i-heroicons-arrow-down-tray-20-solid" />
          </UButton>
        </div>
        <PdfViewer :url="manifest_url" />
      </div>
    </div>
  </div>
</template>
