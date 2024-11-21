<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainSelectConfig,
  MainCheckboxConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { t, locale } = useI18n();
const { startLoading, stopLoading } = useLoader();
import { z } from "zod";
const state = reactive({
  description: "",
  address: "",
  placing: "",
  condition: "",
  duration: 0,
  phone: "",
  is_acquainted: false,
  ceiling_height: 0,
  room_count: 0,
  square: 0,
  year_construction: 0,
  price: "",
  purpose_id: 0,
  city_id: 0,
});
const phoneModel = ref("");
const cities = ref([]);
const purposes = ref([]);
const durations = ref([]);

const imageInput = ref([]);
const images = ref([]);
const selectedImages = ref([]);
const handleFileChange = (event) => {
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

const schema = z.object({
  description: z.string().min(1, t("form_verification.required")),
  address: z.string().min(1, t("form_verification.required")),
  // placing: z.string().min(1, t("form_verification.required")),
  condition: z.string().min(1, t("form_verification.required")),
  duration: z.string().min(1, t("form_verification.required")),
  city_id: z.number().min(1, t("form_verification.required")),
  ceiling_height: z.number().min(1, t("form_verification.required")),
  room_count: z.number().min(1, t("form_verification.required")),
  square: z.number().min(1, t("form_verification.required")),
  year_construction: z.number().min(1, t("form_verification.required")),
  price: z.string().min(1, t("form_verification.required")),
  purpose_id: z.number().min(1, t("form_verification.required")),
  phone: z
    .string()
    .min(18, t("form_verification.min_symbol", { min: 18 }))
    .max(18, t("form_verification.max_symbol", { max: 18 })),
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

const onAddPremis = () => {
  // if (images.value.length === 0) {
  //   useToast().add({
  //     title: t("toast.error"),
  //     color: "red",
  //     description: t("toast.add_spec_docs"),
  //   });
  //   return;
  // }

  const form_data = new FormData();
  form_data.append("description", state.description);
  form_data.append("city_id", state.city_id);
  form_data.append("address", state.address);
  form_data.append("purpose_id", state.purpose_id);
  form_data.append(
    "phone",
    String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10)
  );
  form_data.append("duration", state.duration);
  form_data.append("price", state.price.replaceAll(/[\D]+/gi, ""));
  form_data.append("year_construction", state.year_construction);
  form_data.append("square", state.square);
  form_data.append("room_count", state.room_count);
  form_data.append("placing", state.placing);
  form_data.append("ceiling_height", state.ceiling_height);
  form_data.append("condition", state.condition);
  form_data.append("is_acquainted", Number(state.is_acquainted));

  Array.from(imageInput.value.files).forEach((file) => {
    form_data.append("photo[]", file);
  });
  startLoading();
  const spec = useFetchApi("premises/store-premise", {
    method: "POST",
    body: form_data,
    headers: {
      Accept: "application/json",
    },
    async onResponse({ request, response, options }) {
      stopLoading();
      if (response.ok) useRouter().push("/profile/room");
    },
  });
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

onBeforeMount(() => {
  const { useCities, useDicts, useDuration } = useDict();
  purposes.value = useDicts().value.Purpose;
  cities.value = useCities().value;
  durations.value = useDuration().value;
});

watch(phoneModel, (newf, oldf) => {
  phoneModel.value = changePhoneMask(newf);
  state.phone = phoneModel.value;
});
</script>

<template>
  <div>
    <UForm
      :schema="schema"
      :state="state"
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] gap-y-3 w-full"
      @submit="onAddPremis"
    >
      <div class="w-full md:w-[48%]">
        <UFormGroup
          :label="$t('form.city')"
          required
          name="city_id"
          class="rounded-2xl w-full"
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
            :placeholder="$t('form.city_p2')"
          >
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.address')"
          required
          name="address"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.address"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.address_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.destiny')"
          required
          name="purpose_id"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.purpose_id"
            selected-icon="i-ic-baseline-radio-button-checked"
            :options="purposes"
            value-attribute="id"
            :option-attribute="locale === 'ru' ? 'name' : `name_${locale}`"
            :uiMenu="RadioSelectMenuConfig()"
            :ui="MainSelectConfig()"
            :placeholder="$t('form.destiny_p')"
          >
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.rent_duration')"
          name="duration"
          required
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.duration"
            selected-icon="i-ic-baseline-radio-button-checked"
            :options="durations"
            value-attribute="value"
            option-attribute="label"
            :uiMenu="RadioSelectMenuConfig()"
            :ui="MainSelectConfig()"
            :placeholder="$t('form.duration_p')"
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
          :label="$t('form.construct_year')"
          name="year_construction"
          class="rounded-2xl mt-3 w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.year_construction"
            class=""
            type="number"
            :ui="MainInputConfig()"
            :placeholder="$t('form.construct_year_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.area_obj')"
          name="square"
          class="rounded-2xl mt-3 w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.square"
            class=""
            type="number"
            :ui="MainInputConfig()"
            :placeholder="$t('form.area_obj_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.cabinet_count')"
          name="room_count"
          class="rounded-2xl mt-3 w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.room_count"
            class=""
            type="number"
            :ui="MainInputConfig()"
            :placeholder="$t('form.cabinet_count_p')"
          >
          </UInput>
        </UFormGroup>
      </div>
      <div class="w-full md:w-[48%]">
        <!-- <UFormGroup
          :label="$t('form.placement')"
          name="placing"
          class="rounded-2xl w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.placing"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.placement_p')"
          >
          </UInput>
        </UFormGroup> -->

        <UFormGroup
          :label="$t('form.ceil_height')"
          name="ceiling_height"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.ceiling_height"
            class=""
            type="number"
            :ui="MainInputConfig()"
            :placeholder="$t('form.ceil_height_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.state')"
          name="condition"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.condition"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.state_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.phone')"
          name="phone"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="phoneModel"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.phone_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.about_room')"
          name="description"
          class="rounded-2xl mt-3 w-full"
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
              class="flex justify-center items-center px-14 py-3 bg-wild-sand rounded-2xl cursor-pointer ring-1 ring-primary"
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
      <div class="flex items-center mt-10">
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
                {{ $t("content.learn") }} <ProfileProductConditionsModal />
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
