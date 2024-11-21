<script setup>
const appstoreConfirmVisible = ref(false);
const emit = defineEmits(["closeApps"]);
</script>

<template>
  <div class="fixed z-[2000] bg-wild-sand-200 rounded-2xl mt-2 me-2 p-3">
    <div class="flex justify-between">
      <p class="font-medium text-sm text-shark">
        {{ $t("content.download_app") }}
      </p>
      <img
        src="~assets/svg/common/close-gray.svg"
        alt="close"
        class="pointer"
        @click="emit('closeApps')"
      />
    </div>
    <div class="apps-block flex justify-between p-1">
      <div class="max-w-[200px] me-8">
        <p class="font-normal text-[10px] text-heavy-metal">
          {{ $t("content.upgrade_your_device") }}
        </p>
      </div>
      <div>
        <UButton
          to="https://play.google.com/store/apps/details?id=com.thousand.medi_box"
          target="_blank"
          variant="link"
          class="p-0 md:px-2.5 md:py-1.5"
        >
          <img src="~assets/svg/common/gooogleplay.svg" alt="gooogleplay" />
        </UButton>
        <UButton
          @click="appstoreConfirmVisible = true"
          variant="link"
          class="p-0 md:px-2.5 md:py-1.5"
        >
          <img src="~assets/svg/common/appstore.svg" alt="appstore" />
        </UButton>
      </div>
      <CommonUiModalConfirm
        v-model="appstoreConfirmVisible"
        :title="$t('modal.coming_soon')"
        :body="$t('modal.coming_soon_ios')"
        @handleOk="appstoreConfirmVisible = false"
      />
    </div>
  </div>
</template>
