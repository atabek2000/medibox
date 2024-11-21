<script setup>
const isOpen = defineModel();
const props = defineProps({
  images: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <div class="photo-carousel">
    <UModal
      v-model="isOpen"
      :ui="{
        shadow: '',
        width: 'w-full sm:max-w-[100%]',
        padding: 'p-0 sm:p-0',
        container: 'flex min-h-full  items-start sm:items-start',
        base: 'text-left rtl:text-right flex flex-col h-screen bg-none bg-opacity-0',
      }"
    >
      <div class="h-screen">
        <div class="flex justify-end pr-4">
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="isOpen = false"
          />
        </div>
        <UCarousel
          v-slot="{ item }"
          :items="images"
          arrows
          indicators
          :ui="{
            item: 'basis-full',
            container: 'rounded-lg h-[100%]',
          }"
          class="h-[90%]"
        >
          <div class="w-full flex justify-center">
            <img :src="item" class="object-contain" />
          </div>
        </UCarousel>
      </div>
    </UModal>
  </div>
</template>
