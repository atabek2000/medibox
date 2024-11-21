<script setup>
const props = defineProps({
  product: {
    type: Object,
    default: {},
  },
});

const emits = defineEmits(["refresh"]);
</script>

<template>
  <div class="product-item relative w-full md:w-[276px] 2xl:w-[276px]">
    <NuxtLink
      :to="`clinics/${product.user?.id}/service/${product?.service?.id}`"
    >
      <CommonUiButtonAddFavourite
        class="absolute right-3 top-3"
        :is_favourite="product.is_in_favorite"
        :url="`services/favorite-service/${product.id}`"
        @refresh="emits('refresh')"
      />
      <img
        :src="
          product.service?.photo && product.service?.photo[0]
            ? product.service?.photo[0]
            : '/common/avatar.png'
        "
        alt="eq_img"
        class="rounded-2xl w-full h-[160px] 2xl:h-[160px] object-cover"
      />

      <p class="text-base font-semibold mt-2">
        {{
          product.service?.[
            locale === "ru" ? "service_type" : `service_type_${locale}`
          ]
        }}
      </p>
      <p v-if="product.user?.address" class="font-normal text-sm">
        {{ product.user?.address }}
      </p>
      <div class="flex justify-between align-top mt-3">
        <div class="flex gap-3">
          <p
            class="font-bold m-0"
            :class="product.is_promotion ? 'line-through text-pumice' : ''"
          >
            {{ priceFormat(product.price) }}
          </p>
          <p v-if="product.is_promotion" class="font-bold m-0">
            {{ priceFormat(product.promotion) }}
          </p>
        </div>
        <CommonUiRatingBlock :rating="product.rating ?? 5" />
      </div>
    </NuxtLink>
  </div>
</template>
