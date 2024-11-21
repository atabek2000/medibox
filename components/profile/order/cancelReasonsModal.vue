<script setup>
import {
  DeliveryMethodRadioConfig,
  TransparentButtonConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const { useDicts } = useDict();
const model = defineModel({ required: true });
const { locale } = useI18n();
const selected = ref(0);
const reasons = ref([]);
const props = defineProps({
  type: {
    type: String,
    default: "medicine",
  },
});

const emit = defineEmits(["setReason", "otherReason"]);

const sendComplaintType = () => {
  if (selected.value) {
    emit("setReason", selected.value);
  }
};

onMounted(() => {
  if (props.type === "medicine")
    reasons.value = useDicts().value.RefusalReasons;
  else if (props.type === "service")
    reasons.value = useDicts().value.ServiceRefusalReasons;
  else reasons.value = useDicts().value.EquipmentRefusalReasons;
});
</script>

<template>
  <div class="connect-init">
    <UModal v-model="model" :ui="{ rounded: 'rounded-[20px]' }">
      <div class="px-14 py-9">
        <div class="flex justify-between">
          <p class="text-xl font-bold">{{ $t("modal.cancel") }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="model = false"
          />
        </div>

        <div
          v-for="complaint_type in reasons"
          :key="complaint_type.id"
          class="flex justify-between py-3 mt-4"
        >
          <p class="text-base font-normal text-pumice-900">
            {{ complaint_type[`name${locale === "ru" ? "" : "_" + locale}`] }}
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
          @click="$emit('otherReason')"
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
