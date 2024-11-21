<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const cookie_user = useCookie("user");
const { startLoading, stopLoading } = useLoader();

const addresses = ref([]);
const deleteConfirmVisible = ref(false);
const editModalVisible = ref(false);
const addAddress = async (state) => {
  startLoading();
  await useFetchApi("auth/create/user-address", {
    method: "POST",
    body: state,
    async onResponse({ request, response, options }) {
      stopLoading();
      const addresses_data = await useFetchApi("auth/user-address");
      addresses.value = addresses_data?.data;
    },
  });
};
const selectedId = ref(0);
const selectedAddress = reactive({});
const editConfirmAddress = (address) => {
  selectedAddress.value = address;
  editModalVisible.value = true;
};
const editAddress = async (address) => {
  startLoading();
  await useFetchApi(`auth/edit-address/${address.id}`, {
    method: "POST",
    body: address,
    async onResponse({ request, response, options }) {
      stopLoading();
      const addresses_data = await useFetchApi("auth/user-address");
      addresses.value = addresses_data?.data;
    },
  });
};
const deleteConfirmAddress = (id) => {
  selectedId.value = id;
  deleteConfirmVisible.value = true;
};
const deleteAddress = async () => {
  startLoading();
  await useFetchApi(`auth/delete-address/${selectedId.value}`, {
    method: "DELETE",
    async onResponse({ request, response, options }) {
      stopLoading();
      const addresses_data = await useFetchApi("auth/user-address");
      addresses.value = addresses_data?.data;
    },
  });
};

onMounted(async () => {
  const addresses_data = await useFetchApi("auth/user-address");
  addresses.value = addresses_data?.data;
});
</script>
<template>
  <div class="address-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('bread_crumb.addresses') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <div v-if="addresses && addresses.length">
          <div class="flex flex-wrap gap-6">
            <AddressProfileCard
              v-for="address in addresses"
              :key="address.id"
              class="w-full md:w-[276px]"
              :address="address"
              @delete="deleteConfirmAddress(address.id)"
              @edit="editConfirmAddress(address)"
            />
          </div>
          <AddressAddModal @addAddress="addAddress" class="mt-8" />
        </div>
        <div v-else>
          <div class="flex justify-center items-center gap-10 py-20">
            <img src="~assets/svg/specialists/success-payment.svg" alt="" />
            <div>
              <p class="font-bold text-3xl">
                {{ $t("content.address_empty") }}
              </p>
              <p class="font-medium text-xl">
                {{ $t("content.address_empty_text") }}
              </p>
            </div>
          </div>
          <AddressAddModal @addAddress="addAddress" />
        </div>
        <CommonUiModalConfirm
          v-model="deleteConfirmVisible"
          :title="$t('modal.delete')"
          :body="$t('modal.delete_address')"
          @handleOk="deleteAddress"
        />
        <AddressEditModal
          v-model="editModalVisible"
          :address="selectedAddress.value"
          @editAddress="editAddress"
        />
      </div>
    </div>
  </div>
</template>
