<script setup>
const cookie_user = useCookie("user");
const cookie_jwt = useCookie("jwt");
const cookie_city = useCookie("city");
const { locale } = useI18n();

const { setAuthModal, setAuthModalOpen, logout } = useAuth();
const isModalOpen = ref(false);
const partnerConfirmVisible = ref(false);
const isPartnerModalOpen = ref(false);
const onClickPartner = () => {
  if (cookie_user.value?.id) {
    isPartnerModalOpen.value = true;
  } else {
    partnerConfirmVisible.value = true;
  }
};

const becomePartner = async () => {
  setAuthModal("register_tab");
  setAuthModalOpen(true);
  await logout();
  useRouter().push("/");
};
</script>
<template>
  <div class="flex">
    <UButton
      v-if="cookie_jwt"
      class="bg-emerald-300 text-black text-base rounded-xl hidden md:flex"
      @click="isModalOpen = true"
    >
      <img src="~/assets/svg/common/location.svg" alt="location" />
      {{ cookie_city?.[locale === "ru" ? "name" : `name_${locale}`] }}
    </UButton>
    <UButton
      v-else
      class="bg-emerald-300 text-black text-base rounded-xl hidden md:flex"
    >
      <img src="~/assets/svg/common/location.svg" alt="location" />
      {{ $t("content.city") }}
    </UButton>
    <UButton
      to="/"
      class="text-black ml-7 text-base hidden xl:flex"
      variant="link"
      >{{ $t("header.main_page") }}</UButton
    >
    <UButton
      to="/favorite"
      class="text-pumice text-base ml-0 md:ml-7"
      variant="link"
      >{{ $t("header.favorite") }}</UButton
    >
    <UButton
      v-if="cookie_user?.type !== 'entity'"
      @click="onClickPartner()"
      class="text-pumice md:ml-7 text-base md:flex"
      variant="link"
      >{{ $t("header.become_partner") }}
    </UButton>
    <CommonUiModalCity v-model="isModalOpen" />
    <CommonUiModalConfirm
      v-model="partnerConfirmVisible"
      :title="$t('modal.become_partner')"
      :body="$t('modal.become_partner_text')"
      @handleOk="becomePartner"
    />
    <ProfileBecomePartnerModal v-model="isPartnerModalOpen" />
  </div>
</template>
