<script setup>
const model = defineModel({ required: true });
const props = defineProps({
  phone: {
    type: String,
    default: "",
  },
  phones: {
    type: Array,
    default: [],
  },
  whatsapp_phone: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["showModal", "closeModal"]);
</script>

<template>
  <div class="connect-init">
    <UModal v-model="model" :ui="{ rounded: 'rounded-[20px]' }">
      <div class="px-14 py-9">
        <div class="flex justify-between">
          <p class="text-xl font-bold">{{ $t("modal.want_connect") }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="$emit('closeModal', 'init')"
          />
        </div>
        <nuxt-link :to="`tel:${phone}`">
          <div class="flex gap-2 py-3 mt-3 rounde">
            <img src="~assets/svg/common/phone-call.svg" alt="phone-call" />
            <p class="text-xl font-normal">{{ phone }}</p>
          </div>
        </nuxt-link>
        <div v-if="phones.length > 0">
          <nuxt-link
            v-for="phone in phones"
            :key="phone.id"
            :to="`tel:${phone?.phone}`"
          >
            <div class="flex gap-2 py-3 mt-3 rounde">
              <img src="~assets/svg/common/phone-call.svg" alt="phone-call" />
              <p class="text-xl font-normal">
                {{ changePhoneMask("7" + phone?.phone) }}
              </p>
            </div>
          </nuxt-link>
        </div>

        <nuxt-link
          v-if="whatsapp_phone"
          :to="`https://wa.me/${whatsapp_phone}`"
          target="_blank"
        >
          <div class="flex gap-2 py-3 mt-2">
            <img
              src="~assets/svg/common/whatsapp-icon.svg"
              alt="whatsapp-icon"
            />
            <p class="text-xl font-normal text-japanese-laurel">WhatsApp</p>
          </div>
        </nuxt-link>
        <span
          v-if="url"
          class="border-b border-crusta font-medium text-xl text-crusta mt-4 cursor-pointer select-none"
          @click="$emit('showModal', 'managed')"
        >
          {{ $t("button.can_connect") }}
        </span>
      </div>
    </UModal>
  </div>
</template>
