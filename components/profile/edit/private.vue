<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainSelectConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
import { z } from "zod";
const { useCities } = useDict();
const { profileEdit } = useAuth();
const { t, locale } = useI18n();

const props = defineProps({
  user: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["setIsEdit"]);

const cities = useCities().value;
const date = ref(new Date(props.user.birthday));
const phoneModel = ref(changePhoneMask("7" + props.user.phone));
const iinModel = ref(changeIinMask(props.user.iin));

const state = reactive({
  last_name: props.user.last_name,
  first_name: props.user.first_name,
  surname: props.user.surname,
  birthday: date.value.toLocaleDateString("sv-SE"),
  iin: changeIinMask(props.user.iin),
  city_id: props.user?.city?.id,
  email: props.user.email,
  phone: changePhoneMask("7" + props.user.phone),
});

const schema = z.object({
  email: z.string().email().min(3, t("form_verification.required")),
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
});

const profile_edit = async () => {
  state.phone = String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10);
  await profileEdit(state);
  emit("setIsEdit", false);
};
watch(phoneModel, (newf, oldf) => {
  phoneModel.value = changePhoneMask(newf);
  state.phone = phoneModel.value;
});
watch(iinModel, (newf, oldf) => {
  iinModel.value = changeIinMask(newf);
  state.iin = iinModel.value;
});
watch(date, (newd, oldd) => {
  state.birthday = newd.toLocaleDateString("sv-SE");
});
</script>

<template>
  <div class="profile-edit-block">
    <UForm
      :schema="schema"
      :state="state"
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] xl:gap-x-[5%] gap-y-3 w-full"
      @submit="profile_edit"
    >
      <UFormGroup
        :label="$t('form.last_name')"
        required
        name="last_name"
        class="rounded-2xl w-full md:w-[48%] xl:w-[30%]"
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
              alt=""
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.first_name')"
        required
        name="first_name"
        class="rounded-2xl w-full md:w-[48%] xl:w-[30%]"
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
              alt=""
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.surname')"
        name="surname"
        class="rounded-2xl w-full md:w-[48%] xl:w-[30%]"
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
              alt=""
              class="ps-[6px]"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.birthday')"
        required
        name="birthday"
        class="rounded-2xl w-full md:w-[48%] xl:w-[30%]"
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
        class="rounded-2xl w-full md:w-[48%] xl:w-[30%]"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="iinModel"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.iin_p')"
        >
          <template #leading>
            <img src="~assets/svg/common/iin.svg" alt="" class="ps-[6px]" />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.city')"
        required
        name="city_id"
        class="rounded-2xl w-full md:w-[48%] xl:w-[30%]"
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
              alt=""
              class="ps-[6px]"
            />
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.email')"
        name="email"
        required
        class="rounded-2xl w-full md:w-[48%] xl:w-[30%]"
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="state.email"
          class=""
          :ui="MainInputConfig()"
          :placeholder="$t('form.email_p')"
        >
          <template #leading>
            <img src="~assets/svg/common/mail.svg" alt="" class="ps-[6px]" />
          </template>
        </UInput>
      </UFormGroup>

      <UFormGroup
        :label="$t('form.phone')"
        name="phone"
        class="w-full md:w-[48%] xl:w-[30%]"
        required
        eager-validation
        :ui="MainFormGroupConfig()"
      >
        <UInput
          v-model="phoneModel"
          :ui="MainInputConfig()"
          :placeholder="$t('form.phone_p')"
        >
          <template #leading>
            <img
              src="~assets/svg/common/phone.svg"
              alt=""
              class="ps-[6px]"
            /> </template
        ></UInput>
      </UFormGroup>

      <UButton
        class="mt-11 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.save") }}
      </UButton>
    </UForm>
  </div>
</template>
