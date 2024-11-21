<script setup>
const props = defineProps({
  rating: {
    type: Number,
    default: 5,
  },
});
</script>

<template>
  <div class="rating-block flex align-middle">
    <img src="~assets/svg/common/star-gold.svg" alt="star" />
    <span class="ms-1 text-pumice text-xs font-normal">
      {{ Number(rating).toFixed(0) }}
    </span>
  </div>
</template>
