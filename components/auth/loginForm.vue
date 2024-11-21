<script setup>
import { z } from "zod";
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
} from "~/composables/ui/useConfig";
const { setAuthModal, login } = useAuth();
const { t } = useI18n();

const phoneModel = ref("");

const schema = z.object({
  password: z.string().min(3, t("form_verification.min_symbol", { min: 3 })),
});

const state = reactive({
  phone: undefined,
  password: undefined,
});

const isPasswordVisible = ref(false);

const loginUser = () => {
  login({
    phone: String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10),
    password: state.password,
  });
};

watch(phoneModel, (newf, oldf) => {
  phoneModel.value = changePhoneMask(newf);
  state.phone = phoneModel.value;
});
</script>

<template>
  <div class="login-form">
    <p class="font-semibold text-xl">{{ $t("auth.entry") }}</p>
    <UForm :schema="schema" :state="state" class="mt-5" @submit="loginUser">
      <UFormGroup
        :label="$t('form.login')"
        name="email"
        class="rounded-2xl"
        :ui="MainFormGroupConfig()"
      >
        <UInput v-model="phoneModel" class="" :ui="MainInputConfig()">
          <template #leading>
            <img
              src="~assets/svg/common/user-gray.svg"
              alt="user-icon"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.password')"
        name="password"
        class="mt-2"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.password"
          :type="isPasswordVisible ? 'text' : 'password'"
          :ui="MainInputConfig()"
        >
          <template #leading>
            <img
              src="~assets/svg/common/lock-gray.svg"
              alt="lock"
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

      <ULink
        class="text-japanese-laurel text-xs text-end w-full font-normal"
        @click="setAuthModal('forgot')"
      >
        {{ $t("auth.forgot_password") }}</ULink
      >

      <UButton
        class="mt-11 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.login") }}
      </UButton>
      <ULink
        @click="setAuthModal('register_tab')"
        class="w-full text-center font-semibold text-md text-emerald my-3"
        >{{ $t("button.register") }}</ULink
      >
    </UForm>
  </div>
</template>
