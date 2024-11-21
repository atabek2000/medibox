<script setup>
import { ActiveBadgeConfig, MainBadgeConfig } from "~/composables/ui/useConfig";

const isOpen = defineModel();

const selected_role_id = ref(4);
const setSelectedRole = (id) => {
  selected_role_id.value = id;
};
</script>

<template>
  <div>
    <UModal v-model="isOpen">
      <div class="roles-list-block px-14 py-9">
        <div class="flex justify-between">
          <p class="font-semibold text-xl">{{ $t("modal.become_partner") }}</p>
          <img
            src="~assets/svg/common/close-modal.svg"
            alt="close"
            class="cursor-pointer"
            @click="isOpen = false"
          />
        </div>
        <p class="font-medium text-base mt-2">
          {{ $t("modal.become_partner_text") }}
        </p>
        <p class="font-normal text-sm mb-2 mt-6">
          {{ $t("auth.select_role") }}
        </p>
        <UBadge
          @click="setSelectedRole(4)"
          :ui="selected_role_id === 4 ? ActiveBadgeConfig() : MainBadgeConfig()"
          class="mb-2"
          >{{ $t("auth.organization") }}</UBadge
        >
        <UBadge
          @click="setSelectedRole(3)"
          :ui="selected_role_id === 3 ? ActiveBadgeConfig() : MainBadgeConfig()"
          class="mb-2"
          >{{ $t("auth.seller") }}</UBadge
        >
        <UBadge
          @click="setSelectedRole(2)"
          :ui="selected_role_id === 2 ? ActiveBadgeConfig() : MainBadgeConfig()"
          class="mb-2"
          >{{ $t("auth.specialist") }}</UBadge
        >
        <ProfileBecomePartnerOrganisation v-if="selected_role_id === 4" />
        <ProfileBecomePartnerSeller v-else-if="selected_role_id === 3" />
        <ProfileBecomePartnerSpecialist v-else />
      </div>
    </UModal>
  </div>
</template>
