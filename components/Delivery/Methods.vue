<script setup>
import {
  DeliveryMethodRadioConfig,
  DeliveryAddressRadioConfig,
} from "~/composables/ui/useConfig";
const { startLoading, stopLoading } = useLoader();
const { t, locale } = useI18n();
const cookie_city = useCookie("city");

const props = defineProps({
  id: {
    type: Number,
    default: undefined,
    required: true,
  },
  addresses: {
    type: Array,
    default: [],
  },
  organization_address: {
    type: String,
    default: "",
  },
  user_addresses: {
    type: Array,
    default: [],
  },
  delivery_methods: {
    type: Array,
    default: [],
  },
});

const emits = defineEmits(["refresh_addresses", "onChangeMethod"]);

const selected_method = ref("delivery");
const selected_address = ref(0);
const edit_address = reactive({});
const isEditAddressOpen = ref(false);
const deleteConfirmVisible = ref(false);
const selected_delete = ref(0);
const open = ref();

const postomat_accordion = [
  {
    label: t("basket.select_postomat"),
    defaultOpen: true,
    slot: "content",
  },
];

const getLabelFromAddress = (address) => {
  return `${t("content.city_short")} ${
    address?.city_id?.[locale.value === "ru" ? "name" : `name_${locale.value}`]
  } ${t("content.street_short")} ${address.street}, ${address.house} ${
    address.flat ? t("content.apart_short") + address.flat : ""
  }`;
};

const setEditAddress = (addr) => {
  edit_address.value = addr;
  isEditAddressOpen.value = true;
};

const isShowAllPostomats = ref(false);
const showAllPostomats = () => {
  isShowAllPostomats.value = !isShowAllPostomats.value;
};

const editAddress = async (address) => {
  startLoading();
  await useFetchApi(`auth/edit-address/${address.id}`, {
    method: "POST",
    body: address,
    async onResponse({ request, response, options }) {
      stopLoading();
      emits("refresh_addresses");
    },
  });
};
const addAddress = async (state) => {
  startLoading();
  await useFetchApi("auth/create/user-address", {
    method: "POST",
    body: state,
    async onResponse({ request, response, options }) {
      stopLoading();
      emits("refresh_addresses");
    },
  });
};
const deleteConfirmAddress = (id) => {
  selected_delete.value = id;
  deleteConfirmVisible.value = true;
};
const deleteAddress = async () => {
  startLoading();
  await useFetchApi(`auth/delete-address/${selected_delete.value}`, {
    method: "DELETE",
    async onResponse({ request, response, options }) {
      stopLoading();
      emits("refresh_addresses");
    },
  });
};

const handleSelectedMethod = () => {
  selected_address.value = 0;
  emits("onChangeMethod", {
    id: props.id,
    method: selected_method.value,
    address: selected_address.value,
  });
};
const handleSelectedAddress = (local_code = undefined) => {
  emits("onChangeMethod", {
    id: props.id,
    method: selected_method.value,
    address: selected_address.value,
    local_code,
  });
};
</script>

