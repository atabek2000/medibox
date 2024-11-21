<script setup>
const isOpen = ref(false);

const metadata = ref({});
onMounted(() => {
  const { useMetadata } = useDict();
  metadata.value = useMetadata().value?.find(
    (mt) => mt.type === "medibox_terms_use"
  );
});
</script>
<template>
  <div>
    <nuxt-link
      :to="metadata.document"
      target="_blank"
      class="text-base font-normal text-japanese-laurel cursor-pointer select-none"
      >&nbsp; {{ $t("content.with_condition") }}
    </nuxt-link>
    <UModal v-model="isOpen">
      <div class="p-8">
        <div class="modal-head flex justify-between">
          <p class="text-xl font-semibold">{{ $t("content.condition") }}</p>
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="() => (isOpen = false)"
          >
            <img src="~assets/svg/common/close-modal.svg" alt=""
          /></UButton>
        </div>
        <div class="modal-body mt-4">
          <p class="font-normal text-sm">
            Здесь будет представлена информация о условиях. Здесь будет
            представлена информация о условиях. Здесь будет представлена
            информация о условиях.Здесь будет представлена информация о
            условиях. Здесь будет представлена информация о условиях. Здесь
            будет представлена информация о условиях.
          </p>
        </div>
      </div>
    </UModal>
  </div>
</template>
