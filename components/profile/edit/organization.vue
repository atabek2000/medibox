<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainSelectConfig,
  MainSelectMenuConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
import { z } from "zod";
const { useCities, useDicts } = useDict();
const { profileEditEntity } = useAuth();
const { t, locale } = useI18n();

const props = defineProps({
  user: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["setIsEdit"]);

const cities = useCities().value;
const organization_types = useDicts().value.OrganisationType;
const sub_organisation_types = useDicts().value.SubOrganisationType;
const dentistry_types = useDicts().value.DentistryTypes;
const date = ref(new Date(props.user.birthday));

const state = reactive({
  organisation_type_id: props.user.organisation_type?.id,
  sub_organisation_type_id:
    props.user.sub_organisation_types &&
    props.user.sub_organisation_types.length > 0
      ? props.user.sub_organisation_types.map((st) => st.id)
      : [],
  dentistry_type_id:
    props.user.dentistry_types && props.user.dentistry_types.length > 0
      ? props.user.dentistry_types.map((st) => st.id)
      : [],
  organisation_name: props.user.organisation_name,
  bin: props.user.bin,
  city_id: props.user.city.id,
  address: props.user.address,
  email: props.user.email,
  contact_person: props.user.contact_person,
  whatsapp_phone: changePhoneMask("7" + props.user.whatsapp_phone),
  phone: changePhoneMask("7" + props.user.phone),
  phones:
    props.user.phones.length > 0
      ? props.user.phones.map((ph) => {
          return { id: ph.id, phone: changePhoneMask("7" + ph.phone) };
        })
      : [],
  long: props.user.long,
  lat: props.user.lat,
});

const marker = ref({ lat: props.user.lat, lng: props.user.long });

const schema = z.object({
  organisation_name: z.string().min(1, t("form_verification.required")),
  bin: z
    .string()
    .min(12, t("form_verification.min_symbol", { min: 12 }))
    .max(12, t("form_verification.max_symbol", { max: 12 })),
  city_id: z.number().min(1, t("form_verification.required")),
  address: z.string().min(1, t("form_verification.required")),
  email: z.string().email(t("form_verification.invalid_email")),
  whatsapp_phone: z
    .string()
    .min(18, t("form_verification.min_symbol", { min: 18 })),
});

const phone_error = ref(false);

const profile_edit = async () => {
  for (const phone of state.phones) {
    if (phone.phone.length < 18 || state.phone.length < 18) {
      phone_error.value = true;
      return;
    }
  }
  phone_error.value = false;

  if (!state.long) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.select_map_point"),
    });
    return;
  }

  const temp_state = { ...state };

  temp_state.whatsapp_phone = String(temp_state.whatsapp_phone)
    .replaceAll(/[\D]+/gi, "")
    .slice(-10);
  temp_state.phones = temp_state.phones.map((ph) =>
    String(ph.phone).replaceAll(/[\D]+/gi, "").slice(-10)
  );
  temp_state.phone = String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10);
  await profileEditEntity(temp_state);
  emit("setIsEdit", false);
};

const addPhone = () => {
  state.phones.push({ id: Math.random(), phone: "" });
};

const deletePhone = (id) => {
  state.phones = state.phones.filter((ph) => ph.id !== id);
};
watch(date, (newd, oldd) => {
  state.birthday = newd.toLocaleDateString("sv-SE");
});
watch(marker, (newV, oldV) => {
  state.lat = newV.lat;
  state.long = newV.lng;
});
</script>

