<script setup>
import { z } from "zod";

import { MainButtonConfig } from "~/composables/ui/useConfig";
const { t } = useI18n();
const model = defineModel({ required: true });
const props = defineProps({
  phone: {
    type: String,
    default: "",
  },
});

const state = reactive({
  text: "",
});

const schema = z.object({
  text: z.string().min(1, t("form_verification.required")),
});

const emit = defineEmits(["showModal", "closeModal", "setComplaintText"]);
const onSubmit = () => {
  emit("setComplaintText", state.text);
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
            @click="$emit('closeModal', 'complain_form')"
          />
        </div>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup name="text">
            <UTextarea
              class="mt-4"
              v-model="state.text"
              :ui="{ rounded: 'rounded-xl' }"
              maxlength="255"
              :placeholder="$t('form.review_p')"
            />
          </UFormGroup>
          <p class="w-full text-end text-pumice font-normal text-xs mt-2">
            {{ state.text.length }}/255 {{ $t("form.symbols") }}
          </p>
          <UButton
            type="submit"
            class="w-full mt-4 flex justify-center"
            :disabled="state.text.length === 0"
            :ui="MainButtonConfig()"
            >{{ $t("button.send") }}</UButton
          >
        </UForm>
      </div>
    </UModal>
  </div>
</template>
