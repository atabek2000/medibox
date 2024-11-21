<script setup>
import { MainCheckboxConfig } from "~/composables/ui/useConfig";
const cookie_jwt = useCookie("jwt");
const cookie_user = useCookie("user");
const { fetchBasketCount } = useDict();
const { startLoading, stopLoading } = useLoader();
const active_basket = ref();
const selected_medicines = ref([]);
const setActiveBasket = (id) => {
  active_basket.value = id;
};
const postomat_addresses = ref([]);
const runtimeConfig = useRuntimeConfig();
const delivery_price = ref(0);
const { t, locale } = useI18n();
useHead({
  title: t("bread_crumb.basket"),
});
const { data, refresh } = await useAsyncData(() =>
  $fetch(runtimeConfig.public.API_URL + `basket/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
    async onResponse({ response }) {
      if (response.ok) {
        // setActiveBasket(response._data.data[0]?.id);
      }
    },
  })
);

const { data: user_addresses, refresh: refresh_addresses } = await useAsyncData(
  () =>
    $fetch(runtimeConfig.public.API_URL + `auth/user-address/`, {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    })
);

const selected_method = ref("postomat");
const selected_address = ref(undefined);
const selected_all = ref(false);
const deleteConfirmVisible = ref(false);
const isThanksOpen = ref(false);
const isShowReviewOpen = ref(false);
const isCreateReviewOpen = ref(false);
const payment_key = ref();

const delivery_methods = ref([
  { value: "postomat", label: "Postomat" },
  { value: "delivery", label: t("basket.delivery") },
  { value: "express", label: "Express" },
  { value: "pickup", label: t("basket.self_pick_up") },
]);

// кнопка оплатить
const pay = async (type = "payment") => {
  // если не выбрал товара
  if (selected_medicines.value.length === 0) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.select_product"),
    });
    return;
  }
  for (const sm of selected_medicines.value) {
    if (!sm.delivery_type) {
      // если не выбрал способ доставки
      useToast().add({
        title: t("toast.error"),
        color: "red",
        description: t("toast.select_delivery_method"),
      });
      return;
    } else if (!sm.user_address_id && !sm.postomat_address) {
      // если не выбрал адрес
      useToast().add({
        title: t("toast.error"),
        color: "red",
        description: t("toast.select_address"),
      });
      return;
    }
  }
  startLoading();
  await useFetchApi(`payment/send-request?type=${type}`, {
    method: "POST",
    body: {
      basket: selected_medicines.value,
    },
    async onResponse({ response }) {
      stopLoading();
      fetchBasketCount();
      payment_key.value = response._data?.data?.payment_key;
      refresh();
      if (type === "payment" && response._data?.data?.data?.redirect_url) {
        window.location = response._data?.data?.data?.redirect_url;
      }
      isThanksOpen.value = true;
      selected_medicines.value = [];
    },
  });
};

const create_invoice = async () => {
  await pay("generate");
  if (payment_key.value) {
    useFetchApi(`payment/payment-pdf/${payment_key.value}`, {
      onResponse({ response }) {
        if (response.ok) {
          window.location = response?._data?.data?.path;
        }
      },
    });
  } else
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.error_on_server"),
    });
};

const showCreateModal = () => {
  isShowReviewOpen.value = false;
  isCreateReviewOpen.value = true;
};

// при выборе всех товаров
const onSelectAll = (checked) => {
  if (checked) {
    selected_medicines.value = data.value?.data.map((md) => {
      return {
        id: md.id,
        delivery_type: undefined,
        user_address_id: undefined,
        postomat_address: undefined,
        count: 1,
        price: Number(
          md.basket.is_promotion ? md.basket.promotion : md.basket.price
        ),
      };
    });
  } else {
    selected_medicines.value = [];
  }
};

// при выборе товара
const onSelectOne = async (id) => {
  if (selected_medicines.value.filter((sm) => sm.id === id).length > 0) {
    selected_medicines.value = selected_medicines.value.filter(
      (sm) => sm.id !== id
    );
  } else {
    selected_medicines.value.push({
      id: id,
      delivery_type: undefined,
      user_address_id: undefined,
      postomat_address: undefined,
      count: 1,
      price: Number(
        data.value.data.filter((md) => md.id === id)[0]?.basket?.is_promotion
          ? data.value.data.filter((md) => md.id === id)[0]?.basket?.promotion
          : data.value.data.filter((md) => md.id === id)[0]?.basket?.price
      ),
    });
  }

  if (selected_medicines.value.length === data.value?.data.length) {
    selected_all.value = true;
  } else {
    selected_all.value = false;
  }

  await getDeliveryPrice();
};

const getDeliveryPrice = async () => {
  const medicines = selected_medicines.value.filter(
    (sm) =>
      (sm.delivery_type === "delivery" ||
        sm.delivery_type === "express" ||
        sm.delivery_type === "postomat") &&
      (sm.user_address_id || sm.postomat_address)
  );
  if (medicines.length > 0) {
    startLoading();
    await useFetchApi(`delivery/tariffs`, {
      method: "POST",
      body: { basket: medicines },
      async onResponse({ request, response, options }) {
        selected_medicines.value = selected_medicines.value.map((sm) => {
          return {
            ...sm,
            delivery_price: Number(
              response._data?.data?.items?.find((dp) => dp.basket_id === sm.id)
                ?.item_amount
            ),
          };
        });
        if (response.ok) delivery_price.value = response._data?.data?.Amount;
        stopLoading();
      },
    });
  } else {
    delivery_price.value = 0;
  }
};

// разрешение на удаление
const deleteConfirmSelected = () => {
  if (selected_medicines.value.length > 0) {
    deleteConfirmVisible.value = true;
  } else {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.product_not_selected"),
    });
  }
};

// удалить выбранные товары
const deleteSelectedMedicines = async () => {
  if (selected_medicines.value.length > 0) {
    for (const selected_medicine of selected_medicines.value) {
      startLoading();
      await useFetchApi(`basket/put-away/${selected_medicine.id}`, {
        method: "DELETE",
        async onResponse({ request, response, options }) {
          stopLoading();
        },
      });
    }
    selected_medicines.value = [];
    await refresh();
    await fetchBasketCount();
  }
};

// изменить способ доставки и адрес
const onChangeMethod = async (payload) => {
  selected_medicines.value = selected_medicines.value.map((sm) => {
    if (sm.id === payload.id) {
      sm.delivery_type = payload.method;
      if (["delivery", "express"].includes(payload.method)) {
        // доставка и экспресс
        sm.user_address_id = payload.address;
        sm.postomat_address = undefined;
      } else {
        sm.user_address_id = undefined;
        sm.postomat_address = payload.address;
        sm.local_code = payload.local_code;
      }
    }
    return sm;
  });
  await getDeliveryPrice();
};

const onChangeCount = (payload) => {
  selected_medicines.value = selected_medicines.value.map((sm) => {
    if (sm.id === payload.id) {
      sm.count = payload.count;
    }
    return sm;
  });
};

onMounted(async () => {
  $fetch(runtimeConfig.public.API_URL + `delivery/postomats/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
    async onResponse({ response }) {
      if (response.ok) {
        postomat_addresses.value = response._data?.data;
      }
    },
  });
});
</script>

