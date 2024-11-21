<script setup>
import { z } from "zod";

import {
  TransparentButtonConfig,
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  RadioSelectMenuConfig,
  MainSelectConfig,
} from "~/composables/ui/useConfig";
const cities = ref([]);
const emit = defineEmits(["addAddress"]);
const isOpen = ref(false);
const showModal = () => {
  isOpen.value = true;
};

const { t, locale } = useI18n();

const schema = z.object({
  city_id: z.number().min(1, t("form_verification.required")),
  street: z.string().min(1, t("form_verification.required")),
  house: z.string().min(1, t("form_verification.required")),
});

const state = reactive({
  city_id: 0,
  street: "",
  house: "",
  entrance: "",
  floor: "",
  flat: "",
});

const addAddress = () => {
  if (state.entrance === "") state.entrance = undefined;
  if (state.floor === "") state.floor = undefined;
  if (state.flat === "") state.flat = undefined;
  emit("addAddress", state);
  isOpen.value = false;
};

onMounted(() => {
  const { useCities } = useDict();
  cities.value = useCities().value;
});
</script>
<template>
  <div class="add-address-modal">
    <UButton class="w-full" :ui="TransparentButtonConfig()" @click="showModal"
      >+ {{ $t("address.add_new") }}</UButton
    >

    <UModal v-model="isOpen">
      <div class="p-8">
        <div class="modal-title flex justify-between">
          <p class="font-semibold text-xl">{{ $t("address.add") }}</p>
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
            class="mt-5"
            @submit="addAddress"
          >
            <UFormGroup
              :label="$t('form.city')"
              required
              name="city_id"
              class="rounded-2xl"
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
              :label="$t('form.street')"
              name="street"
              class="mt-2"
              required
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
                name="house"
                required
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
