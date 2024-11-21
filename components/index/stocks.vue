<script setup>
const { data, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + "main/promotions/")
);

const categories = [
  {
    image: "/common/avatar.png",
  },
  {
    image: "/common/avatar.png",
  },
];

const carouselRef = ref({});
const disabledButton = ref("");

const slidePrev = () => {
  checkSlide();
  carouselRef.value.prev();
};

const slideNext = () => {
  checkSlide();
  carouselRef.value.next();
};

const checkSlide = () => {
  if (carouselRef.value.page === carouselRef.value.pages) {
    disabledButton.value = "right";
  }
  if (carouselRef.value.page === 1) {
    disabledButton.value = "left";
  }
};
</script>

<template>
  <div class="stocks-block">
    <div class="flex justify-between align-middle">
      <p class="font-bold text-4xl leading-[42px] text-shark">
        {{ $t("content.sales") }}
      </p>
      <div class="flex">
        <UButton
          @click="slidePrev()"
          class="shadow-none p-2 ring-black disabled:opacity-50"
          icon="i-heroicons-arrow-left-16-solid"
          color="white"
          variant="solid"
          :disabled="disabledButton === 'left'"
        ></UButton>
        <UButton
          @click="slideNext()"
          class="shadow-none p-2 ms-4 ring-black disabled:opacity-50"
          icon="i-heroicons-arrow-right-16-solid"
          color="white"
          variant="solid"
          :disabled="disabledButton === 'right'"
        ></UButton>
      </div>
    </div>
    <UCarousel
      :items="data?.data && data?.data?.length > 0 ? data?.data : categories"
      ref="carouselRef"
      v-slot="{ item }"
      :ui="{
        container:
          'relative w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6',
        item: 'basis-full md:basis-1/2 lg:basis-1/3',
        indicators: {
          wrapper:
            'absolute flex items-center justify-center gap-3 bottom-0 inset-x-0',
        },
      }"
      class="stock-carousel rounded-lg overflow-hidden mt-7 mb-14 pb-8"
      indicators
    >
      <div
        class="rounded-xl bg-wild-sand-400 px-[68px] pt-[43px] pb-[25px] w-full"
      >
        <p class="text-5xl text-center text-[#5536F0] mb-6"></p>
        <div class="w-[100%]">
          <img class="m-auto w-full" :src="`${item.image}`" alt="image" />
        </div>
      </div>
    </UCarousel>
  </div>
</template>
