<script setup>
const { initDicts } = useDict();
const { initAuth } = useAuth();
useHead({
  titleTemplate: (productCategory) => {
    return productCategory ? `${productCategory} - MediBox` : "MediBox";
  },
});
onBeforeMount(async () => {
  await initDicts();
  await initAuth();
});
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications
      :ui="{ wrapper: 'fixed flex flex-col justify-end z-[1000]' }"
    />
  </NuxtLayout>
</template>
