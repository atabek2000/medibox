<script setup>
const cookie_user = useCookie("user");
const { data: metadatas, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `metadata/`, {})
);
const {
  useAuthModal,
  useAuthExist,
  useAuthModalOpen,
  setAuthModalOpen,
  setAuthModal,
} = useAuth();
const authModal = useAuthModal();
const isOpen = useAuthModalOpen().value;

const onClickLogin = () => {
  setAuthModalOpen(true);
  setAuthModal("login");
};
</script>
<template>
  <div>
    <UButton
      v-if="cookie_user?.id"
      class="text-black text-base"
      variant="link"
      to="/profile"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12H11C6.02944 12 2 16.0294 2 21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21C22 16.0294 17.9706 12 13 12H12C13.3261 12 14.5979 11.4732 15.5355 10.5355C16.4732 9.59785 17 8.32608 17 7ZM11 14C7.51962 13.9991 4.5672 16.5553 4.07 20H19.93C19.4328 16.5553 16.4804 13.9991 13 14H11ZM9 7C9 8.65685 10.3431 10 12 10C12.7956 10 13.5587 9.68393 14.1213 9.12132C14.6839 8.55871 15 7.79565 15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7Z"
          fill="#000100"
        />
      </svg>
      <span class="hidden md:inline-block">
        {{ $t("header.profile") }}
      </span>
    </UButton>
    <UButton
      v-else
      class="text-black text-base"
      variant="link"
      @click="onClickLogin"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12H11C6.02944 12 2 16.0294 2 21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21C22 16.0294 17.9706 12 13 12H12C13.3261 12 14.5979 11.4732 15.5355 10.5355C16.4732 9.59785 17 8.32608 17 7ZM11 14C7.51962 13.9991 4.5672 16.5553 4.07 20H19.93C19.4328 16.5553 16.4804 13.9991 13 14H11ZM9 7C9 8.65685 10.3431 10 12 10C12.7956 10 13.5587 9.68393 14.1213 9.12132C14.6839 8.55871 15 7.79565 15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7Z"
          fill="#000100"
        />
      </svg>
      <span class="hidden md:inline-block">
        {{ $t("button.login_reg") }}
      </span>
    </UButton>
    <UModal
      v-model="useAuthModalOpen().value"
      class="rounded-[20px]"
      :ui="{
        base: 'modal-base rounded-2xl relative text-left rtl:text-right flex lg:max-w-[1020px] ',
        container: 'flex min-h-full items-center justify-center text-center',
      }"
    >
      <div class="auth-modal flex">
        <div
          class="auth-logo-block w-1/2 hidden md:flex flex-col justify-center align-middle"
        >
          <CommonUiLogoWhite class="text-center flex justify-center" />
          <p class="text-white text-center font-medium text-3xl">
            {{ $t("content.welcome") }}
          </p>
        </div>
        <div class="w-full md:w-1/2 p-6 md:py-16 md:px-[90px]">
          <AuthLoginForm v-if="authModal === 'login'" />
          <AuthForgotForm v-if="authModal === 'forgot'" />
          <AuthCodeConfirmForm v-if="authModal === 'code_confirm'" />
          <AuthResetPasswordForm v-if="authModal === 'reset_pass'" />
          <AuthRegisterTab v-if="authModal === 'register_tab'" />
          <AuthRegisterOrganization
            v-if="authModal === 'register_organization'"
            :metadata="metadatas?.data"
          />
          <AuthRegisterSeller
            v-if="authModal === 'register_seller'"
            :metadata="metadatas?.data"
          />
          <AuthRegisterSpecialist
            v-if="authModal === 'register_specialist'"
            :metadata="metadatas?.data"
          />
        </div>
      </div>
    </UModal>
  </div>
</template>

<style scoped>
.auth-logo-block {
  background: linear-gradient(134.68deg, #aaffdd 15.68%, #5dd148 86.4%);
}
</style>
