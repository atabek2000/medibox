<script setup>
const cookie_user = useCookie("user");
</script>

<template>
  <div class="main-container bg-white">
    <IndexCarousel />
    <IndexCategoriesLegal
      v-if="cookie_user?.type === 'entity' && cookie_user?.status === 'active'"
    />
    <IndexCategories v-else />
    <IndexStocks />
  </div>
</template>

<script setup></script>
