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
const toast = useToast();
const { t, locale } = useI18n();
const route = useRoute();
const { startLoading, stopLoading } = useLoader();
// массив выбранных услуг
const selected_servcies = ref(route.params.services.split(","));
const select_user_model = reactive({});
const selected_dates = ref({});
const selected_week_days = ref({});
const selected_weekends = ref({});
const selected_times = ref({});
const full_times = ref({});
const spec_work_days = ref([]);
const card_services = ref([]);
const state = reactive({
  is_acquainted: false,
});

const schema = z.object({
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

const router = useRouter();

for (const service_id of selected_servcies.value) {
  select_user_model[service_id] = undefined;
  selected_dates.value[service_id] = undefined;
  selected_week_days.value[service_id] = undefined;
  selected_weekends.value[service_id] = undefined;
  selected_times.value[service_id] = undefined;
  full_times.value[service_id] = undefined;
  spec_work_days.value[service_id];
}
// получаем клинику
const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${route.params.id}/`)
);
// получаем услуг
const { data: services } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `services/clinic-services/${route.params.id}/`,
    {
      params: { service_ids: route.params.services },
    }
  )
);

const isSuccesModalOpen = ref(false);
const isCreateModalOpen = ref(false);
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
        // setTimeout(function () {
        //   router.push(`/clinics/${route.params.id}`);
        // }, 1000);
      }
    },
  });
};

const deleteService = (id) => {
  services.value.data = services.value.data.filter((sv) => sv.id !== id);
  selected_servcies.value = selected_servcies.value.filter(
    (ss) => Number(ss) !== Number(id)
  );
};

const selectTime = (time, id) => {
  selected_times.value[id] = time;
};

const onCalendarChange = async (e, id) => {
  const current_service =
    services.value?.data.filter((ss) => ss.id === id).length > 0
      ? services.value.data.filter((ss) => ss.id === id)[0]
      : undefined;
  selected_dates.value[id] = e.id;
  selected_week_days.value[id] = ((e.weekday + 5) % 7) + 1;
  if (current_service)
    selected_weekends.value[id] = current_service.weekends?.filter(
      (wnd) => wnd.weekend === `d_${selected_week_days.value[id]}`
    )[0];

  const full_data = await useFetchApi(
    `services/date-appointments/${e.id}/${current_service?.id}/${
      select_user_model[id]?.id
        ? `?specialist=${select_user_model[id]?.id}`
        : ""
    }`
  );
  selected_times.value[current_service.id] = undefined;

  full_times.value[current_service.id] = full_data.data?.service_times?.map(
    (st) => st.split(":")?.slice(0, 2)?.join(":")
  );

  spec_work_days.value[current_service.id] = full_data.data?.work_day;
};

const create = () => {
  card_services.value = [];
  if (selected_servcies.value.length > 0) {
    for (const service_id of selected_servcies.value) {
      if (!selected_dates.value[service_id]) {
        toast.add({
          title: t("toast.error"),
          color: "red",
          description: t("toast.select_date", {
            name: services.value.data.filter((ss) => ss.id == service_id)[0]
              .service?.[
              locale.value === "ru"
                ? "service_type"
                : `service_type_${locale.value}`
            ],
          }),
        });
        return;
      }
      if (!selected_times.value[service_id]) {
        toast.add({
          title: t("toast.error"),
          color: "red",
          description: t("toast.select_time", {
            name: services.value.data.filter((ss) => ss.id == service_id)[0]
              .service?.[
              locale.value === "ru"
                ? "service_type"
                : `service_type_${locale.value}`
            ],
          }),
        });
        return;
      }

      card_services.value.push({
        service_type: services.value.data.filter((ss) => ss.id == service_id)[0]
          ?.service?.[
          locale.value === "ru"
            ? "service_type"
            : `service_type_${locale.value}`
        ],
        organisation_name:
          data.value.data?.[
            locale.value === "ru"
              ? "organisation_name"
              : `organisation_name_${locale.value}`
          ],
        address: data.value.data?.address,
        rating: data.value.data?.rating,
        photo: services.value.data.filter((ss) => ss.id == service_id)[0]
          ?.service?.photo,
        price: services.value.data.filter((ss) => ss.id == service_id)[0]
          .is_promotion
          ? services.value.data.filter((ss) => ss.id == service_id)[0].promotion
          : services.value.data.filter((ss) => ss.id == service_id)[0].price,
        date: selected_dates.value[service_id],
        time: selected_times.value[service_id],
        duration: services.value.data.filter((ss) => ss.id == service_id)[0]
          .service_duration,
        specialist: select_user_model[service_id],
        id: services.value.data.filter((ss) => ss.id == service_id)[0].id,
      });
    }
  } else {
    toast.add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.select_service"),
    });
    return;
  }
  isCreateModalOpen.value = true;
};

useHead({
  title:
    data?.value?.data?.[
      locale.value === "ru"
        ? "organisation_name"
        : `organisation_name_${locale}`
    ],
});

watch(isSuccesModalOpen, (newV, oldV) => {
  if (!newV) {
    router.push(`/clinics/${route.params.id}`);
  }
});
</script>

<template>
  <div class="appointment-page bg-white main-container pb-16">
    <CommonUiBreadCrumb
      class="mt-10"
      :links="[
        { label: $t('bread_crumb.main'), to: '/' },
        data?.data?.organisation_type?.id === 1
          ? { label: $t('bread_crumb.clinics'), to: '/clinics' }
          : { label: $t('bread_crumb.dentistry'), to: '/dentistry' },
        {
          label: `${
            data?.data?.[
              locale === 'ru'
                ? 'organisation_name'
                : `organisation_name_${locale}`
            ]
          } `,
          to: `/clinics/${$route.params.id}`,
        },
        { label: $t('bread_crumb.appointment') },
      ]"
    />

    <div class="tiny-container mt-11">
      <div
        v-for="service in services.data"
        :key="service.id"
        class="bg-wild-sand-300 px-4 py-3 mb-4 rounded-2xl"
      >
        <div class="flex gap-6">
          <div class="w-1/2">
            <p class="text-base font-medium">
              {{
                service?.service[
                  locale === "ru" ? "service_type" : `service_type_${locale}`
                ]
              }}
            </p>
            <span
              :class="{ 'line-through': service?.is_promotion }"
              class="text-sm font-semibold text-pumice mt-2"
            >
              {{ priceFormat(service?.price) }}
            </span>
            <span
              v-if="service?.is_promotion"
              class="text-sm font-semibold text-pumice mt-2 ms-2"
            >
              {{ priceFormat(service?.promotion) }}
            </span>
          </div>
          <div class="w-1/2">
            <p class="text-base font-medium">{{ $t("catalog.duration") }}</p>
            <p class="text-sm font-semibold text-pumice mt-2">
              {{ service?.service_duration }}
            </p>
          </div>
          <div>
            <img
              @click="deleteService(service?.id)"
              class="cursor-pointer"
              src="~assets/svg/common/close-gray.svg"
              alt=""
            />
          </div>
        </div>
        <div class="flex gap-6 mt-3">
          <USelectMenu
            class="w-full bg-wild-sand-300"
            :ui="WhiteButtonConfig()"
            :uiMenu="RadioSelectMenuConfig()"
            v-model="select_user_model[service?.id]"
            :options="[
              0,
              ...service?.employees
                .map((emp) => emp.specialist)
                .filter((sp) => sp.role.id === 2),
            ]"
            option-attribute="first_name"
            selected-icon="i-ic-baseline-radio-button-checked"
          >
            <template #label>
              <img
                :src="
                  select_user_model[service?.id]?.avatar?.length > 0
                    ? select_user_model[service?.id]?.avatar[0]
                    : '/common/user-black.png'
                "
                alt="avatar"
                class="w-5 h-5 rounded-full"
              />
              <span v-if="select_user_model[service?.id]?.first_name"
                >{{ select_user_model[service?.id]?.first_name }}
                {{ select_user_model[service?.id]?.last_name }}</span
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
        <div class="flex flex-wrap md:flex-nowrap gap-x-6 mt-7">
          <div class="w-full md:w-1/2">
            <DatePicker
              @dayclick="onCalendarChange($event, service.id)"
              expanded
              color="emerald"
              class="v-calendar-appointment"
              :min-date="new Date()"
            />
          </div>
          <div class="w-full md:w-1/2">
            <div
              v-if="
                !selected_weekends[service.id] ||
                selected_weekends[service.id]?.is_weekend
              "
              class="bg-wild-sand-300 rounded-[20px] h-full w-full py-4 px-6"
            >
              <p
                v-if="!selected_weekends[service.id]"
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
                    spec_work_days[service.id]?.start_work_time ??
                      selected_weekends[service.id]?.start_available_time,
                    spec_work_days[service.id]?.end_work_time ??
                      selected_weekends[service.id]?.end_available_time,
                    service?.service_duration,
                    spec_work_days[service.id]?.start_break_time ??
                      selected_weekends[service.id]?.start_break_time,
                    spec_work_days[service.id]?.end_break_time ??
                      selected_weekends[service.id]?.end_break_time
                  )"
                  :key="n"
                  class="w-1/5 rounded-xl py-[5] px-[10] text-center cursor-pointer"
                  @click="
                    full_times[service.id]?.includes(n) ||
                    isTimeInPast(selected_dates[service.id], n)
                      ? () => {}
                      : selectTime(n, service.id)
                  "
                  :class="{
                    'bg-emerald text-white': selected_times[service?.id] == n,
                    'bg-white border border-pumice':
                      selected_times[service.id] !== n,
                    'text-pumice disabled':
                      full_times[service.id]?.includes(n) ||
                      isTimeInPast(selected_dates[service.id], n),
                  }"
                >
                  {{ n }}
                </div>
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
