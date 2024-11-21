<script setup>
import { z } from "zod";
import {
  TransparentButtonConfig,
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
} from "~/composables/ui/useConfig";
const { t } = useI18n();

const emit = defineEmits(["addCard"]);

const isOpen = ref(false);

const showModal = () => {
  isOpen.value = true;
};

const schema = z.object({
  number: z
    .string()
    .min(19, t("form_verification.min_symbol", { min: 19 }))
    .max(19, t("form_verification.max_symbol", { max: 19 })),
  term: z.string().min(1, t("form_verification.required")),
  cvv: z
    .string()
    .min(3, t("form_verification.min_symbol", { min: 3 }))
    .max(3, t("form_verification.max_symbol", { max: 3 })),
});

const state = reactive({
  number: "",
  term: "",
  cvv: "",
});

const onChangeCardNumber = () => {
  state.number = changeCardMask(state.number);
};

const addCard = () => {
  emit("addCard", state);
};
</script>
<template>
  <div class="add-address-modal">
    <!-- <UButton class="w-full" 
    :ui="TransparentButtonConfig()" 
    @click="showModal"
      >+ {{ $t("button.add_card") }}</UButton
    > -->
    <!-- <UButton class="w-full" :ui="TransparentButtonConfig()"
      >+ {{ $t("button.add_card") }}</UButton
    > -->

    <UModal v-model="isOpen">
      <div class="p-8">
        <div class="modal-title flex justify-between">
          <p class="font-semibold text-xl">{{ $t("button.add_card") }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="() => (isOpen = false)"
          />
        </div>
        <div class="modal-body">
          <UForm :schema="schema" :state="state" class="mt-5">
            <UFormGroup
              :label="$t('form.card_number')"
              name="number"
              class="rounded-2xl"
              :ui="MainFormGroupConfig()"
            >
              <UInput
                v-model="state.number"
                :value="changeCardMask(state.number)"
                class=""
                :ui="MainInputConfig()"
                :placeholder="$t('form.card_number')"
                maxlength="19"
              />
            </UFormGroup>

            <div class="flex gap-2">
              <UFormGroup
                :label="$t('form.card_term')"
                name="term"
                class="mt-2 w-1/2"
                :ui="MainFormGroupConfig()"
              >
                <UInput
                  v-model="state.term"
                  :ui="MainInputConfig()"
                  :placeholder="$t('form.card_term_p')"
                />
              </UFormGroup>
              <UFormGroup
                :label="$t('form.card_cvv')"
                name="cvv"
                class="mt-2 w-1/2"
                :ui="MainFormGroupConfig()"
              >
                <UInput
                  v-model="state.cvv"
                  :ui="MainInputConfig()"
                  :placeholder="$t('form.card_cvv_p')"
                  maxlength="3"
                />
              </UFormGroup>
            </div>

            <UButton
              class="mt-5 w-full flex justify-center"
              :ui="MainButtonConfig()"
              @click="addCard"
            >
              {{ $t("button.save") }}
            </UButton>
          </UForm>
        </div>
      </div>
    </UModal>
  </div>
</template>
