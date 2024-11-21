<script setup>
import { z } from "zod";
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
} from "~/composables/ui/useConfig";
const { t } = useI18n();

const { setAuthModal, resetPassword } = useAuth();
const schema = z.object({
  phone: z
    .string()
    .min(18, t("form_verification.min_symbol", { min: 18 }))
    .max(18, t("form_verification.max_symbol", { max: 18 })),
  // email: z.string().email(t("form_verification.required")),
});

const state = reactive({
  // email: undefined,
  phone: undefined,
});

const reset = () => {
  resetPassword(String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10));
};
</script>
<template>
  <div class="forgot-form">
    <UButton
      icon="i-heroicons-arrow-left-20-solid"
      variant="link"
      color="black"
      class="p-0"
      @click="setAuthModal('login')"
    >
    </UButton>
    <p class="font-semibold text-xl">{{ $t("auth.forgot_pass") }}</p>
    <!-- <p class="font-normal text-sm">
      {{ $t("auth.type_your_email") }}
    </p> -->
    <p class="font-normal text-sm">
      {{ $t("auth.type_your_phone") }}
    </p>
    <!-- <UForm :schema="schema" :state="state" class="mt-5" @submit="reset">
      <UFormGroup
        :label="$t('form.email')"
        name="email"
        class="rounded-2xl"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.email"
          :placeholder="$t('form.email_p')"
          class=""
          :ui="MainInputConfig()"
        >
          <template #leading>
            <img
              src="~assets/svg/common/mail.svg"
              alt="mail"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup> -->
    <UForm :schema="schema" :state="state" class="mt-5" @submit="reset">
      <UFormGroup
        :label="$t('form.phone')"
        name="phone"
        class="rounded-2xl"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.phone"
          :value="changePhoneMask(state.phone)"
          :placeholder="$t('form.phone_p')"
          class=""
          :ui="MainInputConfig()"
        >
          <template #leading>
            <img
              src="~assets/svg/common/phone.svg"
              alt="phone"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>
      <UButton
        class="mt-11 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.send") }}
      </UButton>
    </UForm>
  </div>
</template>
