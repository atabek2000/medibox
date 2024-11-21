<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";
import { z } from "zod";
import {
  MainCheckboxConfig,
  MainFormGroupConfig,
} from "~/composables/ui/useConfig";
const cookie_jwt = useCookie("jwt");
const cookie_user = useCookie("user");
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const { startLoading, stopLoading } = useLoader();
if (!cookie_jwt.value) router.push("/");
const form = ref();
const calendarKey = ref(0);
const runtimeConfig = useRuntimeConfig();
const total_arr = ref([
  {
    delivery_type: undefined,
    price: 0,
    count: 1,
  },
]);

const date_disabled = ref([]);
const date_attrs = ref([]);
const delivery_price = ref(0);

const { data, refresh } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `equipments/show-equipment/${route.params.id}/`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      onResponse({ response }) {
        if (response.ok) {
          total_arr.value[0].price = Number(
            response._data?.data?.equipment?.price
          );
          if (
            response._data?.data?.rents &&
            response._data?.data?.rents?.length > 0
          ) {
            date_disabled.value = response._data?.data?.rents.map(
              (rts, index) => {
                return {
                  start: new Date(rts.start_date),
                  end: new Date(rts.end_date),
                };
              }
            );

            date_attrs.value = response._data?.data?.rents.map((rts, index) => {
              return {
                key: `disabled-date-range-${index + 1}`,
                highlight: { color: "red", fillMode: "light" },
                popover: {
                  label: t("content.not_available"),
                },
                dates: {
                  start: new Date(rts.start_date),
                  end: new Date(rts.end_date),
                },
              };
            });
          }
        }
      },
    }
  )
);

const { data: user_addresses, refresh: refresh_addresses } = await useAsyncData(
  () =>
    $fetch(useRuntimeConfig().public.API_URL + `auth/user-address/`, {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    })
);

const state = reactive({
  is_acquainted: false,
});
const schema = z.object({
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

const delivery_methods = ref([
  { value: "delivery", label: t("basket.delivery") },
  { value: "express", label: t("basket.express") },
  { value: "pickup", label: t("basket.self_pick_up") },
]);

const addresses = ref([]);

const rentModalVisible = ref(false);
const succesModalVisisble = ref(false);
const range = ref({
  start: undefined,
  end: undefined,
});

const user_address_id = ref(undefined);
const delivery_type = ref(undefined);
const payment_key = ref();

// изменить способ доставки и адрес
const onChangeMethod = async (payload) => {
  delivery_type.value = payload.method;
  total_arr.value[0].delivery_type = payload.method;
  if (["delivery", "express"].includes(payload.method)) {
    // доставка и экспресс
    user_address_id.value = payload.address;
  } else {
    user_address_id.value = undefined;
  }

  await getDeliveryPrice();
};

const getDeliveryPrice = async () => {
  if (
    (delivery_type.value === "delivery" || delivery_type.value === "express") &&
    user_address_id.value
  ) {
    startLoading();
    await useFetchApi(`delivery/equipment/tariffs/${route.params.id}`, {
      method: "POST",
      body: { delivery_type: delivery_type.value },
      async onResponse({ request, response, options }) {
        if (response.ok) delivery_price.value = response._data?.data?.Amount;
      },
    });
    stopLoading();
  } else {
    delivery_price.value = 0;
  }
};

const pay_data = reactive({
  equipment: {},
  range: {},
  delivery_price: delivery_price.value,
  user_address: undefined,
});

const pay = async () => {
  await form.value.submit();
  if (form.value.errors.length) return;
  rentModalVisible.value = true;
  pay_data.equipment = data.value.data;
  pay_data.range = range.value;
  pay_data.user_address = user_address_id.value
    ? user_addresses.value.data?.filter(
        (ua) => ua.id === user_address_id.value
      )?.[0]
    : undefined;
  pay_data.delivery_price = delivery_price.value;
};

const rent = async (type = "payment") => {
  if (
    !delivery_type.value ||
    ((delivery_type.value === "delivery" ||
      delivery_type.value === "express") &&
      !user_address_id)
  ) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("content.select_delivery"),
    });
    return;
  }
  if (
    (!range.value.start || !range.value.end) &&
    data?.data?.equipment?.type === "rent"
  ) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("content.select_period"),
    });
    return;
  }
  startLoading();
  const req_body = {
    start_date:
      data.value.data?.equipment?.type === "rent"
        ? range.value.start?.toLocaleDateString("sv-SE")
        : undefined,
    end_date:
      data.value?.data?.equipment?.type === "rent"
        ? range.value?.end?.toLocaleDateString("sv-SE")
        : undefined,
    delivery_type: delivery_type.value,
    price: data.value.data?.equipment?.is_promotion
      ? data.value.data?.equipment?.promotion
      : data.value.data?.equipment?.price,
    delivery_price: delivery_price.value,
    user_address_id: user_address_id.value,
    is_acquainted: Number(state.is_acquainted),
  };
  await useFetchApi(
    `payment/send/equipment-request/${route.params.id}?type=${type}`,
    {
      method: "POST",
      body: req_body,
      async onResponse({ request, response, options }) {
        stopLoading();
        if (response.ok) {
          payment_key.value = response._data?.data?.payment_key;

          if (type === "payment" && response._data?.data?.data?.redirect_url) {
            window.location = response._data?.data?.data?.redirect_url;
            // router.push(`/equipment/${route.params.id}`);
            rentModalVisible.value = false;
            succesModalVisisble.value = true;
          }
        }
      },
    }
  );
};

