<script setup>
const model = defineModel();
</script>

<template>
  <div class="thanks-modal">
    <UModal
      v-model="model"
      class=""
      :ui="{ width: 'w-full sm:max-w-3xl', rounded: 'rounded-2xl' }"
    >
      <div class="flex justify-center items-center px-24 py-16">
        <div class="flex gap-10 items-center">
          <img src="~assets/svg/basket/success-payment.svg" alt="success" />
          <div>
            <p class="font-bold text-3xl">{{ $t("modal.all_success") }}</p>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
