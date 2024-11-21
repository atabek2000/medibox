<script setup>
import { MainButtonConfig } from "~/composables/ui/useConfig";

const props = defineProps({
  products: {
    type: Object,
    default: [],
  },
  delivery: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["pay"]);
</script>
<template>
  <div class="total-block py-5 px-4 bg-white rounded-2xl">
    <div class="flex justify-between">
      <p class="font-normal text-sm text-heavy-metal opacity-80">
        {{ $t("content.sum_deliverless") }}
      </p>
      <p class="font-semibold text-sm">
        {{
          priceFormat(
            products.reduce((sum, item) => sum + item.count * item.price, 0)
          )
        }}
      </p>
    </div>
    <div v-if="delivery" class="flex justify-between mt-3">
      <p class="font-normal text-sm text-heavy-metal opacity-80">
        {{ $t("content.delivery") }}
      </p>
      <p class="font-semibold text-sm">
        {{ priceFormat(delivery) }}
      </p>
    </div>
    <div class="flex justify-between mt-3">
      <p class="font-normal text-base text-heavy-metal opacity-80">
        {{ $t("content.total") }}
      </p>
      <p class="font-semibold text-base">
        {{
          priceFormat(
            products.reduce((sum, item) => sum + item.count * item.price, 0) +
              delivery
          )
        }}
      </p>
    </div>

    <UButton
      :ui="MainButtonConfig()"
      class="w-full flex justify-center mt-6"
      @click="emit('pay')"
      >{{ $t("button.pay") }}</UButton
    >
  </div>
</template>