const create_invoice = async () => {
  await form.value.submit();
  if (form.value.errors.length) return;
  await rent("generate");
  if (payment_key.value)
    useFetchApi(`payment/payment-pdf/${payment_key.value}`, {
      onResponse({ response }) {
        if (response.ok) {
          window.location = response?._data?.data?.path;
          rentModalVisible.value = false;
          succesModalVisisble.value = true;
          // router.push(`/equipment/${route.params.id}`);
        }
      },
    });
  else
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.error_on_server"),
    });
};

const onSelectDate = (rng) => {
  if (
    rng.start &&
    rng.end &&
    data?.value?.data?.equipment?.duration === "daily"
  ) {
    const start = new Date(rng.start);
    const end = new Date(rng.end);

    const differenceInMs = end.getTime() - start.getTime();

    const daysCount = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
    total_arr.value[0].count = daysCount;
  }
};

function addOneMonth(date) {
  const nextMonthDate = new Date(date);
  nextMonthDate.setMonth(date.getMonth() + 1);
  if (nextMonthDate.getDate() !== date.getDate()) {
    nextMonthDate.setDate(0); // Устанавливаем последний день предыдущего месяца
  }
  return nextMonthDate;
}

const onDayclick = (day, e) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (
    day.date >= today &&
    data?.value?.data?.equipment?.duration === "monthly"
  ) {
    range.value.start = day.date;
    const nextMonthDate = addOneMonth(new Date(range.value.start));
    range.value.end = nextMonthDate;
    calendarKey.value++;
  }
};

onMounted(() => {
  total_arr.value[0].price = Number(data.value?.data?.equipment?.price);
  if (data.value?.data?.rents && data.value?.data?.rents?.length > 0) {
    date_disabled.value = data.value?.data?.rents.map((rts, index) => {
      return {
        start: new Date(rts.start_date),
        end: new Date(rts.end_date),
      };
    });

    date_attrs.value = data.value?.data?.rents.map((rts, index) => {
      return {
        key: `disabled-date-range-${index + 1}`,
        highlight: { color: "red", fillMode: "light" },
        popover: {
          label: t("content.not_available"),
        },
        dates: {
          start: new Date(rts.start_date),
          end: new Date(rts.end_date),
        },
      };
    });
  }
});
</script>

