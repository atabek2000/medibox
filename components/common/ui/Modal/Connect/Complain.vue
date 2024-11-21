<script setup>
import {
  DeliveryMethodRadioConfig,
  TransparentButtonConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const { useDicts } = useDict();
const { locale } = useI18n();
const model = defineModel({ required: true });
const props = defineProps({
  phone: {
    type: String,
    default: "",
  },
});

const selected = ref(0);

const ComplaintType = [
  {
    id: 1,
    name: "Busy",
  },
  {
    id: 2,
    name: "Not answer",
  },
];

const emit = defineEmits(["showModal", "closeModal", "setComplaintType"]);

const sendComplaintType = () => {
  if (selected.value) {
    emit("setComplaintType", selected.value);
  }
};
</script>

<template>
  <div class="connect-init">
    <UModal v-model="model" :ui="{ rounded: 'rounded-[20px]' }">
      <div class="px-14 py-9">
        <div class="flex justify-between">
          <p class="text-xl font-bold">{{ $t("modal.complain") }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="$emit('closeModal', 'complain')"
          />
        </div>

        <div
          v-for="complaint_type in useDicts().value.ComplaintType"
          :key="complaint_type.id"
          class="flex justify-between py-3 mt-4"
        >
          <p class="text-base font-normal text-pumice-900">
            {{ complaint_type?.[locale === "ru" ? "name" : `name_${locale}`] }}
          </p>
          <URadio
            v-model="selected"
            :value="complaint_type.id"
            :ui="DeliveryMethodRadioConfig()"
          />
        </div>

        <UButton
          class="w-full mt-4"
          :ui="TransparentButtonConfig()"
          @click="$emit('showModal', 'complain_form')"
          >{{ $t("button.other") }}</UButton
        >
        <UButton
          class="w-full mt-4 flex justify-center"
          :ui="MainButtonConfig()"
          @click="sendComplaintType"
          >{{ $t("button.send") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>
