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
    <NuxtLink :to="`/equipment/${product.id}`">
      <CommonUiCardInfo
        :duration="product.type === 'rent' ? product.duration : ''"
        :status="product.status"
      />
      <CommonUiButtonAddFavourite
        class="absolute right-3 top-3"
        :is_favourite="product.is_in_favorite"
        :url="`equipments/favorite-equipment/${product.id}`"
        @refresh="emits('refresh')"
      />
      <img
        :src="
          product?.equipment?.photo?.length > 0
            ? product?.equipment?.photo[0]
            : '/common/avatar.png'
        "
        alt="img"
        class="rounded-2xl h-[200px] w-full 2xl:h-[276px] object-cover"
      />
      <div class="flex justify-between align-top mt-3">
        <p class="font-bold m-0">
          {{ priceFormat(product.price) }}
        </p>
        <CommonUiRatingBlock :rating="product.rating ?? 5" />
      </div>
      <p class="text-base font-semibold mt-2">
        {{ product.equipment?.[locale === "ru" ? "name" : `name_${locale}`] }}
      </p>
      <p
        v-if="
          [3, 4].includes(product.user?.role?.id)
            ? product.user?.[
                locale === 'ru'
                  ? 'organisation_name'
                  : `organisation_name_${locale}`
              ]
            : `${product.user?.first_name} ${product.user?.last_name}`
        "
        class="text-japanese-laurel font-normal text-sm"
      >
        {{
          $t("content.from", {
            seller: [3, 4].includes(product.user?.role?.id)
              ? product.user?.[
                  locale === "ru"
                    ? "organisation_name"
                    : `organisation_name_${locale}`
                ]
              : `${product.user?.first_name} ${product.user?.last_name}`,
          })
        }}
      </p>
    </NuxtLink>
  </div>
</template>
