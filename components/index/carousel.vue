<template>
  <div class="carousel-block">
    <UCarousel
      v-slot="{ item }"
      :items="items"
      :ui="{
        item: 'basis-full',
        indicators: {
          wrapper:
            'absolute flex items-center justify-center gap-3 bottom-6 inset-x-0',
          active: 'bg-primary-500',
          inactive: 'bg-wild-sand bg-opacity-100 mix-blend-overlay',
        },
      }"
      class="overflow-hidden"
      indicators
    >
      <div
        class="carousel-item flex bg-wild-sand mb-[60px] mt-6 md:mt-16 rounded-[20px] gap-3 px-4 py-4 md:px-16 md:py-9 flex-col-reverse md:flex-row"
      >
        <div class="carousel-text-block">
          <p
            class="title font-bold text-[44px] leading-[48px] text-black hidden md:block"
          >
            {{ item.title }}
          </p>
          <p class="text font-medium text-xl text-heavy-metal mt-6">
            {{ item.text }}
          </p>
        </div>
        <div class="carousel-img-block w-full md:w-1/3">
          <img :src="item.img" class="w-full" draggable="false" alt="img" />
        </div>
      </div>
    </UCarousel>
  </div>
</template>

<script setup>
const { t } = useI18n();
const items = [
  {
    title: t("banner.title"),
    text: t("banner.text1"),
    img: "/common/carousel.png",
  },
  {
    title: t("banner.title"),
    text: t("banner.text2"),
    img: "/common/carousel2.png",
  },
  {
    title: t("banner.title"),
    text: t("banner.text3"),
    img: "/common/carousel3.png",
  },
];
</script>
