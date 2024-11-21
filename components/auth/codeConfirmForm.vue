<script setup>
import { z } from "zod";
import { MainButtonConfig } from "~/composables/ui/useConfig";
const {
  setAuthModal,
  useResetToken,
  verifyResetCode,
  useResetPhone,
  resetPassword,
} = useAuth();
if (!useResetToken().value) {
  setAuthModal("forgot");
}

const state = reactive({
  phone: undefined,
});

const code_arr = reactive({
  code_1: null,
  code_2: null,
  code_3: null,
  code_4: null,
});

const code_refs = ref([]);

const sendCode = () => {
  verifyResetCode(
    `${code_arr.code_1}${code_arr.code_2}${code_arr.code_3}${code_arr.code_4}`
  );
};

const changeInput = (event, input) => {
  if (input < 4 && event.target.value) {
    code_refs.value[input].input.focus();
  } else if (input >= 4 && event.target.value) {
    sendCode();
  }
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
    <p class="font-semibold text-xl">{{ $t("auth.code_confirm") }}</p>
    <p class="font-normal text-sm">
      {{ $t("auth.type_code_from_wp") }}
      {{ changePhoneMask("7" + useResetPhone().value) }}.
    </p>
    <UForm :schema="schema" :state="state" class="mt-5">
      <div class="flex justify-between">
        <UFormGroup
          v-for="code in 4"
          :key="code"
          name="phone"
          class="rounded-2xl"
        >
          <UInput
            v-model="code_arr[`code_${code}`]"
            class="w-16 text-center"
            maxlength="1"
            ref="code_refs"
            @keyup="changeInput($event, code)"
            :ui="{
              size: {
                '2xs': 'text-xs',
                xs: 'text-xs',
                sm: 'text-[40px]',
              },
              padding: {
                '2xs': 'px-2 py-1',
                xs: 'px-2.5 py-1.5',
                sm: 'px-4 py-1.5',
                md: 'px-4 py-2',
                lg: 'px-3.5 py-2.5',
                xl: 'px-3.5 py-2.5',
              },
            }"
          >
          </UInput>
        </UFormGroup>
      </div>
      <UButton
        class="mt-11 w-full flex justify-center"
        :ui="MainButtonConfig()"
        @click="sendCode()"
      >
        {{ $t("button.send") }}
      </UButton>
      <ULink
        class="w-full text-center font-semibold text-md text-japanese-laurel my-3"
        @click="resetPassword(useResetPhone().value)"
        >{{ $t("button.resend") }}
      </ULink>
    </UForm>
  </div>
</template>
