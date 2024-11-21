<script setup>
const { locale } = useI18n();

const props = defineProps({
  product: {
    type: Object,
    default: {},
  },
});
const emits = defineEmits(["refresh"]);
</script>

<template>
  <div class="pharmacy-item relative w-[48%] md:w-[200px] 2xl:w-[276px]">
    <NuxtLink :to="`/specialists/${product.id}`">
      <CommonUiButtonAddFavourite
        :is_favourite="product.is_in_favorite"
        :url="`users/favorite-user/${product.id}`"
        class="absolute right-3 top-3"
        @refresh="emits('refresh')"
      />
      <img
        :src="product?.avatar[0] ?? '/common/avatar.png'"
        alt="img"
        class="rounded-2xl w-full h-[200px] 2xl:h-[276px] object-cover"
      />
      <p class="text-base font-semibold mt-4">
        {{ product.first_name }} {{ product.last_name }}
      </p>
      <p class="text-sm font-normal mt-1">
        {{ product.category?.[`name${locale === "ru" ? "" : "_" + locale}`] }}
      </p>
      <div class="flex justify-between mt-4">
        <CommonUiRatingBlock :rating="product.rating ?? 5" />
      </div>
    </NuxtLink>
  </div>
</template>