<template>
  <div class="profile-edit-block">
    <UForm
      :schema="schema"
      :state="state"
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] gap-y-3 w-full"
      @submit="profile_edit"
    >
      <div class="w-full md:w-[48%]">
        <UFormGroup
          :label="$t('form.organization_name')"
          required
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
          :label="$t('form.org_type')"
          required
          name="organisation_type_id"
          class="rounded-2xl mt-3"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.organisation_type_id"
            selected-icon="i-ic-baseline-radio-button-checked"
            :options="organization_types"
            value-attribute="id"
            :option-attribute="`name${locale === 'ru' ? '' : '_' + locale}`"
            :uiMenu="RadioSelectMenuConfig()"
            :ui="MainSelectConfig()"
          >
            <template #leading>
              <img
                src="~assets/svg/common/check-done.svg"
                alt="check"
                class="ps-[6px]"
              />
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          v-if="state.organisation_type_id === 1"
          :label="$t('form.sub_org_type')"
          required
          name="organisation_type_id"
          class="rounded-2xl mt-3"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.sub_organisation_type_id"
            :options="sub_organisation_types"
            value-attribute="id"
            :option-attribute="`name${locale === 'ru' ? '' : '_' + locale}`"
            :uiMenu="MainSelectMenuConfig()"
            :ui="MainSelectConfig()"
            multiple
          >
            <template #label>
              <template v-if="state.sub_organisation_type_id.length">
                <span class="flex items-center">
                  <span
                    v-for="(label, index) of state.sub_organisation_type_id"
                    :key="label"
                  >
                    {{
                      sub_organisation_types.filter((so) => so.id === label)[0][
                        `name${locale === "ru" ? "" : "_" + locale}`
                      ]
                    }}{{
                      index === state.sub_organisation_type_id.length - 1
                        ? ""
                        : ",&nbsp;"
                    }}
                    <span></span>
                  </span>
                </span>
              </template>
              <template v-else>
                <span class="text-gray-500 dark:text-gray-400 truncate">{{
                  $t("form.sub_org_type")
                }}</span>
              </template>
            </template>
            <template #leading>
              <img
                src="~assets/svg/common/check-done.svg"
                alt="check"
                class="ps-[6px]"
              />
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          v-else
          :label="$t('form.sub_org_type')"
          required
          name="organisation_type_id"
          class="rounded-2xl mt-3"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.dentistry_type_id"
            :options="dentistry_types"
            value-attribute="id"
            :option-attribute="`name${locale === 'ru' ? '' : '_' + locale}`"
            :uiMenu="MainSelectMenuConfig()"
            :ui="MainSelectConfig()"
            multiple
          >
            <template #label>
              <template v-if="state.dentistry_type_id.length">
                <span class="flex items-center">
                  <span
                    v-for="(label, index) of state.dentistry_type_id"
                    :key="label"
                  >
                    {{
                      dentistry_types.filter((so) => so.id === label)[0][
                        `name${locale === "ru" ? "" : "_" + locale}`
                      ]
                    }}{{
                      index === state.dentistry_type_id.length - 1
                        ? ""
                        : ",&nbsp;"
                    }}
                    <span></span>
                  </span>
                </span>
              </template>
              <template v-else>
                <span class="text-gray-500 dark:text-gray-400 truncate">{{
                  $t("form.sub_org_type")
                }}</span>
              </template>
            </template>
            <template #leading>
              <img
                src="~assets/svg/common/check-done.svg"
                alt="check"
                class="ps-[6px]"
              />
            </template>
          </USelectMenu>
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
                alt=""
                class="ps-[6px]"
              />
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          required
          :label="$t('form.bin')"
          name="bin"
          class="rounded-2xl mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.bin"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.bin_p')"
          >
            <template #leading>
              <img src="~assets/svg/common/bin.svg" alt="" class="ps-[6px]" />
            </template>
          </UInput>
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
      </div>

      <div class="w-full md:w-[48%]">
        <UFormGroup
          :label="$t('form.address')"
          required
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
                src="~assets/svg/common/user-gray.svg"
                alt="user"
                class="ps-[6px]"
              />
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.contact_person')"
          name="contact_person"
          class="rounded-2xl mt-3"
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
                alt=""
                class="ps-[6px]"
              /> </template
          ></UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.phone')"
          name="phone"
          class="rounded-2xl mt-3"
          required
          eager-validation
          :ui="MainFormGroupConfig()"
          :error="phone_error && $t('form.phone_error')"
        >
          <UInput
            v-model="state.phone"
            :value="changePhoneMask(state.phone)"
            :ui="MainInputConfig()"
            :placeholder="$t('form.phone_p')"
            maxlength="18"
            class="mb-2"
          >
            <template #leading>
              <img src="~assets/svg/common/phone.svg" alt="" class="ps-[6px]" />
            </template>
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                icon="i-heroicons-plus-16-solid"
                :padded="false"
                @click="addPhone"
              />
            </template>
          </UInput>
          <UInput
            v-for="(phone, index) in state.phones"
            :key="phone"
            v-model="state.phones[index].phone"
            :value="changePhoneMask(state.phones[index].phone)"
            :ui="MainInputConfig()"
            :placeholder="$t('form.phone_p')"
            maxlength="18"
            class="mb-2"
          >
            <template #leading>
              <img src="~assets/svg/common/phone.svg" alt="" class="ps-[6px]" />
            </template>
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                icon="i-heroicons-minus-16-solid"
                :padded="false"
                @click="deletePhone(phone.id)"
              />
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.phone_whatsapp')"
          name="whatsapp_phone"
          class="rounded-2xl mt-3"
          required
          eager-validation
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.whatsapp_phone"
            :value="changePhoneMask(state.whatsapp_phone)"
            :ui="MainInputConfig()"
            :placeholder="$t('form.phone_whatsapp_p')"
            maxlength="18"
            minlength="18"
            class="mb-2"
          >
            <template #leading>
              <img src="~assets/svg/common/phone.svg" alt="" class="ps-[6px]" />
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup class="rounded-2xl mt-3"></UFormGroup>
        <UFormGroup
          :label="$t('form.select_map_point')"
          name="map"
          class="rounded-2xl mt-3"
          :ui="MainFormGroupConfig()"
        >
          <MapSelect v-model="marker" class="mt-5"
        /></UFormGroup>
      </div>

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
