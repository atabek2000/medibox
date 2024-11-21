<template>
  <div class="category-block">
    <p class="font-bold text-4xl leading-[42px] text-shark">
      {{ $t("content.categories") }}
    </p>
    <div class="categories flex justify-between flex-wrap mt-7 mb-[54px] gap-3">
      <NuxtLink
        v-for="category in categories"
        :key="category.name"
        class="rounded-2xl bg-wild-sand-400 w-[48%] md:w-1/6 md:min-w-[216px] py-[45px]"
        :to="category.url"
      >
        <div class="w-[100%]">
          <img
            class="m-auto"
            :src="`svg/categories/${category.img}`"
            alt="category"
          />
        </div>
        <p class="font-semibold leading-5 text-center mt-3">
          {{ category.name }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const categories = [
  {
    name: t("fields.categories.pharmacy"),
    img: "pharmacies.svg",
    url: "pharmacies",
  },
  {
    name: t("fields.categories.clinics"),
    img: "clinics.svg",
    url: "clinics",
  },
  {
    name: t("fields.categories.specialist"),
    img: "specialists.svg",
    url: "specialists",
  },
  {
    name: t("fields.categories.dentistry"),
    img: "dentistry.svg",
    url: "dentistry",
  },
  {
    name: t("fields.categories.premise"),
    img: "room.svg",
    url: "room",
  },
];
</script>
