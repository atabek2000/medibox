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
  <div class="pharmacy-item w-[48%] md:w-[200px] 2xl:w-[276px] relative">
    <NuxtLink :to="`/room/${product.id}`">
      <CommonUiCardInfo :duration="product.duration" :status="product.status" />
      <CommonUiButtonAddFavourite
        :is_favourite="product.is_in_favorite"
        :url="`premises/favorite-premise/${product.id}`"
        class="absolute right-3 top-3"
        @refresh="emits('refresh')"
      />
      <img
        :src="
          product.photo && product.photo[0]
            ? product.photo[0]
            : '/common/avatar.png'
        "
        alt="eq_img"
        class="rounded-2xl w-full h-[200px] 2xl:h-[276px] object-cover"
      />
      <p class="font-bold mt-3">
        {{ priceFormat(product.price) }}
      </p>
      <p class="text-base font-semibold mt-2">
        {{ product.purpose?.[`name${locale === "ru" ? "" : "_" + locale}`]
        }}{{
          product.square
            ? `, ${product.square} ${$t("content.square_meter")}`
            : ""
        }}
      </p>
      <p class="font-normal text-sm text-pumice">{{ product.address }}</p>
    </NuxtLink>
  </div>
</template>
