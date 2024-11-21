<script setup>
const model = defineModel();
</script>

<template>
  <div class="thanks-modal">
    <UModal
      v-model="model"
      class=""
      :ui="{ width: 'w-full md:max-w-3xl', rounded: 'rounded-2xl' }"
    >
      <div class="flex justify-center items-center px-4 md:px-24 py-16">
        <div class="flex gap-3 md:gap-10 flex-wrap md:flex-nowrap">
          <img
            src="~assets/svg/basket/success-payment.svg"
            alt="payment"
            class="m-auto"
          />
          <div>
            <p class="font-bold text-3xl">{{ $t("basket.thanks") }}</p>
            <p class="font-normal text-xl mt-4">
              {{ $t("basket.thanks_text") }}
            </p>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
