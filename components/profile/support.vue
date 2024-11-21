<script setup>
const props = defineProps({
  contacts: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <div class="profile-support">
    <div>
      <div
        class="support-block flex justify-center items-center rounded-2xl flex-col py-12"
      >
        <img
          src="~assets/svg/support/support-icon.svg"
          alt="support"
          class="transform transition-transform duration-200"
        />
        <CommonUiLogoWhite class="mt-6" />
        <p class="font-medium text-base text-white mt-2">
          {{ $t("content.has_questions") }}
        </p>
      </div>
      <div class="flex flex-col flex-wrap md:flex-row mt-5">
        <nuxt-link
          v-for="(contact, index) in contacts.filter(
            (el) => el.type === 'email'
          )"
          :key="contact.email"
          :to="`mail:${contact.email}`"
          class="flex gap-x-3 py-3 w-full md:w-1/3"
          :class="
            (index + 1) % 3 === 2
              ? 'md:justify-center'
              : (index + 1) % 3 === 0
              ? 'md:justify-end'
              : ''
          "
        >
          <img src="~assets/svg/common/google.svg" alt="google" />
          <p class="font-normal text-base">
            {{ contact.email }}
          </p>
        </nuxt-link>
      </div>
      <div class="flex flex-col flex-wrap md:flex-row mt-5">
        <nuxt-link
          v-for="(contact, index) in contacts.filter(
            (el) => el.type === 'phone'
          )"
          :key="contact.phone"
          :to="`tel:${contact.phone}`"
          class="flex gap-x-3 py-3 w-full md:w-1/3"
          :class="
            (index + 1) % 3 === 2
              ? 'md:justify-center'
              : (index + 1) % 3 === 0
              ? 'md:justify-end'
              : ''
          "
        >
          <img src="~assets/svg/common/whatsapp-white.svg" alt="whatsapp" />
          <p class="font-normal text-base">
            {{ changePhoneMask(contact.phone) }}
          </p>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<style>
.support-block {
  background: linear-gradient(134.68deg, #aaffdd 15.68%, #5dd148 86.4%);
}
</style>
