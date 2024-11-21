<script setup>
import {
  MainCheckboxConfig,
  MainFormGroupConfig,
  MainInputConfig,
  MainToggleConfig,
  MainButtonConfig,
  MainSelectMenuConfig,
  MainSelectConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
const { t, locale } = useI18n();
import { z } from "zod";
const cookie_jwt = useCookie("jwt");
const { startLoading, stopLoading } = useLoader();

const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `services/specialists/`, {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);

const selected_specialists = ref([]);
const isVisibleSpecialists = ref(true);
const specialists = computed(() => {
  return data.value?.data.map((spec) => spec.specialist);
});

const selectedDay = ref(1);
const daysData = reactive({
  d_1: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_2: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_3: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_4: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_5: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_6: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
  d_7: {
    is_weekend: false,
    available_time: {
      start: { hour: 0, minute: 0 },
      end: { hour: 0, minute: 0 },
    },
    break_time: { start: { hour: 0, minute: 0 }, end: { hour: 0, minute: 0 } },
  },
});

const duration = reactive({
  hour: 0,
  minute: 0,
});
const state = reactive({
  service_type: "",
  category_id: 0,
  price: "",
  is_promotion: false,
  promotion: undefined,
  days: daysData,
  service_duration: "",
  is_acquainted: false,
  description: "",
});

const schema = z.object({
  service_type: z.string().min(1, t("form_verification.required")),
  service_duration: z.string().min(1, t("form_verification.required")),
  description: z.string().min(1, t("form_verification.required")),
  category_id: z.number().min(1, t("form_verification.required")),
  price: z.string().min(1, t("form_verification.required")),
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});

const organization_types = ref([]);
const categories = ref([]);
const imageInput = ref([]);
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

const onChangeSpecialist = (id) => {
  const spec_days = {};
  for (let i = 1; i <= 7; i++) {
    spec_days[`d_${i}`] = {
      is_weekend: false,
      time: {
        start: { hour: 0, minute: 0 },
        end: { hour: 0, minute: 0 },
      },
    };
  }
  if (selected_specialists.value.filter((sp) => sp.id === id).length === 0)
    selected_specialists.value.push({
      ...specialists.value.filter((sp) => sp.id === id)[0],
      ...spec_days,
    });
  isVisibleSpecialists.value = false;
};

const deleteSpecialist = (id) => {
  selected_specialists.value = selected_specialists.value.filter(
    (ss) => ss.id !== id
  );
  if (selected_specialists.value.length === 0) {
    isVisibleSpecialists.value = true;
  }
};

const setSelectedDay = (val) => {
  selectedDay.value = val;
};

const create = async () => {
  const form_data = new FormData();

  for (let i = 1; i <= 7; i++) {
    if (daysData[`d_${i}`].is_weekend) {
      form_data.append(`d_${i}[is_weekend]`, daysData[`d_${i}`].is_weekend);
      continue;
    } else if (
      !daysData[`d_${i}`].is_weekend &&
      (!daysData[`d_${i}`].available_time.start.hour ||
        !daysData[`d_${i}`].available_time.start.minute ||
        !daysData[`d_${i}`].available_time.end.hour ||
        !daysData[`d_${i}`].available_time.end.minute)
      // ||
      // !daysData[`d_${i}`].break_time.start.hour ||
      // !daysData[`d_${i}`].break_time.start.minute ||
      // !daysData[`d_${i}`].break_time.end.hour ||
      // !daysData[`d_${i}`].break_time.end.minute
    ) {
      useToast().add({
        color: "red",
        title: t("toast.error"),
        description: t(`toast.set_work_time_and_rest`, {
          name: t(`short_weekdays.d${i}`),
        }),
      });

      return;
    } else {
      form_data.append(`d_${i}[is_weekend]`, daysData[`d_${i}`].is_weekend);
      form_data.append(
        `d_${i}[start_available_time]`,
        daysData[`d_${i}`].available_time.start.hour +
          ":" +
          daysData[`d_${i}`].available_time.start.minute
      );
      form_data.append(
        `d_${i}[end_available_time]`,
        daysData[`d_${i}`].available_time.end.hour +
          ":" +
          daysData[`d_${i}`].available_time.end.minute
      );
      form_data.append(
        `d_${i}[start_break_time]`,
        daysData[`d_${i}`].break_time.start.hour +
          ":" +
          daysData[`d_${i}`].break_time.start.minute
      );
      form_data.append(
        `d_${i}[end_break_time]`,
        daysData[`d_${i}`].break_time.end.hour +
          ":" +
          daysData[`d_${i}`].break_time.end.minute
      );
    }
  }

  if (selected_specialists.value.length === 0) {
    useToast().add({
      color: "red",
      title: t("toast.error"),
      description: t(`toast.select_spec`),
    });
    return;
  } else {
    for (const ss of selected_specialists.value) {
      for (let i = 1; i <= 7; i++) {
        form_data.append(
          `specialists[${ss.id}][d_${i}][is_weekend]`,
          ss[`d_${i}`].is_weekend
        );
        if (ss[`d_${i}`].is_weekend) continue;
        else if (
          !ss[`d_${i}`].time.start.hour ||
          !ss[`d_${i}`].time.start.minute ||
          !ss[`d_${i}`].time.end.hour ||
          !ss[`d_${i}`].time.end.minute
        ) {
          useToast().add({
            color: "red",
            title: t("toast.error"),
            description: t(`toast.set_spec_work_time`, {
              name: `${ss.first_name} ${ss.last_name}`,
            }),
          });
          return;
        }

        form_data.append(
          `specialists[${ss.id}][d_${i}][start_available_time]`,
          `${ss[`d_${i}`].time.start.hour}:${ss[`d_${i}`].time.start.minute}`
        );
        form_data.append(
          `specialists[${ss.id}][d_${i}][end_available_time]`,
          `${ss[`d_${i}`].time.end.hour}:${ss[`d_${i}`].time.end.minute}`
        );
      }
    }
  }

  form_data.append("service_type", state.service_type);
  form_data.append("service_duration", state.service_duration);
  form_data.append("category_id", state.category_id);
  form_data.append("description", state.description);
  form_data.append("price", state.price.replaceAll(/[\D]+/gi, ""));
  form_data.append("is_promotion", Number(state.is_promotion));
  if (state.promotion)
    form_data.append("promotion", state.promotion.replaceAll(/[\D]+/gi, ""));
  form_data.append("is_acquainted", 1);

  Array.from(imageInput.value.files).forEach((file) => {
    form_data.append("photo[]", file);
  });
  startLoading();
  const res = await useFetchApi("services/store-service", {
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
    useRouter().push("/profile/service");
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

onBeforeMount(() => {
  const { useCities, useDicts } = useDict();
  organization_types.value = useDicts().value.AreaSale;
  categories.value = useDicts().value.Category;
});

watch(duration, (newv, oldv) => {
  state.service_duration = `${newv.hour}:${newv.minute}`;
});
</script>

<template>
  <div class="add-service">
    <UForm
      :schema="schema"
      :state="state"
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] gap-y-3 w-full"
      @submit="create"
    >
      <div class="w-full flex flex-wrap md:flex-nowrap gap-6">
        <div class="w-full md:w-1/2">
          <UFormGroup
            :label="$t('form.category')"
            name="category_id"
            class="rounded-2xl w-full"
            :ui="MainFormGroupConfig()"
          >
            <USelectMenu
              v-model="state.category_id"
              selected-icon="i-ic-baseline-radio-button-checked"
              searchable
              :searchable-placeholder="$t('form.search_specialization')"
              :options="categories"
              value-attribute="id"
              :option-attribute="locale === 'ru' ? 'name' : `name_${locale}`"
              :uiMenu="RadioSelectMenuConfig()"
              :ui="MainSelectConfig()"
              :placeholder="$t('form.category')"
            >
            </USelectMenu>
          </UFormGroup>

          <UFormGroup
            :label="$t('form.service_type')"
            name="service_type"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <UInput
              v-model="state.service_type"
              class=""
              :ui="MainInputConfig()"
              :placeholder="$t('form.service_type_p')"
            >
            </UInput>
          </UFormGroup>

          <UFormGroup
            :label="$t('form.work_schedule')"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex justify-between mt-4">
              <div
                v-for="weekday in 7"
                :key="weekday"
                class="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-pumice flex justify-center items-center font-medium text-xs uppercase cursor-pointer"
                :class="
                  daysData[`d_${weekday}`].is_weekend
                    ? 'bg-wild-sand-200 border-pumice text-black'
                    : selectedDay === weekday
                    ? 'bg-emerald border-emerald text-white'
                    : ''
                "
                @click="setSelectedDay(weekday)"
              >
                {{ $t(`short_weekdays.d${weekday}`) }}
              </div>
            </div>
          </UFormGroup>

          <UCheckbox
            :ui="MainCheckboxConfig()"
            v-model="daysData[`d_${selectedDay}`].is_weekend"
            @click="(e) => e.stopPropagation()"
            class="mt-3"
            :label="$t('form.weekend')"
          />

          <UFormGroup
            v-if="!daysData[`d_${selectedDay}`].is_weekend"
            :label="$t('form.available_time')"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex gap-2">
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].available_time.start"
                :title="$t('form.start_time')"
              />
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].available_time.end"
                :title="$t('form.end_time')"
              />
            </div>
          </UFormGroup>

          <UFormGroup
            v-if="!daysData[`d_${selectedDay}`].is_weekend"
            :label="$t('form.break_time')"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div class="flex gap-2">
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].break_time.start"
                :title="$t('form.start_time')"
              />
              <ScrollPickerTime
                class="w-1/2"
                v-model="daysData[`d_${selectedDay}`].break_time.end"
                :title="$t('form.end_time')"
              />
            </div>
          </UFormGroup>

          <UFormGroup
            :label="$t('form.spec_fio')"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <div v-for="(ss, index) in selected_specialists" :key="ss.id">
              <div
                class="px-4 py-3 bg-wild-sand rounded-2xl flex justify-between mb-2"
              >
                <p class="text-sm font-normal">
                  {{ `${ss.first_name} ${ss.last_name}` }}
                </p>
                <img
                  src="~/assets/svg/common/delete-file.svg"
                  alt=""
                  class="cursor-pointer"
                  @click="deleteSpecialist(ss.id)"
                />
              </div>
              <ProfileServiceSpecWorkTime
                class="mb-4"
                v-model="selected_specialists[index]"
              />
            </div>
            <USelectMenu
              v-if="isVisibleSpecialists"
              :options="specialists"
              value-attribute="id"
              option-attribute="first_name"
              :uiMenu="MainSelectMenuConfig()"
              :ui="MainSelectConfig()"
              :placeholder="$t('form.spec_fio_p')"
              @change="onChangeSpecialist"
            >
            </USelectMenu>
            <p
              v-if="!isVisibleSpecialists"
              class="text-japanese-laurel text-xs font-normal text-end cursor-pointer"
              @click="isVisibleSpecialists = true"
            >
              {{ $t("button.spec_add") }}
            </p>
          </UFormGroup>
        </div>
        <div class="w-full md:w-1/2">
          <UFormGroup
            :label="$t('form.service_desc')"
            name="description"
            class="rounded-2xl w-full"
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
            :label="$t('form.service_duration')"
            name="service_duration"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <ScrollPickerDuration
              v-model:hour="duration.hour"
              v-model:minute="duration.minute"
            />
          </UFormGroup>

          <UFormGroup
            :label="$t('form.price')"
            name="price"
            class="rounded-2xl w-full mt-3"
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
            name="promotion"
            class="rounded-2xl w-full mt-3"
            :ui="MainFormGroupConfig()"
          >
            <template #label>
              <div class="flex justify-between w-full mb-1">
                <p>{{ $t("form.sale") }}</p>
                <UToggle
                  v-model="state.is_promotion"
                  :ui="MainToggleConfig()"
                  color="japanese-laurel"
                />
              </div>
            </template>
            <UInput
              :disabled="!state.is_promotion"
              v-model="state.promotion"
              :value="changePriceMask(state.promotion)"
              :ui="MainInputConfig()"
              :placeholder="$t('form.sale_p')"
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
      </div>
      <div class="flex items-center mt-6">
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
