<script setup>
import { z } from "zod";
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainSelectConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { profileEditEntity } = useAuth();
const { useCities } = useDict();
const { t, locale } = useI18n();

const cities = useCities().value;
const phoneModel = ref("");
const iinModel = ref("");

const state = reactive({
  role_id: 3,
  organisation_name: "",
  bin: "",
  city_id: 0,
  address: "",
  contact_person: "",
  become_partner: true,
});

const schema = z.object({
  organisation_name: z.string().min(1, t("form_verification.required")),
  bin: z
    .string()
    .min(12, t("form_verification.min_symbol", { min: 12 }))
    .max(12, t("form_verification.max_symbol", { max: 12 })),
  city_id: z.number().min(1, t("form_verification.required")),
  address: z.string().min(1, t("form_verification.required")),
});

const register = async () => {
  await profileEditEntity(state);
  location.reload();
};

watch(phoneModel, (newf, oldf) => {
  phoneModel.value = changePhoneMask(newf);
  state.phone = phoneModel.value;
});

watch(iinModel, (newf, oldf) => {
  iinModel.value = changeIinMask(newf);
  state.bin = iinModel.value;
});
</script>
<template>
  <div class="login-form">
    <UForm :schema="schema" :state="state" class="mt-6" @submit="register">
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

      <UButton
        class="mt-11 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.send_moderate") }}
      </UButton>
    </UForm>
  </div>
</template>
