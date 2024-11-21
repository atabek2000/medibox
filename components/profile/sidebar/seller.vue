<script setup>
import { ProfileSidebarButtonConfig } from "~/composables/ui/useConfig";

const props = defineProps({
  user: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="profile-sidebar flex flex-col gap-y-5">
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/product"
      :class="
        $route.path.includes('/profile/product') ? 'text-japanese-laurel' : ''
      "
    >
      <template #leading>
        <img src="~assets/svg/profile/history.svg" alt="" />
      </template>
      {{ $t("bread_crumb.my_products") }}</UButton
    >
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/room"
      :class="
        $route.path.includes('/profile/room') ? 'text-japanese-laurel' : ''
      "
    >
      <template #leading>
        <img src="~assets/svg/profile/room.svg" alt="" />
      </template>
      {{ $t("bread_crumb.room") }}</UButton
    >
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/equipment"
      :class="
        $route.path.includes('/profile/equipment') ? 'text-japanese-laurel' : ''
      "
    >
      <template #leading>
        <img src="~assets/svg/profile/equipment.svg" alt="" />
      </template>
      {{ $t("bread_crumb.equipment") }}</UButton
    >
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/order"
      :class="
        $route.path.includes('/profile/order') ? 'text-japanese-laurel' : ''
      "
    >
      <template #leading>
        <img src="~assets/svg/profile/applications.svg" alt="" />
      </template>
      {{ $t("bread_crumb.applications") }}</UButton
    >
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/history"
      :class="
        $route.path.includes('/profile/history') ? 'text-japanese-laurel' : ''
      "
    >
      <template #leading>
        <img src="~assets/svg/profile/shopping-bag.svg" alt="" />
      </template>
      {{ $t("bread_crumb.order_history") }}</UButton
    >
    <ProfileModalCity :user="user" />
    <ProfileModalLang :user="user" />
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/address"
      :class="$route.path === '/profile/address' ? 'text-japanese-laurel' : ''"
    >
      <template #leading>
        <img src="~assets/svg/profile/address.svg" alt="" />
      </template>
      {{ $t("bread_crumb.addresses") }}</UButton
    >
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/faq"
      :class="$route.path === '/profile/faq' ? 'text-japanese-laurel' : ''"
    >
      <template #leading>
        <img src="~assets/svg/profile/faq.svg" alt="" />
      </template>
      FAQ</UButton
    >
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/support"
      :class="$route.path === '/profile/support' ? 'text-japanese-laurel' : ''"
    >
      <template #leading>
        <img src="~assets/svg/profile/support.svg" alt="" />
      </template>
      {{ $t("bread_crumb.tech_support2") }}</UButton
    >
    <UButton
      variant="ghost"
      :ui="ProfileSidebarButtonConfig()"
      to="/profile/docs"
      :class="$route.path === '/profile/docs' ? 'text-japanese-laurel' : ''"
    >
      <template #leading>
        <img src="~assets/svg/profile/docs.svg" alt="" />
      </template>
      {{ $t("content.documents") }}</UButton
    >
    <ProfileModalDeleteAccount />
    <ProfileModalLogout />
  </div>
</template>
