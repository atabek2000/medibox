<script setup>
import {
  MainButtonConfig,
  ActiveBadgeConfig,
  MainBadgeConfig,
} from "~/composables/ui/useConfig";
const { setAuthModal } = useAuth();

const props = defineProps({
  legalType: {
    type: String,
    default: "register_organization",
  },
});

const emit = defineEmits(["setLegalType"]);
</script>
<template>
  <div class="roles-list-block">
    <p class="font-normal text-sm mb-2">{{ $t("auth.select_role") }}</p>
    <UBadge
      @click="emit('setLegalType', 'register_organization')"
      :ui="
        legalType === 'register_organization'
          ? ActiveBadgeConfig()
          : MainBadgeConfig()
      "
      class="mb-2"
      >{{ $t("auth.organization") }}</UBadge
    >
    <UBadge
      @click="emit('setLegalType', 'register_seller')"
      :ui="
        legalType === 'register_seller'
          ? ActiveBadgeConfig()
          : MainBadgeConfig()
      "
      class="mb-2"
      >{{ $t("auth.seller") }}</UBadge
    >
    <UBadge
      @click="emit('setLegalType', 'register_specialist')"
      :ui="
        legalType === 'register_specialist'
          ? ActiveBadgeConfig()
          : MainBadgeConfig()
      "
      class="mb-2"
      >{{ $t("auth.specialist") }}</UBadge
    >
    <UButton
      class="mt-11 w-full flex justify-center"
      :ui="MainButtonConfig()"
      @click="setAuthModal(legalType ? legalType : 'register_organization')"
    >
      {{ $t("button.continue") }}
    </UButton>
  </div>
</template>
