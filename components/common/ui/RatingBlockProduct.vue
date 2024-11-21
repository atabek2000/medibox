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
    <img src="~assets/svg/common/star-gold-product.svg" alt="star" />
    <span class="ms-1 font-semibold text-2xl">{{
      Number(rating).toFixed(0)
    }}</span>
  </div>
</template>
