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
  const { useDicts } = useDict();

  filter_cities.value = useDicts().value.Category;
});
</script>

<template>
  <div class="city-filter mb-6">
    <p class="text-sm font-bold">{{ $t("content.specialization") }}</p>
    <USelectMenu
      class="mt-3"
      selected-icon="i-ic-baseline-radio-button-checked"
      searchable
      :searchable-placeholder="$t('form.search_specialization')"
      :placeholder="$t('form.select_specialization')"
      v-model="useFilter().value.category_id"
      :options="filter_cities"
      value-attribute="id"
      :option-attribute="`name${locale === 'ru' ? '' : '_' + locale}`"
      :uiMenu="RadioSelectMenuConfig()"
      :ui="MainSelectConfig()"
      @change="handleChange"
    >
    </USelectMenu>
  </div>
</template>
