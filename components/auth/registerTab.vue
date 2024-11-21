<script setup>
import { MainTabConfig } from "~/composables/ui/useConfig";
const { t } = useI18n();
const emit = defineEmits(["setCurrentForm"]);
const items = [
  {
    key: "private",
    label: t("auth.private"),
  },
  {
    key: "legal",
    label: t("auth.legal"),
  },
];

const selected = ref(1);

const legalType = ref("register_organization");
const setLegalType = (val) => {
  legalType.value = val;
};
</script>
<template>
  <div class="register-tab">
    <p class="font-semibold text-xl">{{ $t("auth.registration") }}</p>
    <UTabs
      v-model="selected"
      :items="items"
      :ui="MainTabConfig()"
      class="bg-none"
    >
      <template #item="{ item }">
        <div v-if="item.key === 'legal'">
          <AuthRolesList :legalType="legalType" @setLegalType="setLegalType" />
        </div>
        <div v-else>
          <AuthRegisterPrivate />
        </div>
      </template>
    </UTabs>
  </div>
</template>
