<script setup>
import {
  RadioSelectMenuConfig,
  MainSelectConfig,
} from "~/composables/ui/useConfig";
const { useFilter } = usePageFilter();
const { locale } = useI18n();

const filter_cities = ref([]);

const emit = defineEmits(["refresh"]);
const handleChange = () => {
  emit("refresh");
};

onBeforeMount(() => {
  const { useCities } = useDict();

  const cities = useCities();
  filter_cities.value = cities.value;
});
</script>

<template>
  <div class="city-filter mb-6">
    <p class="text-sm font-bold">{{ $t("content.city") }}</p>
    <USelectMenu
      class="mt-3"
      selected-icon="i-ic-baseline-radio-button-checked"
      searchable
      :searchable-placeholder="$t('form.search_city')"
      :placeholder="$t('form.select_city')"
      v-model="useFilter().value.city_id"
      :options="filter_cities"
      value-attribute="id"
      :option-attribute="locale === 'ru' ? 'name' : `name_${locale}`"
      :uiMenu="RadioSelectMenuConfig()"
      :ui="MainSelectConfig()"
      @change="handleChange"
    >
    </USelectMenu>
  </div>
</template>
