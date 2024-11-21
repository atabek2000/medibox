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
const specialities = ref([]);

const state = reactive({
  role_id: 2,
  category_id: 0,
  city_id: 0,
  address: "",
  become_partner: true,
});

const schema = z.object({
  category_id: z.number().min(1, t("form_verification.required")),
  city_id: z.number().min(1, t("form_verification.required")),
  address: z.string().min(1, t("form_verification.required")),
});

const register = () => {
  profileEditEntity(state);
  location.reload();
};

onMounted(() => {
  const { useDicts } = useDict();
  specialities.value = useDicts().value.Category;
});
</script>
<template>
  <div class="login-form">
    <UForm :schema="schema" :state="state" @submit="register" class="mt-6">
      <UFormGroup
        required
        :label="$t('form.specialty')"
        name="category_id"
        class="rounded-2xl mt-3"
        :ui="MainFormGroupConfig()"
      >
        <USelectMenu
          v-model="state.category_id"
          selected-icon="i-ic-baseline-radio-button-checked"
          searchable
          :searchable-placeholder="$t('form.search_specialization')"
          :options="specialities"
          value-attribute="id"
          :option-attribute="locale === 'ru' ? 'name' : `name_${locale}`"
          :uiMenu="RadioSelectMenuConfig()"
          :ui="MainSelectConfig()"
        >
          <template #leading>
            <img
              src="~assets/svg/common/circle-intersect.svg"
              alt="circle"
              class="ps-[6px]"
            />
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup
        required
        :label="$t('form.city')"
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
              src="~assets/svg/common/address.svg"
              alt="address"
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
        {{ $t("button.send_moderate") }}
      </UButton>
    </UForm>
  </div>
</template>
