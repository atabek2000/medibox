<script setup>
const { t, locale } = useI18n();
import { MainButtonConfig } from "~/composables/ui/useConfig";
const { profileEdit, profileEditEntity } = useAuth();
const cookie_city = useCookie("city");
const cookie_user = useCookie("user");

const isModalOpen = defineModel({ required: true });
const cities = ref([]);
const selected = ref(cookie_city.value?.id);

const save = async () => {
  const { useCities } = useDict();
  if (cookie_user.value.type === "individual") {
    await profileEdit({ city_id: selected.value });
  } else {
    await profileEditEntity({ city_id: selected.value });
  }

  isModalOpen.value = false;
  cookie_city.value = useCities().value.filter(
    (cty) => cty.id === selected.value
  )[0];
};

onMounted(() => {
  const { useCities } = useDict();
  cities.value = useCities().value?.map((ct) => {
    return {
      value: ct.id,
      label: ct?.[locale.value === "ru" ? "name" : `name_${locale.value}`],
    };
  });
});
</script>
<template>
  <div>
    <UModal
      v-model="isModalOpen"
      :ui="{ rounded: 'rounded-2xl', width: 'w-full sm:max-w-sm' }"
    >
      <div class="px-4 py-7">
        <div class="flex justify-between">
          <p class="font-semibold text-xl">{{ $t("content.cities") }}</p>
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1 p-0"
            @click="isModalOpen = false"
          >
            <img src="~assets/svg/common/close-modal-small.svg" alt="close"
          /></UButton>
        </div>
        <div class="mt-4">
          <URadio
            v-for="method of cities"
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
