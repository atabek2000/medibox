<script setup>
const props = defineProps({
  duration: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="absolute left-3 top-3">
    <p
      v-if="duration"
      class="bg-pumice font-normal text-xs px-2 py-1 rounded-lg mb-1"
    >
      {{ $t(`fields.duration.${duration}`) }}
    </p>
    <p
      v-if="status === 'active'"
      class="bg-emerald-100 text-japanese-laurel font-normal text-xs px-2 py-1 rounded-lg mb-1"
    >
      {{ $t("content.available") }}
    </p>
    <p
      v-if="status === 'inactive'"
      class="bg-persian-red-200 text-persian-red font-normal text-xs px-2 py-1 rounded-lg mb-1"
    >
      {{ $t("content.unavailable") }}
    </p>
  </div>
</template>
