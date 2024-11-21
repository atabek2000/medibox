<script setup>
import { z } from "zod";

import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  RadioSelectMenuConfig,
  MainSelectConfig,
} from "~/composables/ui/useConfig";
const { t, locale } = useI18n();
const cities = ref([]);
const emit = defineEmits(["editAddress"]);
const props = defineProps({
  address: {
    type: Object,
    default: {
      id: "",
      city: "",
      street: "",
      house: "",
      entrance: "",
      floor: "",
      flat: "",
    },
  },
});
const isOpen = defineModel({ required: true });

const schema = z.object({
  city: z.string().min(1, t("form_verification.required")),
  street: z.string().min(1, t("form_verification.required")),
  house: z.string().min(1, t("form_verification.required")),
});

const state = reactive({
  id: props.address.id,
  city: String(props.address.city),
  street: String(props.address.street),
  house: String(props.address.house),
  entrance: String(props.address.entrance),
  floor: String(props.address.floor),
  flat: String(props.address.flat),
});

const editAddress = () => {
  if (state.entrance === "") state.entrance = undefined;
  if (state.floor === "") state.floor = undefined;
  if (state.flat === "") state.flat = undefined;
  emit("editAddress", state);
  isOpen.value = false;
};

watch(isOpen, () => {
  state.id = String(props.address.id);
  state.city = String(props.address.city);
  state.street = String(props.address.street);
  state.house = String(props.address.house);
  state.entrance = String(props.address.entrance);
  state.floor = String(props.address.floor);
  state.flat = String(props.address.flat);
});

onMounted(() => {
  const { useCities } = useDict();
  cities.value = useCities().value;
});
</script>
<template>
  <div class="add-address-modal">
    <UModal v-model="isOpen">
      <div class="p-8">
        <div class="modal-title flex justify-between">
          <p class="font-semibold text-xl">{{ $t("address.edit") }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="() => (isOpen = false)"
          />
        </div>
        <div class="modal-body">
          <UForm
            :schema="schema"
            :state="state"
            required
            class="mt-5"
            @submit="editAddress"
          >
            <UFormGroup
              :label="$t('form.city')"
              required
              name="name"
              class="rounded-2xl"
              :ui="MainFormGroupConfig()"
            >
              <USelectMenu
                v-model="state.city"
                selected-icon="i-ic-baseline-radio-button-checked"
                :options="cities"
                value-attribute="name"
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
              :label="$t('form.street')"
              name="street"
              required
              class="mt-2"
              :ui="MainFormGroupConfig()"
            >
              <UInput
                v-model="state.street"
                :ui="MainInputConfig()"
                :placeholder="$t('form.street_p')"
              />
            </UFormGroup>

            <div class="flex gap-2">
              <UFormGroup
                :label="$t('form.home')"
                required
                name="house"
                class="mt-2 w-1/2"
                :ui="MainFormGroupConfig()"
              >
                <UInput
                  v-model="state.house"
                  :ui="MainInputConfig()"
                  :placeholder="$t('form.home_p')"
                />
              </UFormGroup>
              <UFormGroup
                :label="$t('form.entrance')"
                name="entrance"
                class="mt-2 w-1/2"
                :ui="MainFormGroupConfig()"
              >
                <UInput
                  v-model="state.entrance"
                  :ui="MainInputConfig()"
                  :placeholder="$t('form.entrance_p')"
                />
              </UFormGroup>
            </div>
            <div class="flex gap-2">
              <UFormGroup
                :label="$t('form.floor')"
                name="floor"
                class="mt-2 w-1/2"
                :ui="MainFormGroupConfig()"
              >
                <UInput
                  v-model="state.floor"
                  :ui="MainInputConfig()"
                  :placeholder="$t('form.floor_p')"
                />
              </UFormGroup>
              <UFormGroup
                :label="$t('form.flat')"
                name="flat"
                class="mt-2 w-1/2"
                :ui="MainFormGroupConfig()"
              >
                <UInput
                  v-model="state.flat"
                  :ui="MainInputConfig()"
                  :placeholder="$t('form.flat_p')"
                />
              </UFormGroup>
            </div>

            <UButton
              class="mt-5 w-full flex justify-center"
              :ui="MainButtonConfig()"
              type="submit"
            >
              {{ $t("button.save") }}
            </UButton>
          </UForm>
        </div>
      </div>
    </UModal>
  </div>
</template>
