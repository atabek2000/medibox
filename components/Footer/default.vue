<script setup>
const { setAuthModal, setAuthModalOpen, logout } = useAuth();
const cookie_user = useCookie("user");
const { locale } = useI18n();

const { data: metadatas, refresh } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + `metadata/`, {})
);

const partnerConfirmVisible = ref(false);
const appstoreConfirmVisible = ref(false);
const isPartnerModalOpen = ref(false);

const becomePartner = async () => {
  setAuthModal("register_tab");
  setAuthModalOpen(true);
  await logout();
  useRouter().push("/");
};

const onClickPartner = () => {
  if (cookie_user.value?.id) {
    isPartnerModalOpen.value = true;
  } else {
    partnerConfirmVisible.value = true;
  }
};
</script>

<template>
  <div
    class="main-container flex flex-col md:flex-row pt-16 pb-[120px] bg-[#000100]"
  >
    <div class="footer-left">
      <CommonUiLogoWhite class="p-0 md:px-2.5 md:py-1.5" />
      <div class="flex mt-8">
        <UButton
          to="https://play.google.com/store/apps/details?id=com.thousand.medi_box"
          target="_blank"
          variant="link"
          class="p-0 md:px-2.5 md:py-1.5"
        >
          <img src="~assets/svg/common/gooogleplay.svg" alt="gooogleplay" />
        </UButton>
        <UButton
          to="https://apps.apple.com/kz/app/medibox/id6636541047"
          target="_blank"
          variant="link"
          class="p-0 md:px-2.5 md:py-1.5"
        >
          <img
            class="ml-3"
            src="~assets/svg/common/appstore.svg"
            alt="appstore"
          />
        </UButton>
      </div>
    </div>
    <div class="footer-center flex flex-col ml-0 md:ml-[110px] mt-5 md:mt-0">
      <p class="text-[#FFFFFF80] font-bold">MediBox</p>
      <ULink to="/" variant="link" class="text-pumice-50 mt-3 md:mt-8">{{
        $t("header.main_page")
      }}</ULink>
      <ULink to="/favorite" variant="link" class="text-pumice-50 mt-3">
        {{ $t("header.favorite") }}
      </ULink>
      <ULink
        v-if="cookie_user?.type !== 'entity'"
        to=""
        @click="onClickPartner()"
        variant="link"
        class="text-pumice-50 mt-3 text-left"
      >
        {{ $t("header.become_partner") }}
      </ULink>
      <ULink
        v-for="metadata in metadatas?.data"
        :to="metadata.document"
        target="_blank"
        variant="link"
        class="text-pumice-50 mt-3"
        :key="metadata.id"
      >
        {{ locale === "ru" ? metadata.name : metadata[`name_${locale}`] }}
      </ULink>
    </div>
    <div class="footer-right flex flex-col ml-0 md:ml-[160px] mt-5 md:mt-0">
      <p class="text-[#FFFFFF80] font-bold">{{ $t("content.connect_us") }}</p>
      <ULink
        to="tel:+77074410100"
        variant="link"
        class="text-pumice-50 mt-3 md:mt-8"
        >+7 707 441 01 00</ULink
      >
      <ULink
        to="mailto:info@medibox.kz"
        variant="link"
        class="text-pumice-50 mt-3"
        >info@medibox.kz</ULink
      >
    </div>
    <CommonUiModalConfirm
      v-model="partnerConfirmVisible"
      :title="$t('modal.become_partner')"
      :body="$t('modal.become_partner_text')"
      @handleOk="becomePartner"
    />
    <CommonUiModalConfirm
      v-model="appstoreConfirmVisible"
      :title="$t('modal.coming_soon')"
      :body="$t('modal.coming_soon_ios')"
      @handleOk="appstoreConfirmVisible = false"
    />

    <ProfileBecomePartnerModal v-model="isPartnerModalOpen" />
    <CommonUiLoader />
  </div>
</template>
