<script setup>
import { ProfileSidebarButtonConfig } from "~/composables/ui/useConfig";
const { deleteUser } = useAuth();
const deleteConfirmVisible = ref(false);
const deleteAuthUser = async () => {
  await deleteUser();
  useRouter().push("/");
};
</script>
<template>
  <div class="logout-modal">
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      class="text-start"
      @click="deleteConfirmVisible = true"
    >
      <template #leading>
        <img src="~assets/svg/profile/delete.svg" alt="" />
      </template>
      {{ $t("content.delete_account") }}</UButton
    >
    <CommonUiModalConfirm
      v-model="deleteConfirmVisible"
      :title="$t('modal.delete')"
      :body="$t('modal.delete_account')"
      @handleOk="deleteAuthUser"
    />
  </div>
</template>
