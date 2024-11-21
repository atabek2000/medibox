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
  <div class="product-item relative w-full md:w-[276px] 2xl:w-[276px]">
    <NuxtLink
      :to="
        product.medicine?.area_sale?.id === 1
          ? `pharmacies/${product.user.id}/${product.id}`
          : `imn/${product.user.id}/${product.id}`
      "
    >
      <CommonUiButtonAddFavourite
        class="absolute right-3 top-3"
        :is_favourite="product.is_in_favorite"
        :url="`medicines/favorite-medicine/${product.id}`"
        @refresh="emits('refresh')"
      />
      <img
        :src="
          product.medicine?.photo && product.medicine?.photo[0]
            ? product.medicine?.photo[0]
            : '/common/avatar.png'
        "
        alt="eq_img"
        class="rounded-2xl object-cover h-[160px] 2xl:h-[160px] w-full"
      />
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
      <p class="text-base font-semibold mt-2">
        {{ product.medicine?.[locale === "ru" ? "name" : `name_${locale}`] }}
      </p>
      <p
        v-if="
          product.user?.[
            locale === 'ru'
              ? 'organisation_name'
              : `organisation_name_${locale}`
          ]
        "
        class="text-japanese-laurel font-normal text-sm"
      >
        {{
          $t("content.from", {
            seller:
              product.user?.[
                locale === "ru"
                  ? "organisation_name"
                  : `organisation_name_${locale}`
              ],
          })
        }}
      </p>
    </NuxtLink>
  </div>
</template>
