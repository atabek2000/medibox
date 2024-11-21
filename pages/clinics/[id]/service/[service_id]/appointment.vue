<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";
import { z } from "zod";
import {
  MainButtonConfig,
  MainCheckboxConfig,
  MainFormGroupConfig,
  RadioSelectMenuConfig,
  WhiteButtonConfig,
} from "~/composables/ui/useConfig";
const route = useRoute();
const router = useRouter();
const cookie_jwt = useCookie("jwt");
const toast = useToast();
const { t, locale } = useI18n();
const { startLoading, stopLoading } = useLoader();

const card_services = ref([]);
const isCreateModalOpen = ref(false);
const isSuccesModalOpen = ref(false);
const state = reactive({
  is_acquainted: false,
});
const schema = z.object({
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});
const full_times = ref([]);
const spec_work_day = ref();

// услуга
const { data } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `services/show-service/${route.params.service_id}/`,
    {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
    }
  )
);

// клиника
const { data: clinic } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${route.params.id}/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);

const selected_date = ref();
const selected_time = ref();
const selected_week_day = ref();
const selected_weekend = ref();
const select_specialist = ref();

const selectTime = (time) => {
  selected_time.value = time;
};

const onCalendarChange = async (e) => {
  selected_date.value = e.id;
  selected_week_day.value = ((e.weekday + 5) % 7) + 1;
  selected_weekend.value = data?.value?.data?.weekends?.filter(
    (wnd) => wnd.weekend === `d_${selected_week_day.value}`
  )[0];

  // получим занятые даты
  const full_data = await useFetchApi(
    `services/date-appointments/${e.id}/${route.params.service_id}/${
      select_specialist.value
        ? `?specialist=${select_specialist.value?.id}`
        : ""
    }`
  );
  full_times.value = full_data.data?.service_times.map((st) =>
    st.split(":")?.slice(0, 2)?.join(":")
  );
  // if selected specialist get work_day
  if (select_specialist.value?.id) {
    spec_work_day.value = full_data.data?.work_day;
  }

  selected_time.value = undefined;
};

const create = () => {
  card_services.value = [];
  if (!selected_date.value) {
    toast.add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.select_date"),
    });
    return;
  }
  if (!selected_time.value) {
    toast.add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.select_time"),
    });
    return;
  }

  card_services.value.push({
    service_type:
      data.value.data.service?.[
        locale.value === "ru" ? "service_type" : `service_type_${locale.value}`
      ],
    organisation_name:
      clinic.value.data?.[
        locale.value === "ru"
          ? "organisation_name"
          : `organisation_name_${locale.value}`
      ],
    address: clinic.value.data?.address,
    rating: clinic.value.data?.rating,
    price: data.value.data.is_promotion
      ? data.value.data.promotion
      : data.value.data.price,
    date: selected_date.value,
    time: selected_time.value,
    photo: data.value.data?.service?.photo,
    duration: data.value.data.service_duration,
    specialist: select_specialist.value,
    id: data.value.data.id,
  });

  isCreateModalOpen.value = true;
};

const isPaymentModalOpen = ref(false);
const showPaymentModal = () => {
  isCreateModalOpen.value = false;
  isPaymentModalOpen.value = true;
};

const showSuccessModal = () => {
  startLoading();
  useFetchApi(`services/make-appointment`, {
    method: "POST",
    body: card_services.value.map((ss) => {
      return {
        id: ss.id,
        date: ss.date,
        service_time: ss.time,
        specialist_id: ss.specialist?.id ?? undefined,
        is_acquainted: 1,
      };
    }),
    onResponse({ response }) {
      stopLoading();
      if (response.ok) {
        // delete payment
        // if (response._data?.data?.data?.redirect_url)
        //   window.location = response._data?.data?.data?.redirect_url;
        isPaymentModalOpen.value = false;
        isSuccesModalOpen.value = true;
      }
    },
  });
};

useHead({
  title:
    data?.value?.data?.service?.[
      locale.value === "ru" ? "service_type" : `service_type_${locale}`
    ],
});

watch(isSuccesModalOpen, (newV, oldV) => {
  if (!newV) {
    router.push(
      `/clinics/${route.params.id}/service/${data.value.data?.service?.id}`
    );
  }
});
</script>

