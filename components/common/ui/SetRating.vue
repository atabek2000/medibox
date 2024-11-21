<script setup>
const rating = defineModel({ required: true });

const setRating = (value) => {
  rating.value = value;
};
</script>

<template>
  <div class="set-rating-block flex gap-2">
    <div v-for="n in 5" :key="n">
      <img
        src="~assets/svg/common/star-gold-rating.svg"
        alt="star"
        v-if="n <= rating"
        @click="setRating(n)"
        class="cursor-pointer"
      />
      <img
        v-else
        src="~assets/svg/common/star-gray-rating.svg"
        alt="star"
        @click="setRating(n)"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>