<template>
  <div class="rent-page main-container pb-16 pt-10 bg-wild-sand-300">
    <CommonUiBreadCrumb
      :links="[
        { label: $t('bread_crumb.main'), to: '/' },
        { label: $t('bread_crumb.equipment'), to: '/equipment' },
        {
          label:
            data?.data?.equipment?.equipment?.[
              locale === 'ru' ? 'name' : `name_${locale}`
            ],
          to: `/equipment/${$route.params.id}`,
        },
        { label: $t('bread_crumb.rent') },
      ]"
    />
    <div class="flex flex-wrap md:flex-nowrap gap-6 mt-8">
      <div class="w-full md:w-3/5">
        <div class="flex gap-4 p-4 bg-white rounded-2xl">
          <div class="w-2/5">
            <img
              :src="
                data?.data?.equipment?.equipment?.photo &&
                data?.data?.equipment?.equipment?.photo[0]
                  ? data?.data?.equipment?.equipment?.photo[0]
                  : '/common/avatar.png'
              "
              alt="avatar"
              class="rounded-2xl w-full max-h-[200px] object-cover"
            />
          </div>
          <div class="w-3/5 flex justify-between">
            <div>
              <p class="text-base font-semibold">
                {{
                  data?.data?.equipment?.equipment?.[
                    locale === "ru" ? "name" : `name_${locale}`
                  ]
                }}
              </p>
              <p class="text-sm font-normal text-japanese-laurel">
                {{
                  $t("content.from", {
                    seller: [3, 4].includes(
                      data?.data?.equipment?.user?.role?.id
                    )
                      ? data?.data?.equipment?.user?.[
                          locale === "ru"
                            ? "organisation_name"
                            : `organisation_name_${locale}`
                        ]
                      : `${data?.data?.equipment?.user?.first_name} ${data?.data?.equipment?.user?.last_name}`,
                  })
                }}
              </p>
              <p class="font-bold text-xl mt-4">
                {{ priceFormat(data?.data?.equipment?.price) }}
              </p>
            </div>
            <p class="text-xs text-valencia">
              {{
                !delivery_type ||
                ((delivery_type === "delivery" ||
                  delivery_type === "express") &&
                  !user_address_id)
                  ? $t("content.select_delivery")
                  : ""
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="w-full md:w-2/5">
        <div
          v-if="
            data?.data?.equipment?.type === 'rent' &&
            data?.data?.equipment?.duration !== 'long_term'
          "
          class="mb-6"
        >
          <p class="text-xl font-semibold">{{ $t("content.period") }}</p>
          <p class="mt-1 text-base font-normal">
            {{ $t("content.select_period")
            }}<span class="text-valencia">*</span>
          </p>
          <p
            v-if="data?.data?.equipment?.duration === 'monthly' && range.end"
            class="mt-1 text-sm font-normal text-valencia"
          >
            {{ $t("content.equipment_monthly_desc") }}
          </p>
          <DatePicker
            :key="calendarKey"
            expanded
            class="v-calendar-appointment mt-3"
            v-model.range="range"
            color="emerald"
            mode="range"
            rows="2"
            :min-date="new Date()"
            :disabled-dates="date_disabled"
            :attributes="date_attrs"
            @update:model-value="onSelectDate"
            @dayclick="onDayclick"
          />
        </div>
        <DeliveryMethods
          :id="parseInt(route.params.id)"
          :delivery_methods="delivery_methods"
          :addresses="addresses"
          :user_addresses="user_addresses.data"
          :organization_address="data?.data?.equipment?.user?.address"
          @refresh_addresses="refresh_addresses"
          @onChangeMethod="onChangeMethod"
        />
        <PaymentMethods
          v-if="[3, 4].includes(cookie_user?.role_id)"
          class="mt-6"
          @create_invoice="create_invoice"
        />
        <TotalPrice
          class="mt-6"
          @pay="pay"
          :products="total_arr"
          :delivery="delivery_price"
        />
        <div class="flex items-center">
          <UForm ref="form" :schema="schema" :state="state" class="mt-5 w-full">
            <div class="flex items-center">
              <UFormGroup
                name="is_acquainted"
                class="rounded-2xl mt-3 flex"
                :ui="MainFormGroupConfig()"
              >
                <UCheckbox
                  :ui="MainCheckboxConfig()"
                  v-model="state.is_acquainted"
                  class="text-base w-full"
                >
                  <template #label>
                    <div class="flex">
                      {{ $t("content.learn") }} <SpecialistConditionsModal />
                    </div>
                  </template>
                </UCheckbox>
              </UFormGroup>
            </div>
          </UForm>
        </div>

        <EquipmentRentModal
          v-model="rentModalVisible"
          @rent="rent"
          :data="pay_data"
        />
        <EquipmentSuccessModal v-model="succesModalVisisble" />
      </div>
    </div>
  </div>
</template>
<style>
.v-calendar-appointment .vc-pane {
  background-color: white;
}

.v-calendar-appointment {
  border-radius: 20px;
  overflow: hidden;
  border: none;
}
.v-calendar-appointment .vc-day {
  margin-top: 4px;
}
</style>
