<template>
  <div class="flex justify-center flex-col :md-flex-row items-center py-16">
    <img src="~assets/svg/basket/empty.svg" alt="empty" />
    <div
      class="flex justify-center items-center flex-col max-w-[340px] px-10 py-7"
    >
      <div>
        <p class="font-bold text-3xl">{{ $t("basket.empty") }}</p>
        <p class="font-normal text-xl mt-4">
          {{ $t("basket.empty_text") }}
        </p>
      </div>
    </div>
  </div>
</template>
