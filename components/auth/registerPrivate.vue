<script setup>
import { z } from "zod";
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainRadioConfig,
  MainSelectConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { setAuthModal, registration } = useAuth();
const { useCities, useGender } = useDict();
const { t, locale } = useI18n();

const date = ref(new Date());
const genders = useGender().value;
const cities = useCities().value;
const iinModel = ref("");

const state = reactive({
  last_name: "",
  first_name: "",
  surname: "",
  birthday: date.value.toLocaleDateString("sv-SE"),
  iin: "",
  city_id: 0,
  email: "",
  phone: "",
  gender: "",
  password: "",
});

const isPasswordVisible = ref(false);

const schema = z.object({
  email: z.string().email(t("form_verification.invalid_email")),
  last_name: z.string().min(1, t("form_verification.required")),
  first_name: z.string().min(1, t("form_verification.required")),
  birthday: z.string().min(1, t("form_verification.required")),
  iin: z
    .string()
    .min(12, t("form_verification.min_symbol", { min: 12 }))
    .max(12, t("form_verification.max_symbol", { max: 12 })),
  city_id: z.number().min(1, t("form_verification.required")),
  phone: z
    .string()
    .min(18, t("form_verification.min_symbol", { min: 18 }))
    .max(18, t("form_verification.max_symbol", { max: 18 })),
  gender: z.string().min(1, t("form_verification.required")),
  password: z.string().min(3, t("form_verification.required")),
});

const register = () => {
  const temp_state = { ...state };
  temp_state.phone = String(temp_state.phone)
    .replaceAll(/[\D]+/gi, "")
    .slice(-10);

  registration(temp_state);
};

watch(iinModel, (newf, oldf) => {
  iinModel.value = changeIinMask(newf);
  state.iin = iinModel.value;
});
watch(date, (newd, oldd) => {
  if (newd) state.birthday = newd.toLocaleDateString("sv-SE");
});
</script>
<template>
  <div class="login-form">
    <UForm :schema="schema" :state="state" class="mt-5" @submit="register">
      <UFormGroup
        :label="$t('form.last_name')"
        required
        name="last_name"
        class="rounded-2xl"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.last_name"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.last_name_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/user-gray.svg"
              alt="user"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.first_name')"
        required
        name="first_name"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.first_name"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.first_name_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/user-gray.svg"
              alt="user"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.surname')"
        name="surname"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.surname"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.surname_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/user-gray.svg"
              alt="user"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.birthday')"
        required
        name="birthday"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <Datepicker
          v-model="date"
          locale="locale"
          :cancelText="$t('button.cancel')"
          :selectText="$t('button.select')"
          :enable-time-picker="false"
        />
      </UFormGroup>

      <UFormGroup
        :label="$t('form.iin')"
        required
        name="iin"
        type="number"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="iinModel"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.iin_p')"
          maxlength="12"
        >
          <template #leading>
            <img src="~assets/svg/common/iin.svg" alt="iin" class="ps-[6px]" />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.city')"
        required
        name="city_id"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <USelectMenu
          v-model="state.city_id"
          selected-icon="i-ic-baseline-radio-button-checked"
          searchable
          :searchable-placeholder="$t('form.search_city')"
          :options="cities"
          value-attribute="id"
          :option-attribute="locale === 'ru' ? 'name' : `name_${locale}`"
          :uiMenu="RadioSelectMenuConfig()"
          :ui="MainSelectConfig()"
        >
          <template #leading>
            <img
              src="~assets/svg/common/location-input.svg"
              alt="location"
              class="ps-[6px]"
            />
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.email')"
        name="email"
        required
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.email"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.email_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/mail.svg"
              alt="mail"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.phone')"
        name="phone"
        class="mt-3"
        required
        eager-validation
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.phone"
          :value="changePhoneMask(state.phone)"
          :ui="MainInputConfig()"
          :placeholder="$t('form.phone_p')"
          maxlength="18"
        >
          <template #leading>
            <img
              src="~assets/svg/common/phone.svg"
              alt="phone"
              class="ps-[6px]"
            /> </template
        ></UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.password')"
        name="password"
        class="mt-3"
        required
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.password"
          :ui="MainInputConfig()"
          :type="isPasswordVisible ? 'text' : 'password'"
          :placeholder="$t('form.password_p')"
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

      <UFormGroup
        :label="$t('form.gender')"
        required
        name="gender"
        class="mt-3"
        :ui="MainFormGroupConfig()"
      >
        <div class="flex mt-2 gap-8">
          <div class="w-1/2" v-for="gd of genders" :key="gd.value">
            <URadio
              v-model="state.gender"
              v-bind="gd"
              :ui="MainRadioConfig()"
            />
          </div>
        </div>
      </UFormGroup>

      <UButton
        class="mt-11 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.register") }}
      </UButton>
      <ULink
        @click="setAuthModal('login')"
        class="w-full text-center font-semibold text-md text-emerald my-3"
        >{{ $t("button.login_account") }}</ULink
      >
    </UForm>
  </div>
</template>
