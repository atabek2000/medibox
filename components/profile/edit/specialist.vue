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
import { DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";
const { useCities, useDicts } = useDict();
const { profileEditEntity } = useAuth();
const { startLoading, stopLoading } = useLoader();
const { t, locale } = useI18n();
const props = defineProps({
  user: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["setIsEdit", "refresh"]);

const cities = useCities().value;
const date = ref(new Date(props.user.birthday));
const phoneModel = ref(changePhoneMask("7" + props.user.phone));
const iinModel = ref(changeIinMask(props.user.iin));
const spec_files = ref([]);
const specialities = useDicts().value.Category;

const handleFileChange = (event) => {
  spec_files.value = event.target.files;
};

const deleteFile = () => {
  startLoading();
  useFetchApi(`entity/delete-document/${props.user?.id}`, {
    method: "DELETE",
    onResponse() {
      stopLoading();
      emit("refresh");
    },
  });
  spec_files.value = [];
};
const spec_file_link = ref(props.user.doctor_document);

const state = reactive({
  last_name: props.user.last_name,
  first_name: props.user.first_name,
  surname: props.user.surname,
  birthday: date.value.toLocaleDateString("sv-SE"),
  city_id: props.user?.city?.id,
  category_id: props.user?.category?.id,
  email: props.user.email,
  address: props.user.address,
  phone: changePhoneMask("7" + props.user.phone),
});

const schema = z.object({
  last_name: z.string().min(1, t("form_verification.required")),
  first_name: z.string().min(1, t("form_verification.required")),
  birthday: z.string().min(1, t("form_verification.required")),
  email: z.string().email(t("form_verification.invalid_email")),
  city_id: z.number().min(1, t("form_verification.required")),
  category_id: z.number().min(1, t("form_verification.required")),
  phone: z
    .string()
    .min(18, t("form_verification.min_symbol", { min: 18 }))
    .max(18, t("form_verification.max_symbol", { max: 18 })),
});

const profile_edit = async () => {
  const form_data = new FormData();

  form_data.append("last_name", state.last_name);
  form_data.append("first_name", state.first_name);
  form_data.append("surname", state.surname);
  form_data.append("category_id", state.category_id);
  form_data.append("birthday", state.birthday);
  form_data.append("city_id", state.city_id);
  form_data.append("address", state.address);
  form_data.append("email", state.email);
  form_data.append(
    "phone",
    String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10)
  );
  if (spec_files.value[0])
    form_data.append("doctor_document", spec_files.value[0]);

  await profileEditEntity(form_data);
  emit("setIsEdit", false);
};
watch(phoneModel, (newf, oldf) => {
  phoneModel.value = changePhoneMask(newf);
  state.phone = phoneModel.value;
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
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] gap-y-3 w-full"
      @submit="profile_edit"
    >
      <div class="w-full md:w-[48%]">
        <UFormGroup
          :label="$t('form.last_name')"
          required
          name="last_name"
          class="rounded-2xl w-full"
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
          class="rounded-2xl w-full mt-3"
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
          class="rounded-2xl w-full mt-3"
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
          :label="$t('form.specialty')"
          required
          name="category_id"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <USelectMenu
            v-model="state.category_id"
            searchable
            :searchable-placeholder="$t('form.search_specialization')"
            :options="specialities"
            value-attribute="id"
            :option-attribute="locale === 'ru' ? 'name' : `name_${locale}`"
            :uiMenu="MainSelectMenuConfig()"
            :ui="MainSelectConfig()"
            :placeholder="$t('form.specialty_p')"
          >
            <template #leading>
              <img
                src="~assets/svg/common/circle-intersect.svg"
                alt="check"
                class="ps-[6px]"
              />
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.birthday')"
          required
          name="birthday"
          class="rounded-2xl w-full mt-3"
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
      </div>
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
          :label="$t('form.address')"
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
                src="~assets/svg/common/location.svg"
                alt="location"
                class="ps-[6px]"
              />
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.email')"
          name="email"
          required
          class="rounded-2xl w-full mt-3"
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
          class="rounded-2xl w-full mt-3"
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

        <UFormGroup
          :label="$t('form.spec_docs')"
          name="doctor_document"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <div
            v-if="spec_file_link"
            class="images-block flex justify-between items-start px-4 py-3 bg-wild-sand rounded-2xl"
          >
            <div class="flex gap-2 items-start w-[90%]">
              <img src="~assets/svg/common/file-plus.svg" alt="" />
              <div class="w-[90%]">
                <nuxt-link :to="spec_file_link" target="_blank" class="w-full">
                  <p
                    class="text-sm font-normal w-full text-ellipsis overflow-hidden"
                  >
                    {{ spec_file_link }}
                  </p>
                  <p class="text-sm font-normal text-pumice">
                    {{ $t("content.open_file") }}
                  </p>
                </nuxt-link>
              </div>
            </div>
            <img
              src="~assets/svg/common/delete-file.svg"
              alt="delete"
              class="cursor-pointer"
              @click="deleteFile"
            />
          </div>
          <div
            v-else-if="spec_files.length > 0"
            class="images-block flex justify-between items-start px-4 py-3 bg-wild-sand rounded-2xl"
          >
            <div class="flex gap-2 items-start">
              <img src="~assets/svg/common/file-plus.svg" alt="" />
              <div>
                <p class="text-sm font-normal">{{ spec_files[0].name }}</p>
                <p class="text-sm font-normal text-pumice">
                  {{ Math.round(spec_files[0].size / 10000) / 100 }} MB
                </p>
              </div>
            </div>
            <img
              src="~assets/svg/common/delete-file.svg"
              alt="delete"
              class="cursor-pointer"
              @click="deleteFile"
            />
          </div>
          <div v-else class="input-block mt-3">
            <input
              @change="handleFileChange"
              id="file-uploader-input"
              type="file"
              accept=".doc,.docx,.pdf"
              class="hidden"
            />
            <label
              for="file-uploader-input"
              class="flex w-full justify-center items-center px-14 py-3 bg-wild-sand rounded-2xl cursor-pointer ring-1 ring-primary w-fit"
            >
              <img src="~assets/svg/common/file-plus.svg" alt="" />
              <span class="ms-2 border-b border-b-black leading-[18px]">
                 + {{ $t("button.download_file") }}
              </span>
            </label>
          </div>
        </UFormGroup>
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
