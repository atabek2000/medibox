<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainRadioConfig,
  MainSelectConfig,
  MainCheckboxConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { t } = useI18n();
import { z } from "zod";
const { useDuration, useEquipmentType } = useDict();
const { startLoading, stopLoading } = useLoader();

const state = reactive({
  name: undefined,
  type: "sale",
  description: "",
  duration: "daily",
  weight: "",
  price: "",
  phone: undefined,
  is_acquainted: false,
});

const schema = z.object({
  price: z.string().min(1, t("form_verification.required")),
  duration: z.string().min(1, t("form_verification.required")),
  weight: z.string().min(1, t("form_verification.required")),
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

const onAddProduct = async () => {
  const form_data = new FormData();

  form_data.append("name", state.name);
  form_data.append("type", state.type);
  form_data.append("weight", state.weight.replaceAll(/[\D]+/gi, ""));
  form_data.append("description", state.description);
  if (state.type === "rent") form_data.append("duration", state.duration);
  if (state.phone) form_data.append("phone", state.phone);
  form_data.append("price", state.price.replaceAll(/[\D]+/gi, ""));
  form_data.append("is_acquainted", 1);

  Array.from(imageInput.value.files).forEach((file) => {
    form_data.append("photo[]", file);
  });
  startLoading();
  const res = await useFetchApi(`equipments/store-equipment`, {
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
const images = ref([]);
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
  images.value = Array.from(event.target.files);
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

const deleteImage = (index) => {
  selectedImages.value.splice(index, 1);
  images.value.splice(index, 1);
  if (imageInput.value) {
    const dataTransfer = new DataTransfer();
    images.value.forEach((file) => dataTransfer.items.add(file));
    imageInput.value.files = dataTransfer.files;
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
          :label="$t('form.equipment_name')"
          name="name"
          class="rounded-2xl w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.name"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.equipment_name_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.equipment_desc')"
          name="description"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UTextarea
            v-model="state.description"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.type')"
            maxlength="1000"
          >
          </UTextarea>
          <p class="w-full text-end text-pumice font-normal text-xs mt-2">
            {{ state.description.length }}/1000 {{ $t("form.symbols") }}
          </p>
        </UFormGroup>

        <UFormGroup
          name="type"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <div class="flex w-full justify-between">
            <URadio
              v-for="gd of useEquipmentType().value"
              :key="gd.value"
              v-model="state.type"
              v-bind="gd"
              :ui="MainRadioConfig()"
              class="w-1/2"
            />
          </div>
        </UFormGroup>
      </div>

      <div class="w-full md:w-[48%]">
        <UFormGroup
          v-if="state.type === 'rent'"
          :label="$t('form.rent_duration')"
          name="duration"
          class="rounded-2xl w-full"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.duration"
            :options="useDuration().value"
            selected-icon="i-ic-baseline-radio-button-checked"
            value-attribute="value"
            option-attribute="label"
            :uiMenu="RadioSelectMenuConfig()"
            :ui="MainSelectConfig()"
          >
          </USelectMenu>
        </UFormGroup>

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
          :label="$t('form.product_weight_k')"
          name="price"
          class="rounded-2xl mt-3 w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.weight"
            :value="changePriceMask(state.weight)"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.product_weight_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.photos')"
          name="photo"
          class="rounded-2xl mt-3 w-full"
          :ui="MainFormGroupConfig()"
        >
          <div class="images-block flex gap-x-2">
            <div
              v-for="(image, index) in selectedImages"
              :key="image"
              class="relative"
            >
              <img
                :src="image"
                alt="service"
                class="w-20 max-w-20 max-h-20 object-cover"
              />
              <img
                @click="deleteImage(index)"
                src="~/assets/svg/common/close-gray.svg"
                alt="close"
                class="absolute right-0 top-0 bg-white rounded-full cursor-pointer bg-opacity-80"
              />
            </div>
          </div>
          <div class="input-block mt-3">
            <input
              ref="imageInput"
              @change="handleFileChange"
              id="file-uploader-input"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
            />
            <label
              for="file-uploader-input"
              class="flex justify-center items-center px-14 py-3 bg-wild-sand rounded-2xl cursor-pointer ring-1 ring-primary w-fit"
            >
              <img src="~assets/svg/common/camera-icon.svg" alt="" />
              <span class="ms-2 border-b border-b-black leading-[18px]">
                 + {{ $t("button.add_photo") }}
              </span>
            </label>
          </div>
          <div class="mt-1">
            <p class="text-xs font-normal text-pumice">
              - {{ $t("form.photo_max_size", { size: 20 }) }}
            </p>
            <p class="text-xs font-normal text-pumice">
              - {{ $t("form.photo_min_max", { min: 3, max: 5 }) }}
            </p>
          </div>
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
