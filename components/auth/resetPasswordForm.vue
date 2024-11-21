<script setup>
import { z } from "zod";
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
} from "~/composables/ui/useConfig";
const { setAuthModal, useResetToken, changePassword } = useAuth();
if (!useResetToken().value) {
  setAuthModal("forgot");
}
const { t } = useI18n();

const schema = z.object({
  password: z.string().min(1, t("form_verification.required")),
});
const isPasswordVisible = ref(false);

const state = reactive({
  password: undefined,
});

const send = () => {
  changePassword(state.password);
};
</script>
<template>
  <div class="forgot-form">
    <UButton
      icon="i-heroicons-arrow-left-20-solid"
      variant="link"
      color="black"
      class="p-0"
      @click="setAuthModal('forgot')"
    >
    </UButton>
    <p class="font-semibold text-xl">{{ $t("auth.password_recovery") }}</p>
    <p class="font-normal text-sm">
      {{ $t("auth.type_new_pass") }}
    </p>
    <UForm :schema="schema" :state="state" class="mt-5" @submit="send">
      <div class="flex justify-between">
        <UFormGroup
          :label="$t('form.new_pass')"
          name="password"
          class="rounded-2xl w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.password"
            :placeholder="$t('form.new_pass_p')"
            class=""
            :type="isPasswordVisible ? 'text' : 'password'"
            :ui="MainInputConfig()"
          >
            <template #leading>
              <img
                src="~assets/svg/common/mail.svg"
                alt="mail"
                class="ps-[6px]"
              />
            </template>
            <template #trailing>
              <UButton
                v-if="!isPasswordVisible"
                v-show="q !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-eye-slash-16-solid"
                :padded="false"
                @click="isPasswordVisible = true"
              />
              <UButton
                v-else
                v-show="q !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-eye-16-solid"
                :padded="false"
                @click="isPasswordVisible = false"
              />
            </template>
          </UInput>
        </UFormGroup>
      </div>
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
