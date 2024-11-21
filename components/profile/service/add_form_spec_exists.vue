<script setup>
import {
  MainCheckboxConfig,
  MainFormGroupConfig,
  MainInputConfig,
  MainToggleConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const { t } = useI18n();
import { z } from "zod";
const { startLoading, stopLoading } = useLoader();
const route = useRoute();
const selectedDay = ref(1);
const daysData = reactive({
  d_1: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_2: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_3: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_4: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_5: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_6: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_7: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
});

const duration = reactive({
  hour: 0,
  minute: 0,
});
const state = reactive({
  price: "",
  is_promotion: false,
  promotion: undefined,
  days: daysData,
  service_duration: "",
  is_acquainted: false,
});

const schema = z.object({
  service_duration: z.string().min(1, t("form_verification.required")),
  price: z.string().min(1, t("form_verification.required")),
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

const setSelectedDay = (val) => {
  selectedDay.value = val;
};

const create = async () => {
  const form_data = new FormData();

  for (let i = 1; i <= 7; i++) {
    if (daysData[`d_${i}`].is_weekend) {
      form_data.append(`d_${i}[is_weekend]`, daysData[`d_${i}`].is_weekend);
      continue;
    } else if (
      !daysData[`d_${i}`].is_weekend &&
      (!daysData[`d_${i}`].available_time.start.hour ||
        !daysData[`d_${i}`].available_time.start.minute ||
        !daysData[`d_${i}`].available_time.end.hour ||
        !daysData[`d_${i}`].available_time.end.minute)
      // ||
      // !daysData[`d_${i}`].break_time.start.hour ||
      // !daysData[`d_${i}`].break_time.start.minute ||
      // !daysData[`d_${i}`].break_time.end.hour ||
      // !daysData[`d_${i}`].break_time.end.minute
    ) {
      useToast().add({
        color: "red",
        title: t("toast.error"),
        description: t(`toast.set_work_time_and_rest`, {
          name: t(`short_weekdays.d${i}`),
        }),
      });

      return;
    } else {
      form_data.append(`d_${i}[is_weekend]`, daysData[`d_${i}`].is_weekend);
      form_data.append(
        `d_${i}[start_available_time]`,
        daysData[`d_${i}`].available_time.start.hour +
          ":" +
          daysData[`d_${i}`].available_time.start.minute
      );
      form_data.append(
        `d_${i}[end_available_time]`,
        daysData[`d_${i}`].available_time.end.hour +
          ":" +
          daysData[`d_${i}`].available_time.end.minute
      );
      form_data.append(
        `d_${i}[start_break_time]`,
        daysData[`d_${i}`].break_time.start.hour +
          ":" +
          daysData[`d_${i}`].break_time.start.minute
      );
      form_data.append(
        `d_${i}[end_break_time]`,
        daysData[`d_${i}`].break_time.end.hour +
          ":" +
          daysData[`d_${i}`].break_time.end.minute
      );
    }
  }

  form_data.append("service_duration", state.service_duration);
  form_data.append("price", state.price.replaceAll(/[\D]+/gi, ""));
  form_data.append("is_promotion", Number(state.is_promotion));
  if (state.promotion)
    form_data.append("promotion", state.promotion.replaceAll(/[\D]+/gi, ""));
  form_data.append("is_acquainted", 1);
  startLoading();
  const res = await useFetchApi(
    `services/store-specialist-exist/${route.params.id}`,
    {
      method: "POST",
      body: form_data,
      headers: {
        Accept: "application/json",
      },
      onResponse() {
        stopLoading();
      },
    }
  );

  if (res) {
    useRouter().push("/profile/service");
  }
};

watch(duration, (newv, oldv) => {
  state.service_duration = `${newv.hour}:${newv.minute}`;
});
</script>

<template>
  <div class="add-service">
    <UForm
      :schema="schema"
      :state="state"
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] gap-y-3 w-full"
      @submit="create"
    >
      <div class="w-full flex flex-wrap md:flex-nowrap gap-6">
        <div class="w-full md:w-1/2">
          <UFormGroup
            :label="$t('form.work_schedule')"
            required
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex justify-between mt-4">
              <div
                v-for="weekday in 7"
                :key="weekday"
                class="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-pumice flex justify-center items-center font-medium text-xs uppercase cursor-pointer"
                :class="
                  daysData[`d_${weekday}`].is_weekend
                    ? 'bg-wild-sand-200 border-pumice text-black'
                    : selectedDay === weekday
                    ? 'bg-emerald border-emerald text-white'
                    : ''
                "
                @click="setSelectedDay(weekday)"
              >
                {{ $t(`short_weekdays.d${weekday}`) }}
              </div>
            </div>
          </UFormGroup>

          <UCheckbox
            :ui="MainCheckboxConfig()"
            v-model="daysData[`d_${selectedDay}`].is_weekend"
            @click="(e) => e.stopPropagation()"
            class="mt-3"
            :label="$t('form.weekend')"
          />

          <UFormGroup
            v-if="!daysData[`d_${selectedDay}`].is_weekend"
            :label="$t('form.available_time')"
            required
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex gap-2">
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].available_time.start"
                :title="$t('form.start_time')"
              />
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].available_time.end"
                :title="$t('form.end_time')"
              />
            </div>
          </UFormGroup>

          <UFormGroup
            v-if="!daysData[`d_${selectedDay}`].is_weekend"
            :label="$t('form.break_time')"
            required
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex gap-2">
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].break_time.start"
                :title="$t('form.start_time')"
              />
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].break_time.end"
                :title="$t('form.end_time')"
              />
            </div>
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2">
          <UFormGroup
            :label="$t('form.service_duration')"
            required
            name="service_duration"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <ScrollPickerDuration
              v-model:hour="duration.hour"
              v-model:minute="duration.minute"
            />
          </UFormGroup>

          <UFormGroup
            :label="$t('form.price')"
            name="price"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <UInput
              v-model="state.price"
              :value="changePriceMask(state.price)"
              class=""
              :ui="MainInputConfig()"
              :placeholder="$t('form.price_p')"
            >
            </UInput>
          </UFormGroup>

          <UFormGroup
            name="promotion"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <template #label>
              <div class="flex justify-between w-full mb-1">
                <p>{{ $t("form.sale") }}</p>
                <UToggle
                  v-model="state.is_promotion"
                  :ui="MainToggleConfig()"
                  color="japanese-laurel"
                />
              </div>
            </template>
            <UInput
              :disabled="!state.is_promotion"
              v-model="state.promotion"
              :value="changePriceMask(state.promotion)"
              :ui="MainInputConfig()"
              :placeholder="$t('form.sale_p')"
            >
            </UInput>
          </UFormGroup>
        </div>
      </div>
      <div class="flex items-center mt-6">
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
                {{ $t("content.learn") }} <ProfileProductConditionsModal />
              </div>
            </template>
          </UCheckbox>
        </UFormGroup>
      </div>
      <UButton
        class="mt-4 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.save") }}
      </UButton>
    </UForm>
  </div>
</template>