<template>
  <div class="basket-page main-container bg-wild-sand-300 pt-10 pb-16">
    <CommonUiBreadCrumb
      class=""
      :links="[
        { label: $t('bread_crumb.main'), to: '/' },
        { label: $t('bread_crumb.basket') },
      ]"
    />

    <div
      v-if="data?.data?.length > 0"
      class="basket-block flex flex-wrap md:flex-nowrap gap-6 mt-8"
    >
      <div class="w-full md:w-3/5">
        <div class="flex justify-between items-center">
          <UCheckbox
            :label="$t('basket.select_all')"
            :ui="MainCheckboxConfig()"
            v-model="selected_all"
            @change="onSelectAll"
          />
          <UButton
            class="text-sm font-normal"
            variant="link"
            @click="deleteConfirmSelected"
            >{{ $t("basket.delete_selected") }}</UButton
          >
        </div>
        <div class="products-block bg-white rounded-xl mt-4 overflow-hidden">
          <BasketProductCard
            v-for="basket in data?.data"
            :key="basket.id"
            :product="basket"
            :selected="
              !!selected_medicines.filter((sm) => sm.id === basket.id).length
            "
            :active="active_basket === basket.id"
            :delivery_method="
              selected_medicines.filter((sm) => sm.id === basket.id)[0]
                ?.user_address_id ??
              selected_medicines.filter((sm) => sm.id === basket.id)[0]
                ?.postomat_address
            "
            @onSelectOne="onSelectOne"
            @onChangeCount="onChangeCount"
            @click="setActiveBasket(basket.id)"
          />
        </div>
      </div>
      <div class="w-full md:w-2/5">
        <DeliveryMethods
          v-for="basket in data?.data"
          :key="basket.id"
          :delivery_methods="delivery_methods"
          :addresses="postomat_addresses"
          :organization_address="`${$t('content.city_short')} ${
            basket.basket?.user?.city?.[
              locale === 'ru' ? 'name' : `name_${locale}`
            ]
          }, ${basket.basket?.user?.address}
          `"
          :user_addresses="user_addresses.data"
          :id="basket.id"
          @refresh_addresses="refresh_addresses"
          @onChangeMethod="onChangeMethod"
          :class="active_basket === basket.id ? '' : ' hidden'"
        />
        <PaymentMethods
          v-if="[3, 4].includes(cookie_user?.role_id)"
          class="mt-6"
          @create_invoice="create_invoice"
        />
        <TotalPrice
          class="mt-6"
          @pay="pay"
          :products="selected_medicines"
          :delivery="delivery_price"
        />

        <BasketReviewShowModal
          v-model="isShowReviewOpen"
          :product="data.data[0]"
          @showCreateModal="showCreateModal"
        />
        <BasketReviewCreateModal
          v-model="isCreateReviewOpen"
          :product="data.data[0]"
        />
      </div>
    </div>
    <div v-else>
      <BasketNotfound />
    </div>
    <BasketThanksModal v-model="isThanksOpen" />
    <CommonUiModalConfirm
      v-model="deleteConfirmVisible"
      :title="$t('modal.delete')"
      :body="$t('modal.delete_product')"
      @handleOk="deleteSelectedMedicines"
    />
  </div>
</template>

<style scoped>
.basket-product-card + .basket-product-card {
  border-top: 1px solid #f7f7f7;
}
</style>
