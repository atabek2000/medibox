<script setup>
import {
  ProfileSidebarButtonConfig,
  MainButtonConfig,
} from "~/composables/ui/useConfig";
const cookie_lang = useCookie("lang");
const cookie_user = useCookie("user");
const { profileEdit, profileEditEntity } = useAuth();
const { locale, setLocale } = useI18n();
const isModalOpen = ref(false);
const langs = [
  { value: "kk", label: "Қазақша" },
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
];
const selected = ref(cookie_lang.value ?? "ru");

const save = async () => {
  if (cookie_user.value.type === "individual") {
    await profileEdit({ lang: selected.value });
  } else {
    await profileEditEntity({ lang: selected.value });
  }
  setLocale(selected.value);
  isModalOpen.value = false;
  cookie_lang.value = selected.value;
};
</script>
<template>
  <div class="lang-modal">
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      @click="isModalOpen = true"
    >
      <template #leading>
        <img src="~assets/svg/profile/lang.svg" alt="" />
      </template>
      {{ $t("content.lang") }}</UButton
    >
    <UModal
      v-model="isModalOpen"
      :ui="{ rounded: 'rounded-2xl', width: 'w-full sm:max-w-sm' }"
    >
      <div class="px-4 py-7">
        <div class="flex justify-between">
          <p class="font-semibold text-xl">{{ $t("content.select_lang") }}</p>
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1 p-0"
            @click="isModalOpen = false"
          >
            <img src="~assets/svg/common/close-modal-small.svg" alt=""
          /></UButton>
        </div>
        <div class="mt-4">
          <URadio
            v-for="method of langs"
            :key="method.value"
            v-model="selected"
            v-bind="method"
            class="flex"
            :ui="{
              wrapper: 'flex-row-reverse items-center justify-between py-3',
              label: 'text-base font-normal text-tundora ',
              inner: 'ms-0 flex flex-col',
            }"
          />
        </div>
        <UButton
          @click="save"
          class="mt-4 w-full flex justify-center"
          :ui="MainButtonConfig()"
          >{{ $t("button.select") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>
