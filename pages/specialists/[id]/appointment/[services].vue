<script setup>
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";
import { z } from "zod";
const router = useRouter();
import {
  MainButtonConfig,
  MainCheckboxConfig,
  MainFormGroupConfig,
  WhiteButtonConfig,
} from "~/composables/ui/useConfig";
const toast = useToast();
const { t, locale } = useI18n();
const route = useRoute();
const { startLoading, stopLoading } = useLoader();

const selected_servcies = ref(route.params.services.split(","));
const selected_dates = ref({});
const selected_week_days = ref({});
const selected_weekends = ref({});
const selected_times = ref({});
const full_times = ref({});
const card_services = ref([]);
const state = reactive({
  is_acquainted: false,
});

const schema = z.object({
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

for (const service_id of selected_servcies.value) {
  selected_dates.value[service_id] = undefined;
  selected_week_days.value[service_id] = undefined;
  selected_weekends.value[service_id] = undefined;
  selected_times.value[service_id] = undefined;
  full_times.value[service_id] = undefined;
}

// получаем специалиста
const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `users/show/${route.params.id}/`)
);

// получаем выбранные услуги
const { data: services, refresh: services_refresh } = await useAsyncData(() =>
  $fetch(
    useRuntimeConfig().public.API_URL +
      `services/specialist-services/${route.params.id}`,
    {
      params: {
        service_ids: route.params.services,
      },
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

  selected_dates.value[current_service.OrganisationService?.id] = e.id;
  selected_week_days.value[current_service.OrganisationService?.id] =
    ((e.weekday + 5) % 7) + 1;
  if (current_service)
    selected_weekends.value[current_service.OrganisationService?.id] =
      current_service.days?.filter(
        (wnd) =>
          wnd.work_day ===
          `d_${
            selected_week_days.value[current_service.OrganisationService?.id]
          }`
      )[0];

  const full_data = await useFetchApi(
    `services/date-appointments/${e.id}/${current_service.OrganisationService?.service?.id}?specialist=${route.params.id}`
  );
  selected_times.value[current_service.OrganisationService?.id] = undefined;

  full_times.value[current_service.OrganisationService?.id] =
    full_data.data.service_times.map((st) =>
      st.split(":")?.slice(0, 2)?.join(":")
    );
};

const create = () => {
  card_services.value = [];
  if (services.value.data.length > 0) {
    for (const service of services.value.data) {
      if (!selected_dates.value[service.OrganisationService?.id]) {
        toast.add({
          title: t("toast.error"),
          color: "red",
          description: t("toast.select_date", {
            name: service.OrganisationService?.service?.[
              locale.value === "ru"
                ? "service_type"
                : `service_type_${locale.value}`
            ],
          }),
        });
        return;
      }
      if (!selected_times.value[service.OrganisationService?.id]) {
        toast.add({
          title: t("toast.error"),
          color: "red",
          description: t("toast.select_time", {
            name: service.OrganisationService?.service?.[
              locale.value === "ru"
                ? "service_type"
                : `service_type_${locale.value}`
            ],
          }),
        });
        return;
      }

      card_services.value.push({
        service_type:
          service.OrganisationService?.service?.[
            locale.value === "ru"
              ? "service_type"
              : `service_type_${locale.value}`
          ],
        organisation_name: ``,
        address: data.value.data?.address,
        rating: data.value.data?.rating,
        price: service.OrganisationService?.is_promotion
          ? service.OrganisationService?.promotion
          : service.OrganisationService?.price,
        photo: service.OrganisationService?.service?.photo,
        date: selected_dates.value[service.OrganisationService?.id],
        time: selected_times.value[service.OrganisationService?.id],
        duration: service.OrganisationService?.service_duration,
        specialist: data.value.data,
        id: service.OrganisationService?.id,
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
  title: `${data?.value?.data?.first_name} ${data?.value?.data?.last_name}`,
});

watch(isSuccesModalOpen, (newV, oldV) => {
  if (!newV) {
    router.push(`/specialists/${route.params.id}`);
  }
});
</script>

<template>
  <div class="appointment-page bg-white main-container pb-16">
    <CommonUiBreadCrumb
      class="mt-10"
      :links="[
        { label: $t('bread_crumb.main'), to: '/' },
        { label: $t('bread_crumb.specialists'), to: '/specialists' },
        {
          label: `${data?.data?.first_name} ${data?.data?.last_name} `,
          to: `/specialists/${$route.params.id}`,
        },
        { label: $t('bread_crumb.appointment') },
      ]"
    />

    <div class="tiny-container mt-11">
      <div
        v-for="service in services.data"
        :key="service.OrganisationService?.id"
        class="bg-wild-sand-300 px-4 py-3 mb-4 rounded-2xl"
      >
        <div class="flex gap-6">
          <div class="w-1/2">
            <p class="text-base font-medium">
              {{
                service?.OrganisationService?.service?.[
                  locale === "ru" ? "service_type" : `service_type_${locale}`
                ]
              }}
            </p>
            <div class="mt-2">
              <span
                :class="{
                  'line-through': service?.OrganisationService?.promotion,
                }"
                class="text-sm font-semibold text-pumice mt-2"
              >
                {{ priceFormat(service?.OrganisationService?.price) }}
              </span>
              <span class="text-sm font-semibold text-pumice ms-2">
                {{ priceFormat(service?.OrganisationService?.promotion) }}
              </span>
            </div>
          </div>
          <div class="w-1/2">
            <p class="text-base font-medium">{{ $t("catalog.duration") }}</p>
            <p class="text-sm font-semibold text-pumice mt-2">
              {{ service?.OrganisationService?.service_duration }}
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
          <UButton :ui="WhiteButtonConfig()" class="w-full"
            ><img src="~assets/svg/common/user-black.svg" alt="" />{{
              `${data?.data?.first_name} ${data?.data?.last_name}`
            }}</UButton
          >
        </div>
        <div class="flex flex-wrap md:flex-nowrap gap-x-6 mt-7">
          <div class="w-full md:w-1/2">
            <DatePicker
              @dayclick="onCalendarChange($event, service.id)"
              expanded
              color="emerald"
              class="v-calendar-appointment w-full"
              :min-date="new Date()"
            />
          </div>
          <div class="w-full md:w-1/2">
            <div
              v-if="
                !selected_weekends[service.OrganisationService?.id] ||
                selected_weekends[service.OrganisationService?.id]?.is_weekend
              "
              class="bg-wild-sand-300 rounded-[20px] h-full w-full py-4 px-6"
            >
              <p
                v-if="!selected_weekends[service.OrganisationService?.id]"
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
                    selected_weekends[service.OrganisationService?.id]
                      ?.start_work_time,
                    selected_weekends[service.OrganisationService?.id]
                      ?.end_work_time,
                    service?.OrganisationService?.service_duration,
                    selected_weekends[service.OrganisationService?.id]
                      ?.start_break_time,
                    selected_weekends[service.OrganisationService?.id]
                      ?.end_break_time
                  )"
                  :key="n"
                  class="w-1/5 rounded-xl py-[5] px-[10] text-center cursor-pointer flex items-center justify-center"
                  :disabled="
                    full_times[service.OrganisationService?.id]?.includes(n)
                  "
                  @click="
                    full_times[service.OrganisationService?.id]?.includes(n) ||
                    isTimeInPast(
                      selected_dates[service.OrganisationService?.id],
                      n
                    )
                      ? () => {}
                      : selectTime(n, service.OrganisationService?.id)
                  "
                  :class="{
                    'bg-emerald text-white':
                      selected_times[service.OrganisationService?.id] == n,
                    'bg-white border border-pumice':
                      selected_times[service.OrganisationService?.id] !== n,
                    'text-pumice disabled':
                      full_times[service.OrganisationService?.id]?.includes(
                        n
                      ) ||
                      isTimeInPast(
                        selected_dates[service.OrganisationService?.id],
                        n
                      ),
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
