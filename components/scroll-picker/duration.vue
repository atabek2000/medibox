<script setup>
import { MainInputConfig, MainButtonConfig } from "~/composables/ui/useConfig";
import { VueScrollPicker } from "vue-scroll-picker";
import "vue-scroll-picker/lib/style.css";

const hour = defineModel("hour", { required: true });
const minute = defineModel("minute", { required: true });

const hours = Array.from({ length: 12 }, (_, index) =>
  index > 9 ? `${index}` : `0${index}`
);
const minutes = Array.from({ length: 60 }, (_, index) =>
  index > 9 ? `${index}` : `0${index}`
);
const isOpen = ref(false);
const openModal = () => {
  isOpen.value = true;
};

const onReady = () => {
  isOpen.value = false;
};

// watch(hour, () => {
//   model.value.hour = hour.value;
// });
// watch(minute, () => {
//   model.value.minute = minute.value;
// });
</script>
<template>
  <div class="">
    <UInput
      :value="`${hour} ${$t('modal.hour_short')}:${minute} ${$t(
        'modal.min_short'
      )}`"
      :ui="MainInputConfig()"
      placeholder=":"
      @click="openModal"
    >
    </UInput>
    <UModal v-model="isOpen">
      <div class="duration-modal p-4">
        <div class="flex justify-between">
          <p class="font-semibold text-xl">{{ $t("modal.duration") }}</p>
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1 p-0"
            @click="isModalOpen = false"
          >
            <img src="~assets/svg/common/close-modal-small.svg" alt=""
          /></UButton>
        </div>
        <div class="flex relative mt-3">
          <VueScrollPicker
            v-model="hour"
            :options="hours"
            class="duration-modal-hour"
          />
          <VueScrollPicker
            v-model="minute"
            :options="minutes"
            class="duration-modal-minute"
          />
          <p class="hour-text absolute">{{ $t("modal.hour_short") }}</p>
          <p class="minute-text absolute">{{ $t("modal.min_short") }}</p>
        </div>
        <UButton
          @click="onReady"
          :ui="MainButtonConfig()"
          class="w-full flex justify-center mt-3"
          >{{ $t("button.ready") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>

<style>
.duration-modal-hour .vue-scroll-picker-layer-selection {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background: #3334331a;
}
.duration-modal-minute .vue-scroll-picker-layer-selection {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  background: #3334331a;
}
.duration-modal .vue-scroll-picker-item {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}
.duration-modal .vue-scroll-picker-layer-bottom {
  border: none;
}
.duration-modal .vue-scroll-picker-layer-top {
  border: none;
}
.hour-text {
  top: 67px;
  left: 135px;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}
.minute-text {
  top: 67px;
  left: 375px;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}
</style>
