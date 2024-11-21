<script setup>
import { ProfileSidebarRedButtonConfig } from "~/composables/ui/useConfig";
const { logout } = useAuth();
const logoutConfirmVisible = ref(false);
const logoutUser = () => {
  logout();
  useRouter().push("/");
};
</script>
<template>
  <div class="logout-modal">
    <UButton
      variant="ghost"
      :ui="ProfileSidebarRedButtonConfig()"
      class="text-start"
      @click="logoutConfirmVisible = true"
    >
      <template #leading>
        <img src="~assets/svg/profile/logout.svg" alt="" />
      </template>
      {{ $t("content.logout_account") }}</UButton
    >
    <CommonUiModalConfirm
      v-model="logoutConfirmVisible"
      :title="$t('modal.logout')"
      :body="$t('modal.want_logout')"
      @handleOk="logoutUser"
    />
  </div>
</template>
