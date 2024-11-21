<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainCheckboxConfig,
  MainSelectConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { t } = useI18n();
import { z } from "zod";
const { useDuration } = useDict();
const { startLoading, stopLoading } = useLoader();
const route = useRoute();
const props = defineProps({
  equipment: {
    type: Object,
    default: {},
  },
});

const state = reactive({
  price: parseInt(props.equipment?.equipment?.price).toString(),
  duration: props.equipment?.equipment?.duration,
  type: props.equipment?.equipment?.type,
  is_acquainted: false,
});

const schema = z.object({
  price: z.string().min(1, t("form_verification.required")),
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

const onAddProduct = async () => {
  const form_data = new FormData();
  form_data.append("price", state.price.replaceAll(/[\D]+/gi, ""));
  if (state.type === "rent") form_data.append("duration", state.duration);
  form_data.append("is_acquainted", 1);
  startLoading();
  const res = await useFetchApi(
    `equipments/edit-equipment/${route.params.id}`,
    {
      method: "POST",
      body: form_data,
      headers: {
        Accept: "application/json",
      },
      onResponse() {
        stopLoading();
      },
    }
  );

  if (res) {
    useRouter().push("/profile/equipment");
  }
};

const logoutConfirmVisible = ref(false);

const deleteProduct = async () => {
  startLoading();
  const res = await useFetchApi(
    `equipments/delete-equipment/${route.params.id}`,
    {
      method: "DELETE",
      onResponse() {
        stopLoading();
      },
    }
  );
  if (res) {
    useRouter().push("/profile/equipment");
  }
};
</script>

<template>
  <div class="w-full">
    <UForm
      :schema="schema"
      :state="state"
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] gap-y-3 w-full"
      @submit="onAddProduct"
    >
      <div class="w-full md:w-[48%]">
        <UFormGroup
          :label="$t('form.price')"
          name="price"
          class="rounded-2xl mt-3 w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.price"
            :value="changePriceMask(state.price)"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.price_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          v-if="state.type === 'rent'"
          :label="$t('form.rent_duration')"
          name="area_sale_id"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.duration"
            selected-icon="i-ic-baseline-radio-button-checked"
            :options="useDuration().value"
            value-attribute="value"
            option-attribute="label"
            :uiMenu="RadioSelectMenuConfig()"
            :ui="MainSelectConfig()"
          >
          </USelectMenu>
        </UFormGroup>
      </div>

      <div class="w-full flex items-center mt-10">
        <UFormGroup
          name="is_acquainted"
          class="rounded-2xl mt-3 flex"
          :ui="MainFormGroupConfig()"
        >
          <UCheckbox
            :ui="MainCheckboxConfig()"
            v-model="state.is_acquainted"
            class="text-base w-full"
          >
            <template #label>
              <div class="flex">
                {{ $t("content.learn") }} <ProfileRoomConditionsModal />
              </div>
            </template>
          </UCheckbox>
        </UFormGroup>
      </div>
      <UButton
        class="mt-4 w-full flex justify-center"
        :ui="MainButtonConfig()"
        type="submit"
      >
        {{ $t("button.save") }}
      </UButton>
      <UButton
        @click="logoutConfirmVisible = true"
        variant="link"
        color="valencia"
        class="w-full flex justify-center text-base font-semibold"
        >{{ $t("button.delete_equipment") }}</UButton
      >
    </UForm>
    <CommonUiModalConfirm
      v-model="logoutConfirmVisible"
      :title="$t('modal.delete')"
      :body="$t('modal.delete_equipment')"
      @handleOk="deleteProduct"
    />
  </div>
</template>
