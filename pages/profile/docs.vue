<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";

const runtimeConfig = useRuntimeConfig();
const cookie_jwt = useCookie("jwt");
const { locale } = useI18n();

const { data } = await useAsyncData(() =>
  $fetch(runtimeConfig.public.API_URL + "metadata/", {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);
</script>

<template>
  <div class="profile-page bg-white main-container pb-16">
    <div class="flex justify-between items-center">
      <CommonUiBreadCrumb
        class="mt-10 mb-8"
        :links="[
          { label: $t('bread_crumb.main'), to: '/' },
          { label: $t('bread_crumb.profile'), to: '/profile' },
          { label: $t('content.documents') },
        ]"
      />
      <ProfileSidebar class="block md:hidden" />
    </div>
    <div class="flex gap-x-6">
      <ProfileSidebar class="hidden md:block" />
      <div class="w-full">
        <UButton
          v-for="doc in data.data"
          class="bg-seashell hover:bg-wild-sand text-black font-normal text-sm rounded-2xl p-4 w-full md:w-[450px] flex justify-between mb-3"
          target="blank"
          :key="doc.id"
          :to="doc.document"
        >
          {{ locale === "ru" ? doc.name : doc[`name_${locale}`] }}

          <template #trailing>
            <UIcon
              name="i-heroicons-chevron-right-solid"
              class="w-5 h-5 text-pumice"
            />
          </template>
        </UButton>
      </div>
    </div>
  </div>
</template>
