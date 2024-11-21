<script setup>
const isOpen = defineModel({ required: true });
</script>
<template>
  <div>
    <UModal
      v-model="isOpen"
      :ui="{ width: 'w-full sm:max-w-3xl', rounded: 'rounded-2xl' }"
    >
      <div class="p-6 md:py-16 md:px-24">
        <div class="modal-head flex justify-end">
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="() => (isOpen = false)"
          >
            <img src="~assets/svg/common/close-modal-small.svg" alt=""
          /></UButton>
        </div>
        <div
          class="modal-body mt-4 flex flex-wrap md:flex-nowrap gap-10 items-center justify-center"
        >
          <img src="~assets/svg/specialists/success-payment.svg" alt="" />
          <div>
            <p class="text-3xl font-bold">
              {{ $t("service.appointment_success") }}
            </p>
            <p class="font-normal text-xl text-heavy-metal mt-4">
              {{ $t("service.appointment_success_text") }}
            </p>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