<template>
  <div class="delivery-method">
    <p class="font-semibold text-xl leading-8">
      {{ $t("basket.delivery_method") }}
    </p>
    <div class="flex flex-wrap md:flex-nowrap gap-y-2 justify-between mt-4">
      <URadio
        v-for="method of delivery_methods"
        :key="method.value"
        v-model="selected_method"
        v-bind="method"
        :ui="DeliveryMethodRadioConfig()"
        @change="handleSelectedMethod()"
      />
    </div>
    <!-- постомат -->
    <div
      v-if="selected_method === 'postomat'"
      class="bg-white rounded-2xl p-4 mt-3"
    >
      <UAccordion
        :items="postomat_accordion"
        :ui="{ wrapper: 'flex flex-col w-full' }"
      >
        <template #default="{ open }">
          <UButton
            color="gray"
            variant="ghost"
            class="border-none p-0"
            :ui="{ rounded: 'rounded-none' }"
          >
            <span class="text-japanese-laurel font-medium text-base">{{
              $t("basket.select_postomat")
            }}</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-up-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200 text-wild-sand-800"
                :class="[open && 'rotate-180']"
              />
            </template>
          </UButton>
        </template>
        <template #content>
          <div class="pt-4">
            <URadio
              v-for="method of isShowAllPostomats
                ? addresses
                : addresses.slice(0, 10)"
              :key="method.Address"
              v-model="selected_address"
              :value="method.Address"
              :label="method.Address"
              class="mb-4"
              :ui="DeliveryAddressRadioConfig()"
              @change="handleSelectedAddress(method.LocalityCode)"
            />
            <UButton
              v-if="!isShowAllPostomats && addresses.length > 10"
              variant="link"
              :ui="{ padding: 'p-0' }"
              class="text-japanese-laurel mt-3"
              @click="showAllPostomats"
              >{{ $t("catalog.show_all") }}</UButton
            >
            <UButton
              v-if="isShowAllPostomats && addresses.length > 10"
              variant="link"
              :ui="{ padding: 'p-0' }"
              class="text-japanese-laurel mt-3"
              @click="showAllPostomats"
              >{{ $t("catalog.show_less") }}</UButton
            >
          </div>
        </template>
      </UAccordion>
    </div>
    <!-- доставка -->
    <div
      v-else-if="selected_method === 'delivery'"
      class="bg-white rounded-2xl p-4 mt-3"
    >
      <UAccordion
        :items="postomat_accordion"
        :ui="{ wrapper: 'flex flex-col w-full' }"
      >
        <template #default>
          <UButton
            color="gray"
            variant="ghost"
            class="border-none p-0"
            :ui="{ rounded: 'rounded-none' }"
          >
            <span class="text-japanese-laurel font-medium text-base">{{
              $t("basket.my_addresses")
            }}</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-up-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200 text-wild-sand-800"
                :class="[open && 'rotate-180']"
              />
            </template>
          </UButton>
        </template>
        <template #content>
          <div class="pt-4">
            <div
              class="flex justify-between items-center mb-4"
              v-for="method of user_addresses"
              :key="method.id"
            >
              <URadio
                v-model="selected_address"
                :value="method.id"
                :label="getLabelFromAddress(method)"
                class=""
                :ui="DeliveryAddressRadioConfig()"
                @change="handleSelectedAddress()"
              />
              <UDropdown
                :items="[[{ slot: 'main' }]]"
                :popper="{ placement: 'bottom-start' }"
                :ui="{ rounded: 'rounded-2xl', item: { active: 'bg-white' } }"
              >
                <img src="~assets/svg/common/more-icon.svg" alt="more" />

                <template #main>
                  <div class="p-4">
                    <div class="flex gap-1 mb-6">
                      <UButton
                        variant="ghost"
                        class="p-0"
                        :ui="{ variant: { ghost: 'hover:bg-white' } }"
                        @click="deleteConfirmAddress(method.id)"
                      >
                        <img
                          src="~assets/svg/basket/delete-icon.svg"
                          alt="delete"
                        />
                        <p class="text-coral-red font-semibold text-base">
                          {{ $t("button.delete") }}
                        </p>
                      </UButton>
                    </div>
                    <div class="flex gap-1">
                      <UButton
                        @click="setEditAddress(method)"
                        variant="ghost"
                        class="p-0"
                        :ui="{ variant: { ghost: 'hover:bg-white' } }"
                      >
                        <img
                          src="~assets/svg/basket/edit-icon.svg"
                          alt="edit"
                        />
                        <p class="font-semibold text-base text-black">
                          {{ $t("button.edit") }}
                        </p>
                      </UButton>
                    </div>
                  </div>
                </template>
              </UDropdown>
            </div>
          </div>
        </template>
      </UAccordion>

      <AddressAddModal @addAddress="addAddress" />
    </div>
    <!-- экспресс -->
    <div
      v-else-if="selected_method === 'express'"
      class="bg-white rounded-2xl p-4 mt-3"
    >
      <UAccordion
        :items="postomat_accordion"
        :ui="{ wrapper: 'flex flex-col w-full' }"
      >
        <template #default>
          <UButton
            color="gray"
            variant="ghost"
            class="border-none p-0"
            :ui="{ rounded: 'rounded-none' }"
          >
            <span class="text-japanese-laurel font-medium text-base">{{
              $t("basket.my_addresses")
            }}</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-up-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200 text-wild-sand-800"
                :class="[open && 'rotate-180']"
              />
            </template>
          </UButton>
        </template>
        <template #content>
          <div class="pt-4">
            <div
              class="flex justify-between items-center mb-4"
              v-for="method of user_addresses.filter(
                (ua) => ua.city_id?.id !== cookie_city.id
              )"
              :key="method.id"
            >
              <URadio
                v-model="selected_address"
                :value="method.id"
                :label="getLabelFromAddress(method)"
                :ui="DeliveryAddressRadioConfig()"
                @change="handleSelectedAddress()"
              />
              <UDropdown
                :items="[[{ slot: 'main' }]]"
                :popper="{ placement: 'bottom-start' }"
                :ui="{ rounded: 'rounded-2xl', item: { active: 'bg-white' } }"
              >
                <img src="~assets/svg/common/more-icon.svg" alt="more" />

                <template #main>
                  <div class="p-4">
                    <div class="flex gap-1 mb-6">
                      <UButton
                        @click="deleteConfirmAddress(method.id)"
                        variant="ghost"
                        class="p-0"
                        :ui="{ variant: { ghost: 'hover:bg-white' } }"
                      >
                        <img
                          src="~assets/svg/basket/delete-icon.svg"
                          alt="delete"
                        />
                        <p class="text-coral-red font-semibold text-base">
                          {{ $t("button.delete") }}
                        </p>
                      </UButton>
                    </div>
                    <div class="flex gap-1">
                      <UButton
                        @click="setEditAddress(method)"
                        variant="ghost"
                        class="p-0"
                        :ui="{ variant: { ghost: 'hover:bg-white' } }"
                      >
                        <img
                          src="~assets/svg/basket/edit-icon.svg"
                          alt="edit"
                        />
                        <p class="font-semibold text-base text-black">
                          {{ $t("button.edit") }}
                        </p>
                      </UButton>
                    </div>
                  </div>
                </template>
              </UDropdown>
            </div>
          </div>
        </template>
      </UAccordion>

      <AddressAddModal @addAddress="addAddress" />
    </div>
    <!-- самовывоз -->
    <div
      v-else-if="selected_method === 'pickup'"
      class="bg-white rounded-2xl p-4 mt-3"
    >
      <UAccordion
        :items="postomat_accordion"
        :ui="{ wrapper: 'flex flex-col w-full' }"
      >
        <template #default>
          <UButton
            color="gray"
            variant="ghost"
            class="border-none p-0"
            :ui="{ rounded: 'rounded-none' }"
          >
            <span class="text-japanese-laurel font-medium text-base">{{
              $t("basket.select_pickup")
            }}</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-up-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200 text-wild-sand-800"
                :class="[open && 'rotate-180']"
              />
            </template>
          </UButton>
        </template>
        <template #content>
          <div class="pt-4">
            <URadio
              v-model="selected_address"
              :value="organization_address"
              :label="organization_address"
              class="mb-4"
              :ui="DeliveryAddressRadioConfig()"
              @change="handleSelectedAddress()"
            />
          </div>
        </template>
      </UAccordion>
    </div>
    <AddressEditModal
      v-model="isEditAddressOpen"
      :address="edit_address.value"
      @editAddress="editAddress"
    />
    <CommonUiModalConfirm
      v-model="deleteConfirmVisible"
      :title="$t('modal.delete')"
      :body="$t('modal.delete_address')"
      @handleOk="deleteAddress"
    />
  </div>
</template>
