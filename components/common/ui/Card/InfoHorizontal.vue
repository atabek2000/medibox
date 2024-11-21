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
  <div class="flex items-center">
    <p
      v-if="duration"
      class="bg-pumice font-normal text-xs px-2 py-1 rounded-lg mb-1 h-fit me-2"
    >
      {{ $t(`fields.duration.${duration}`) }}
    </p>
    <p
      v-if="status === 'active'"
      class="bg-emerald-100 text-japanese-laurel font-normal text-xs px-2 py-1 rounded-lg mb-1 h-fit"
    >
      {{ $t("content.available") }}
    </p>
    <p
      v-if="status === 'inactive'"
      class="bg-persian-red-200 text-persian-red font-normal text-xs px-2 py-1 rounded-lg mb-1 h-fit"
    >
      {{ $t("content.unavailable") }}
    </p>
  </div>
</template>
