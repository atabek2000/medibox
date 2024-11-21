<script setup>
const props = defineProps({
  pending: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex flex-col gap-6 items-center pt-4">
    <img
      src="~assets/svg/common/close-gray-big.svg"
      alt=""
      class="w-[48px]"
      :class="{ 'animate-spin': pending }"
    />
    <p v-if="!pending">{{ $t("content.not_found") }}</p>
  </div>
</template>
