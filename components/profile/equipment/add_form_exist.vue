<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainCheckboxConfig,
  MainSelectConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { t, locale } = useI18n();
import { z } from "zod";
const { startLoading, stopLoading } = useLoader();
const { useDuration } = useDict();
const route = useRoute();

const props = defineProps({
  equipment: {
    type: Object,
    default: {},
  },
});

const state = reactive({
  price: parseInt(props.equipment.price).toString(),
  duration: props.equipment.duration ?? "",
  type: props.equipment.type,
  is_acquainted: false,
});

const schema = z.object({
  price: z.string().min(1, t("form_verification.required")),
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
  ...(props.equipment.type === "rent"
    ? { duration: z.string().min(1, t("form_verification.required")) }
    : undefined),
});

const onAddProduct = async () => {
  const form_data = new FormData();
  form_data.append("price", state.price.replaceAll(/[\D]+/gi, ""));
  if (state.type === "rent") form_data.append("duration", state.duration);
  form_data.append("is_acquainted", 1);
  startLoading();
  const res = await useFetchApi(`equipments/store-exist/${route.params.id}`, {
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
    useRouter().push("/profile/equipment");
  }
};

let imageInput = ref();
const selectedImages = ref([]);

const handleFileChange = (event) => {
  if (event.target.files.length < 1 || event.target.files.length > 5) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("form.photo_min_max", { min: 3, max: 5 }),
    });
    return;
  }
  const images_arr = event.target.files;
  if (!images_arr) return;

  selectedImages.value = [];
  for (let i = 0; i < images_arr.length; i++) {
    const file = images_arr[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImages.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div class="w-full">
    <div class="flex gap-x-3">
      <img
        class="w-[100px] h-[100px] object-cover rounded-xl"
        :src="
          equipment.photo?.length > 0
            ? equipment.photo[0]
            : '/common/avatar.png'
        "
        alt="img"
      />
      <div>
        <p class="font-semibold text-base">
          {{ equipment?.[locale === "ru" ? "name" : `name_${locale}`] }}
        </p>
        <p
          class="px-2 py-1 mt-2 bg-emerald-100 text-japanese-laurel rounded-lg"
        >
          {{ $t(`filter.${equipment.type}`) }}
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
          v-if="state.type === 'rent'"
          :label="$t('form.rent_duration')"
          name="duration"
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
    </UForm>
  </div>
</template>
