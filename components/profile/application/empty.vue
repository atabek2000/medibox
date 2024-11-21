<template>
  <div class="flex justify-center items-center pt-24">
    <div class="flex flex-col md:flex-row gap-3 md:gap-10 items-center">
      <img src="~assets/svg/common/application-empty.svg" alt="application" />
      <div class="flex flex-col justify-center">
        <p class="text-3xl font-bold">{{ $t("content.empty_app") }}</p>
        <p class="text-xl font-normal text-heavy-metal mt-4">
          {{ $t("content.empty_app_text") }}
        </p>
      </div>
    </div>
  </div>
</template>
