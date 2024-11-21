<template>
  <div class="flex justify-center items-center pt-24">
    <div class="flex flex-col md:flex-row gap-3 md:gap-10 items-center">
      <img
        src="~assets/svg/common/product-empty.svg"
        alt=""
        class="w-[200px]"
      />
      <div class="flex flex-col">
        <p class="text-3xl font-bold">{{ $t("content.address_empty") }}</p>
        <p class="text-xl font-normal text-heavy-metal w-[400px] mt-4 w-full">
          {{ $t("content.org_empty_text") }}
        </p>
      </div>
    </div>
  </div>
</template>
