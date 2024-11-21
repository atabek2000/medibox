<script setup>
import { z } from "zod";
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  ActiveBadgeConfig,
  MainSelectConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { setAuthModal, entityRegistration } = useAuth();
const { useCities } = useDict();
const { t, locale } = useI18n();
const props = defineProps({
  metadata: {
    type: Array,
    default: [],
  },
});
const cities = useCities().value;
const iinModel = ref("");

const state = reactive({
  role_id: 3,
  organisation_name: "",
  bin: "",
  city_id: 0,
  address: "",
  email: "",
  contact_person: "",
  password: "",
  phone: "",
});
const isPasswordVisible = ref(false);

const schema = z.object({
  contact_person: z.string().min(1, t("form_verification.required")),
  organisation_name: z.string().min(1, t("form_verification.required")),
  bin: z
    .string()
    .min(12, t("form_verification.min_symbol", { min: 12 }))
    .max(12, t("form_verification.max_symbol", { max: 12 })),
  city_id: z.number().min(1, t("form_verification.required")),
  address: z.string().min(1, t("form_verification.required")),
  email: z.string().email(t("form_verification.invalid_email")),
  password: z.string().min(3, t("form_verification.required")),
  phone: z
    .string()
    .min(18, t("form_verification.min_symbol", { min: 18 }))
    .max(18, t("form_verification.max_symbol", { max: 18 })),
});

const register = () => {
  const temp_state = {
    ...state,
    phone: String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10),
  };
  entityRegistration(temp_state);
};

watch(iinModel, (newf, oldf) => {
  iinModel.value = changeIinMask(newf);
  state.bin = iinModel.value;
});
</script>
<template>
  <div class="login-form">
    <UButton
      icon="i-heroicons-arrow-left-20-solid"
      variant="link"
      color="black"
      class="p-0"
      @click="setAuthModal('register_tab')"
    >
    </UButton>
    <p class="font-semibold text-xl mt-5">{{ $t("auth.registration") }}</p>
    <UBadge :ui="ActiveBadgeConfig()">{{ $t("auth.seller") }}</UBadge>
    <UForm :schema="schema" :state="state" class="mt-5" @submit="register">
      <UFormGroup
        required
        :label="$t('form.organization_name')"
        name="organisation_name"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.organisation_name"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.organization_name_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/building.svg"
              alt="building"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        required
        :label="$t('form.bin')"
        name="bin"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="iinModel"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.bin_p')"
        >
          <template #leading>
            <img src="~assets/svg/common/bin.svg" alt="bin" class="ps-[6px]" />
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
        required
        :label="$t('form.address')"
        name="address"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.address"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.address_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/location.svg"
              alt="location"
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        required
        :label="$t('form.email')"
        name="email"
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
        :label="$t('form.contact_person')"
        name="contact_person"
        class="mt-3"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.contact_person"
          :ui="MainInputConfig()"
          :placeholder="$t('form.contact_person_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/user-gray.svg"
              alt="user"
              class="ps-[6px]"
            /> </template
        ></UInput>
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
          :type="isPasswordVisible ? 'text' : 'password'"
          :ui="MainInputConfig()"
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

      <UButton
        class="mt-11 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.register") }}
      </UButton>

      <UButton
        class="w-full flex justify-center"
        :ui="MainButtonConfig()"
        variant="link"
        @click="setAuthModal('login')"
      >
        {{ $t("button.login_account") }}
      </UButton>

      <p class="font-normal text-sm">
        {{ $t("content.register_agree") }}
        <nuxt-link
          :to="metadata.find((mtd) => mtd.type === 'terms_use')?.document"
          class="text-japanese-laurel"
          >{{ $t("content.terms_use") }}</nuxt-link
        >
        {{ $t("content.and") }}
        <nuxt-link
          :to="metadata.find((mtd) => mtd.type === 'privacy_policy')?.document"
          class="text-japanese-laurel"
          >{{ $t("content.privacy_policy") }}</nuxt-link
        >
      </p>
    </UForm>
  </div>
</template>
