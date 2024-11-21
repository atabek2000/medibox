<script setup>
import { DeliveryMethodRadioConfig } from "~/composables/ui/useConfig";
const emit = defineEmits(["create_invoice"]);
const delivery_methods = ref([]);
const selected_method = ref("postomat");
const cookie_user = useCookie("user");
const deleteMethod = (number) => {
  delivery_methods.value = delivery_methods.value.filter(
    (m) => m.number !== number
  );
};
const addCard = (card) => {
  delivery_methods.value.push({ number: card.number });
};
</script>

<template>
  <div class="payment-method-block">
    <p class="font-semibold text-xl leading-8">
      {{ $t("content.payment_method") }}
    </p>
    <div class="rounded-2xl bg-white py-5 px-4 mt-3">
      <div
        class="card-item flex justify-between"
        v-for="method of delivery_methods"
        :key="method.number"
      >
        <div class="flex gap-2 items-center">
          <URadio
            v-model="selected_method"
            v-bind="method"
            class="mb-4"
            :ui="DeliveryMethodRadioConfig()"
          >
            <template #label>
              <div>
                <p class="text-sm font-normal text-pumice leading-4">
                  {{ $t("content.card") }}
                </p>
                <p class="text-base font-medium">
                  {{ hashCreditCard(method.number) }}
                </p>
              </div>
            </template>
          </URadio>
        </div>
        <img
          @click="deleteMethod(method.number)"
          src="~assets/svg/basket/delete-icon.svg"
          alt="delete"
          class="cursor-pointer"
        />
      </div>
      <PaymentAddCard @addCard="addCard" />
      <UButton
        v-if="cookie_user.type === 'entity'"
        variant="link"
        class="flex justify-center font-semibold text-base w-full text-japanese-laurel mt-3"
        @click="emit('create_invoice')"
        >{{ $t("button.create_invoice") }}</UButton
      >
    </div>
  </div>
</template>
