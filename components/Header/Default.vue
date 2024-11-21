<script setup>
const isAppsOpen = ref(true);
const closeApps = () => {
  isAppsOpen.value = false;
};
</script>

<template>
  <div class="main-container flex justify-between pb-6 bg-white">
    <HeaderUiAppsBlock
      v-if="isAppsOpen"
      class="block md:hidden"
      @closeApps="closeApps"
    />
    <div
      class="left flex items-center md:pt-9"
      :class="isAppsOpen ? 'pt-40 ' : 'pt-9'"
    >
      <CommonUiLogoBlack class="hidden md:block" />
      <nuxt-link to="/">
        <img
          src="~assets/svg/common/logo.svg"
          alt=""
          class="h-[40px] block md:hidden"
        />
      </nuxt-link>
      <HeaderUiButtonList class="ms-3" />
    </div>
    <div class="right flex md:pt-9" :class="isAppsOpen ? 'pt-40' : 'pt-9'">
      <HeaderUiBasket />
      <HeaderUiCabinet />
    </div>
  </div>
</template>