<template>
  <div class="appointment-page bg-white main-container pb-16">
    <CommonUiBreadCrumb
      class="mt-10"
      :links="[
        { label: $t('bread_crumb.main'), to: '/' },
        clinic.data?.organisation_type?.id === 1
          ? { label: $t('bread_crumb.clinics'), to: '/clinics' }
          : { label: $t('bread_crumb.dentistry'), to: '/dentistry' },
        {
          label: `${clinic?.data?.organisation_name} `,
          to: `/clinics/${$route.params.id}`,
        },
        {
          label:
            data?.data?.service?.[
              locale === 'ru' ? 'service_type' : `service_type_${locale}`
            ],
          to: `/clinics/${$route.params.id}/service/${data?.data?.service?.id}`,
        },
        { label: $t('bread_crumb.appointment') },
      ]"
    />

    <div class="tiny-container mt-11">
      <div class="bg-wild-sand-300 px-4 py-3 mb-4 rounded-2xl">
        <div class="flex gap-6">
          <div class="w-1/2">
            <p class="text-base font-medium">
              {{
                data?.data?.service?.[
                  locale === "ru" ? "service_type" : `service_type_${locale}`
                ]
              }}
            </p>
            <span
              :class="{ 'line-through': data?.data?.is_promotion }"
              class="text-sm font-semibold text-pumice mt-2"
            >
              {{ priceFormat(data?.data?.price) }}
            </span>
            <span
              v-if="data?.data?.is_promotion"
              class="text-sm font-semibold text-pumice mt-2 ms-2"
            >
              {{ priceFormat(data?.data?.promotion) }}
            </span>
          </div>
          <div class="w-1/2">
            <p class="text-base font-medium">{{ $t("catalog.duration") }}</p>
            <p class="text-sm font-semibold text-pumice mt-2">
              {{ data?.data?.service_duration }}
            </p>
          </div>
        </div>
        <div class="flex gap-6 mt-3">
          <USelectMenu
            class="w-full bg-wild-sand-300"
            :ui="WhiteButtonConfig()"
            :uiMenu="RadioSelectMenuConfig()"
            v-model="select_specialist"
            :options="[
              0,
              ...data?.data?.employees
                ?.map((spc) => spc.specialist)
                .filter((sp) => sp.role.id === 2),
            ]"
            option-attribute="first_name"
            selected-icon="i-ic-baseline-radio-button-checked"
          >
            <template #label>
              <img
                :src="
                  select_specialist?.avatar?.length > 0
                    ? select_specialist?.avatar[0]
                    : '/common/user-black.png'
                "
                alt="avatar"
                class="w-5 h-5 rounded-full"
              />
              <span v-if="select_specialist?.first_name"
                >{{ select_specialist?.first_name }}
                {{ select_specialist?.last_name }}</span
              >
              <span v-else>{{ $t("catalog.any_doctor") }}</span>
            </template>
            <template #option="{ option }">
              <img
                :src="
                  option?.avatar?.length > 0
                    ? option?.avatar[0]
                    : '/common/user-black.png'
                "
                alt="avatar"
                class="w-5 h-5 rounded-full"
              />
              <span v-if="option"
                >{{ option?.first_name }} {{ option?.last_name }}</span
              >
              <span v-else>{{ $t("catalog.any_doctor") }}</span>
            </template>
          </USelectMenu>
        </div>
      </div>
    </div>

    <div class="tiny-container">
      <div class="flex flex-wrap md:flex-nowrap gap-x-6 mt-7">
        <div class="w-full md:w-1/2">
          <DatePicker
            @dayclick="onCalendarChange"
            expanded
            color="emerald"
            class="v-calendar-appointment"
            :min-date="new Date()"
          />
        </div>
        <div class="w-full md:w-1/2 mt-3 md:mt-0">
          <div
            v-if="!selected_weekend || selected_weekend?.is_weekend"
            class="bg-wild-sand-300 rounded-[20px] h-full w-full py-4 px-6"
          >
            <p
              v-if="!selected_weekend"
              class="font-normal text-sm text-heavy-metal"
            >
              {{ $t("form.select_days") }}
            </p>
            <p v-else class="font-normal text-sm text-heavy-metal">
              {{ $t("form.weekend") }}
            </p>
          </div>
          <div
            v-else
            class="bg-wild-sand-300 rounded-[20px] h-full w-full py-4 px-6"
          >
            <p class="font-normal text-sm text-heavy-metal">
              {{ $t("catalog.available_time") }}
            </p>
            <div
              class="times-block mt-4 flex flex-wrap gap-x-[6%] gap-y-4 max-h-64 overflow-auto"
            >
              <div
                v-for="n in getTimesList(
                  spec_work_day?.start_work_time ??
                    selected_weekend?.start_available_time,
                  spec_work_day?.end_work_time ??
                    selected_weekend?.end_available_time,
                  data.data?.service_duration,
                  spec_work_day?.start_break_time ??
                    selected_weekend?.start_break_time,
                  spec_work_day?.end_break_time ??
                    selected_weekend?.end_break_time
                )"
                :key="n"
                class="w-1/5 rounded-xl py-[5] px-[10] text-center cursor-pointer"
                @click="
                  full_times.includes(n) || isTimeInPast(selected_date, n)
                    ? () => {}
                    : selectTime(n)
                "
                :class="{
                  'bg-emerald text-white': selected_time === n,
                  'bg-white border border-pumice': selected_time !== n,
                  'text-pumice disabled':
                    full_times.includes(n) || isTimeInPast(selected_date, n),
                }"
              >
                {{ n }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tiny-container mt-5">
      <UForm @submit="create" :schema="schema" :state="state" class="mt-5">
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
        <UButton
          type="submit"
          :ui="MainButtonConfig()"
          class="w-full flex justify-center mt-4"
          >{{ $t("button.continue") }}</UButton
        >
      </UForm>
      <SpecialistAppointmentConfirmModal
        @showSuccessModal="showSuccessModal"
        :services="card_services"
        v-model="isCreateModalOpen"
      />

      <SpecialistPaymentModal
        @showSuccessModal="showSuccessModal"
        :services="card_services"
        v-model="isPaymentModalOpen"
      />
      <SpecialistSuccessModal v-model="isSuccesModalOpen" />
    </div>
  </div>
</template>

<style>
.v-calendar-appointment .vc-pane {
  background-color: #f7f7f7;
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
