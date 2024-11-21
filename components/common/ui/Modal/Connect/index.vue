<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { t } = useI18n();
const { startLoading, stopLoading } = useLoader();
const props = defineProps({
  phone: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  phones: {
    type: Array,
    default: [],
  },
  whatsapp_phone: {
    type: String,
    default: "",
  },
});

const isInitVisible = ref(false);
const isManagedVisible = ref(false);
const isComplainVisible = ref(false);
const isComplainFormVisible = ref(false);

const setComplaintType = async (val) => {
  isComplainVisible.value = false;
  startLoading();
  await useFetchApi(props.url, {
    method: "POST",
    body: {
      ...(props.url.includes("equipments")
        ? { equipment_complaint_type_id: val }
        : undefined),
      ...(props.url.includes("medicine")
        ? { medicine_complaint_type_id: val }
        : undefined),
      ...(props.url.includes("service")
        ? { service_complaint_type_id: val }
        : undefined),
      ...(props.url.includes("premise")
        ? { type_complainat_id: val }
        : undefined),
    },
    async onResponse({ response }) {
      stopLoading();
      if (response.ok)
        useToast().add({
          title: t("toast.success"),
          description: t("toast.success_saved"),
        });
    },
  });
};

const setComplaintText = async (val) => {
  isComplainFormVisible.value = false;
  startLoading();
  await useFetchApi(props.url, {
    method: "POST",
    body: {
      other: val,
    },
    async onResponse({ response }) {
      stopLoading();
      if (response.ok)
        useToast().add({
          title: t("toast.success"),
          description: t("toast.success_saved"),
        });
    },
  });
};

const showModal = (modal_type) => {
  if (modal_type === "init") {
    isInitVisible.value = true;
  } else if (modal_type === "managed") {
    isInitVisible.value = false;
    isManagedVisible.value = true;
  } else if (modal_type === "complain") {
    isManagedVisible.value = false;
    isComplainVisible.value = true;
  } else if (modal_type === "complain_form") {
    isComplainVisible.value = false;
    isComplainFormVisible.value = true;
  }
};

const closeModal = (modal_type) => {
  if (modal_type === "init") {
    isInitVisible.value = false;
  } else if (modal_type === "managed") {
    isManagedVisible.value = false;
  } else if (modal_type === "complain") {
    isComplainVisible.value = false;
  } else if (modal_type === "complain_form") {
    isComplainFormVisible.value = false;
  }
};
</script>

<template>
  <div class="connect-modal">
    <UButton
      @click="showModal('init')"
      class="w-full"
      :ui="TransparentButtonConfig()"
      >{{ $t("button.connect") }}</UButton
    >

    <CommonUiModalConnectInit
      v-model="isInitVisible"
      :phone="phone"
      :phones="phones"
      :whatsapp_phone="whatsapp_phone"
      :url="url"
      @showModal="showModal"
      @closeModal="closeModal"
    />
    <CommonUiModalConnectManaged
      v-model="isManagedVisible"
      :phone="phone"
      @showModal="showModal"
      @closeModal="closeModal"
    />

    <CommonUiModalConnectComplain
      v-model="isComplainVisible"
      @showModal="showModal"
      @closeModal="closeModal"
      @setComplaintType="setComplaintType"
    />

    <CommonUiModalConnectComplainForm
      v-model="isComplainFormVisible"
      @showModal="showModal"
      @closeModal="closeModal"
      @setComplaintText="setComplaintText"
    />
  </div>
</template>
