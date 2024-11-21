<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
</script>

<template>
  <div class="flex justify-center items-center pt-24">
    <div class="flex flex-col md:flex-row gap-3 md:gap-10 items-center">
      <img src="~assets/svg/common/product-empty.svg" alt="" />
      <div class="flex flex-col justify-between">
        <p class="text-3xl font-bold">{{ $t("content.address_empty") }}</p>
        <p class="text-xl font-normal text-heavy-metal">
          {{ $t("content.product_empty_text") }}
        </p>
        <UButton
          to="/profile/product/add"
          class="text-black w-full md:w-fit px-6 py-2 mt-3"
          :ui="TransparentButtonConfig()"
          >+ {{ $t("button.add") }}</UButton
        >
      </div>
    </div>
  </div>
</template>
