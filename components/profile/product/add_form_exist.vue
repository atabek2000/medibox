<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainCheckboxConfig,
} from "~/composables/ui/useConfig";
const { t, locale } = useI18n();
import { z } from "zod";
const { startLoading, stopLoading } = useLoader();
const route = useRoute();

const props = defineProps({
  medicine: {
    type: Object,
    default: {},
  },
});

const state = reactive({
  price: "",
  promotion: undefined,
  is_promotion: 0,
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
  if (state.promotion) {
    form_data.append("promotion", state.promotion.replaceAll(/[\D]+/gi, ""));
    state.is_promotion = 1;
  }

  form_data.append("is_promotion", state.is_promotion);
  form_data.append("is_acquainted", 1);
  startLoading();
  const res = await useFetchApi(`medicines/store-exist/${route.params.id}`, {
    method: "POST",
    body: form_data,
    headers: {
      Accept: "application/json",
    },
    onResponse() {
      stopLoading();
    },
  });

  if (res) {
    useRouter().push("/profile/product");
  }
};
</script>

<template>
  <div>
    <div class="flex gap-x-3">
      <img
        class="w-[100px] h-[100px] object-cover rounded-xl"
        :src="medicine.photo?.length > 0 ? medicine.photo[0] : ''"
        alt="medicine"
      />
      <div>
        <p class="font-semibold text-base">
          {{ medicine?.[locale === "ru" ? "name" : `name_${locale}`] }}
        </p>
        <p class="font-normal text-sm text-japanese-laurel">
          {{
            medicine.medicine_category?.[
              `name${locale === "ru" ? "" : "_" + locale}`
            ]
          }}
        </p>
      </div>
    </div>
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
          :label="$t('form.sale')"
          name="promotion"
          class="rounded-2xl mt-3 w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.promotion"
            :value="changePriceMask(state.promotion)"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.sale_p')"
          >
          </UInput>
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
    </UForm>
  </div>
</template>
