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
  <div class="pharmacy-item relative w-full md:w-[200px] 2xl:w-[276px]">
    <NuxtLink
      :to="
        product.role?.id === 3
          ? `/pharmacies/${product.id}`
          : product.role?.id === 4
          ? `/clinics/${product.id}`
          : `/specialists/${product.id}`
      "
    >
      <CommonUiButtonAddFavourite
        class="absolute right-3 top-3"
        :is_favourite="product.is_in_favorite"
        :url="`users/favorite-user/${product.id}`"
        @refresh="emits('refresh')"
      />
      <img
        :src="
          product.avatar && product.avatar[0]
            ? product.avatar[0]
            : '/common/avatar.png'
        "
        alt="pharmacy_img"
        class="rounded-2xl w-full h-[200px] 2xl:h-[276px] object-cover"
      />
      <p v-if="product.role?.id === 2" class="text-base font-semibold mt-3">
        {{ product.first_name }} {{ product.last_name }}
      </p>
      <p v-else class="text-base font-semibold mt-3">
        {{
          product?.[
            locale === "ru"
              ? "organisation_name"
              : `organisation_name_${locale}`
          ]
        }}
      </p>
      <p>{{ product.address }}</p>
      <CommonUiRatingBlock class="mt-2" :rating="product.rating ?? 5" />
    </NuxtLink>
  </div>
</template>
