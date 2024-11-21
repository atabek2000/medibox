<script setup>
const selected_type = defineModel({ required: true });
const { t } = useI18n();
const fav_types = [
  {
    label: t("fields.categories.medicine"),
    value: "medicine",
  },
  {
    label: t("fields.categories.pharmacy"),
    value: "seller",
  },
  {
    label: t("fields.categories.organisation"),
    value: "organisation",
  },
  {
    label: t("fields.categories.service"),
    value: "service",
  },
  {
    label: t("fields.categories.equipment"),
    value: "equipment",
  },
  {
    label: t("fields.categories.premise"),
    value: "premise",
  },

  {
    label: t("fields.categories.specialist"),
    value: "specialist",
  },
];
</script>
<template>
  <div class="favorite-sidebar border-e">
    <p class="text-sm font-bold">{{ $t("content.your_choice") }}</p>
    <div class="types-block">
      <URadio
        v-for="method of fav_types"
        :key="method.value"
        v-model="selected_type"
        v-bind="method"
        class="mt-3"
        :label="method.label"
        :ui="{
          label: 'text-sm font-normal text-black-700 dark:text-gray-200',
        }"
        @change="$emit('refresh')"
      />
    </div>
  </div>
</template>
