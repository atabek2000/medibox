<script setup>
import {
  MainButtonConfig,
  MainInputConfig,
  MainFormGroupConfig,
  MainSelectConfig,
  MainCheckboxConfig,
  RadioSelectMenuConfig,
} from "~/composables/ui/useConfig";
import { z } from "zod";
const { t, locale } = useI18n(0);
const { startLoading, stopLoading } = useLoader();
const route = useRoute();
const props = defineProps({
  specialist: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["refresh"]);

const state = reactive({
  first_name: props.specialist.first_name,
  last_name: props.specialist.last_name,
  surname: props.specialist.surname,
  phone: changePhoneMask("7" + props.specialist.phone),
  category_id: props.specialist.category?.id,
  about_doctor: props.specialist.about_doctor,
  password: props.specialist.password,
  service_type: props.specialist.service_type,
  is_acquainted: false,
});
const phoneModel = ref(changePhoneMask("7" + props.specialist.phone));

const categories = ref([]);
const logoutConfirmVisible = ref(false);

const avatarInput = ref();
const selectedAvatar = ref([
  props.specialist?.avatar?.length
    ? props.specialist?.avatar[0]
    : "/common/avatar.png",
]);
const handleAvatarChange = (event) => {
  const images_arr = event.target.files;
  if (!images_arr) return;

  selectedAvatar.value = [];
  for (let i = 0; i < images_arr.length; i++) {
    const file = images_arr[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedAvatar.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const spec_files = ref([]);
const handleFileChange = (event) => {
  spec_files.value = event.target.files;
};
const spec_file_link = ref(props.specialist.doctor_document);

const deleteFile = async () => {
  if (spec_file_link.value) {
    startLoading();
    await useFetchApi(`entity/delete-document/${props.specialist?.id}`, {
      method: "DELETE",
      onResponse({ response }) {
        stopLoading();
        if (response.ok) {
          emit("refresh");
          spec_file_link.value = undefined;
        }
      },
    });
  } else {
    spec_files.value = [];
  }
};

const schema = z.object({
  last_name: z.string().min(1, t("form_verification.required")),
  first_name: z.string().min(1, t("form_verification.required")),
  // surname: z.string().min(1, t("form_verification.required")),
  category_id: z.number().min(1, t("form_verification.required")),
  phone: z
    .string()
    .min(18, t("form_verification.min_symbol", { min: 18 }))
    .max(18, t("form_verification.max_symbol", { min: 18 })),
  // about_doctor: z.string().min(1, t("form_verification.required")),
  service_type: z.string().min(1, t("form_verification.required")),
  is_acquainted: z.boolean().refine((val) => val === true, {
    message: t("form_verification.read_terms_conditions"),
  }),
});
const isPasswordVisible = ref(false);

const onAddSpec = () => {
  //   if (spec_files.value.length === 0) {
  //     useToast().add({
  //       title: t("toast.error"),
  //       color: "red",
  //       description: t("toast.add_spec_docs"),
  //     });
  //     return;
  //   }

  const form_data = new FormData();
  form_data.append("last_name", state.last_name);
  form_data.append("first_name", state.first_name);
  form_data.append("surname", state.surname);
  form_data.append("category_id", state.category_id);
  form_data.append(
    "phone",
    String(state.phone).replaceAll(/[\D]+/gi, "").slice(-10)
  );
  form_data.append("password", state.password);
  form_data.append("about_doctor", state.about_doctor);
  form_data.append("service_type", state.service_type);
  if (spec_files.value.length > 0)
    form_data.append("doctor_document", spec_files.value[0]);
  if (avatarInput.value.files.length > 0)
    form_data.append("avatar[]", avatarInput.value.files[0]);

  startLoading();
  const spec = useFetchApi(`services/edit-specialist/${props.specialist.id}`, {
    method: "POST",
    body: form_data,
    headers: {
      Accept: "application/json",
    },
    async onResponse({ request, response, options }) {
      stopLoading();
      useRouter().push("/profile/specialist");
    },
  });
};

const deleteSpec = async () => {
  startLoading();
  const res = await useFetchApi(
    `services/delete-specialist/${route.params.id}`,
    {
      method: "DELETE",
      onResponse() {
        stopLoading();
      },
    }
  );
  if (res) {
    useRouter().push("/profile/specialist");
  }
};

watch(phoneModel, (newf, oldf) => {
  phoneModel.value = changePhoneMask(newf);
  state.phone = phoneModel.value;
});

onBeforeMount(() => {
  const { useDicts } = useDict();
  categories.value = useDicts().value.Category;
});
</script>

<template>
  <div>
    <UChip
      size="md"
      position="bottom-right"
      inset
      class="cursor-pointer"
      :ui="{
        base: '-mx-2 rounded-none ring-0',
        background: '',
        position: { 'bottom-right': 'bottom-2 right-2' },
      }"
    >
      <input
        ref="avatarInput"
        type="file"
        id="spec-avatar"
        class="hidden"
        @change="handleAvatarChange"
        accept="image/*"
      />
      <label for="spec-avatar" class="cursor-pointer">
        <img
          :src="selectedAvatar[0]"
          alt="avatar"
          class="w-24 h-24 rounded-full object-cover"
        />
      </label>
      <template #content>
        <img src="~assets/svg/profile/camera.svg" alt="" />
      </template>
    </UChip>
    <UForm
      :schema="schema"
      :state="state"
      class="mt-5 flex flex-wrap xs:gap-x-0 md:gap-x-[4%] gap-y-3 w-full"
      @submit="onAddSpec"
    >
      <div class="w-full md:w-[48%]">
        <UFormGroup
          :label="$t('form.spec_last_name')"
          name="last_name"
          class="rounded-2xl w-full"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.last_name"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.spec_last_name_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.spec_first_name')"
          name="first_name"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.first_name"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.spec_first_name_p')"
          >
          </UInput>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.spec_surname')"
          name="surname"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.surname"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.spec_surname_p')"
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
          :label="$t('form.category')"
          required
          name="category_id"
          class="rounded-2xl w-full mt-3"
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
            :placeholder="$t('form.category_p')"
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
          :label="$t('form.password')"
          name="password"
          class="rounded-2xl w-full mt-3"
          :ui="MainFormGroupConfig()"
        >
          <UInput
            v-model="state.password"
            class=""
            :type="isPasswordVisible ? 'text' : 'password'"
            :ui="MainInputConfig()"
            :placeholder="$t('form.password_p2')"
          >
            <template #trailing>
              <UButton
                v-if="!isPasswordVisible"
                v-show="q !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-eye-slash-16-solid"
                :padded="false"
                @click="isPasswordVisible = true"
              />
              <UButton
                v-else
                v-show="q !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-eye-16-solid"
                :padded="false"
                @click="isPasswordVisible = false"
              />
            </template>
          </UInput>
        </UFormGroup>
      </div>
      <div class="w-full md:w-[48%]">
        <UFormGroup
          :label="$t('form.about_doctor')"
          name="about_doctor"
          class="rounded-2xl w-full"
          :ui="MainFormGroupConfig()"
        >
          <UTextarea
            v-model="state.about_doctor"
            class=""
            :ui="MainInputConfig()"
            :placeholder="$t('form.type')"
            maxlength="1000"
          >
          </UTextarea>
          <p class="w-full text-end text-pumice font-normal text-xs mt-2">
            {{ state.about_doctor?.length }}/1000 {{ $t("form.symbols") }}
          </p>
        </UFormGroup>

        <UFormGroup
          :label="$t('form.spec_docs')"
          name="last_name"
          class="rounded-2xl mt-3 w-full"
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
      <div class="flex justify-start mt-10 w-[48%]">
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
      <UButton
        @click="logoutConfirmVisible = true"
        variant="link"
        color="valencia"
        class="w-full flex justify-center text-base font-semibold"
        >{{ $t("button.delete_spec") }}</UButton
      >
    </UForm>
    <CommonUiModalConfirm
      v-model="logoutConfirmVisible"
      :title="$t('modal.delete')"
      :body="$t('modal.delete_spec')"
      @handleOk="deleteSpec"
    />
  </div>
</template>
