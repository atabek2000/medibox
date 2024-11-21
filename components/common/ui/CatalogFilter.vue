<script setup>
const { useFilter } = usePageFilter();
const { useDicts } = useDict();
const { t, locale } = useI18n();

const emit = defineEmits(["refresh"]);

const props = defineProps({
  filter_type: {
    type: String,
    default: "sort",
  },
  title: {
    type: String,
    default: "",
  },
});

const filter_types = ref({
  sub_organisation_type_id: [],
  dentistry_type_id: [],
  category_id: [],
  purpose_id: [],
  sort: [
    {
      value: "rating",
      label: t("filter.high_rating"),
    },
    {
      value: "cheap",
      label: t("filter.cheap_first"),
    },
    {
      value: "expensive",
      label: t("filter.expensive_first"),
    },
  ],
  duration: [
    {
      value: "",
      label: t("filter.all"),
    },
    {
      value: "daily",
      label: t("fields.duration.daily"),
    },
    {
      value: "monthly",
      label: t("fields.duration.monthly"),
    },
    {
      value: "long_term",
      label: t("fields.duration.long_term"),
    },
  ],
  actual: [
    {
      value: "",
      label: t("filter.all"),
    },
    {
      value: "actual",
      label: t("filter.actual"),
    },
  ],
  type: [
    {
      value: "sale",
      label: t("filter.sale"),
    },
    {
      value: "rent",
      label: t("filter.rent"),
    },
  ],
});

onMounted(() => {
  filter_types.value.sub_organisation_type_id.push({
    value: undefined,
    label: t("filter.all"),
  });
  useDicts()?.value?.SubOrganisationType?.map((so) => {
    filter_types.value.sub_organisation_type_id.push({
      value: so.id,
      label: locale.value === "ru" ? so.name : so[`name_${locale.value}`],
    });
  });
  filter_types.value.dentistry_type_id.push({
    value: undefined,
    label: t("filter.all"),
  });
  useDicts()?.value?.DentistryTypes?.map((so) => {
    filter_types.value.dentistry_type_id.push({
      value: so.id,
      label: locale.value === "ru" ? so.name : so[`name_${locale.value}`],
    });
  });
  useDicts()?.value?.Purpose?.map((so) => {
    filter_types.value.purpose_id.push({
      value: so.id,
      label: locale.value === "ru" ? so.name : so[`name_${locale.value}`],
    });
  });
  filter_types.value.category_id = useDicts()?.value?.Category?.map((so) => {
    return {
      value: so.id,
      label: locale.value === "ru" ? so.name : so[`name_${locale.value}`],
    };
  });
});
</script>

<template>
  <div class="catalog-filter mb-6">
    <p class="text-sm font-bold">{{ title }}</p>
    <URadio
      v-for="method of filter_types[filter_type]"
      :key="method"
      v-model="useFilter().value[filter_type]"
      v-bind="method"
      class="mt-3"
      :ui="{
        label: 'text-sm font-normal text-black-700 dark:text-gray-200',
      }"
      @change="$emit('refresh')"
    />
  </div>
</template>
