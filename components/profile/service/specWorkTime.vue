<script setup>
import {
  MainFormGroupConfig,
  MainCheckboxConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";

const specialist = defineModel({ required: true });
const selectedDay = ref(1);

const setSelectedDay = (val) => {
  selectedDay.value = val;
};
</script>

<template>
  <div>
    <UPopover>
      <div
        class="w-full px-4 py-3 bg-wild-sand rounded-2xl flex justify-between mb-2 border border-japanese-laurel cursor-pointer"
      >
        <div class="flex gap-x-2">
          <img src="~assets/svg/common/clock-green.svg" alt="" />
          <p class="text-sm font-medium text-japanese-laurel">
            {{ $t("form.work_time") }}
          </p>
        </div>
        <img src="~assets/svg/common/arrow-green.svg" alt="" />
      </div>

      <template #panel="{ close }">
        <div class="w-full md:min-w-[420px] px-4 py-6">
          <div class="flex justify-between">
            <p class="font-semibold text-xl">{{ $t("form.work_time") }}</p>
            <img
              src="~assets/svg/common/close-modal.svg"
              alt="close"
              class="cursor-pointer"
              @click="close"
            />
          </div>
          <UFormGroup
            :label="$t('form.select_days')"
            required
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex justify-between gap-x-2 mt-4">
              <div
                v-for="weekday in 7"
                :key="weekday"
                class="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl border border-pumice flex justify-center items-center font-medium text-xs uppercase cursor-pointer"
                :class="
                  specialist[`d_${weekday}`].is_weekend
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
            v-model="specialist[`d_${selectedDay}`].is_weekend"
            @click="(e) => e.stopPropagation()"
            class="mt-3"
            :label="$t('form.weekend')"
          />

          <UFormGroup
            v-if="!specialist[`d_${selectedDay}`].is_weekend"
            :label="$t('form.time')"
            required
            class="rounded-2xl w-full mt-4"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex gap-2 mt-4">
              <ScrollPickerTime
                class="w-1/2"
                v-model="specialist[`d_${selectedDay}`].time.start"
                :title="$t('form.start_time')"
              />
              <ScrollPickerTime
                class="w-1/2"
                v-model="specialist[`d_${selectedDay}`].time.end"
                :title="$t('form.end_time')"
              />
            </div>
          </UFormGroup>
          <UButton
            class="mt-4 w-full flex justify-center"
            :ui="MainButtonConfig()"
            @click="close"
          >
            {{ $t("button.ready") }}
          </UButton>
        </div>
      </template>
    </UPopover>
  </div>
</template>
