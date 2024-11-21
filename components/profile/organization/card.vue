<script setup>
const { locale } = useI18n();

const props = defineProps({
  medicine: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="medicine-card">
    <nuxt-link>
      <div>
        <img
          :src="
            medicine.organisation?.avatar && medicine.organisation?.avatar[0]
              ? medicine.organisation?.avatar[0]
              : '/common/avatar.png'
          "
          alt="avatar"
          class="rounded-2xl object-cover w-full md:min-w-[276px] md:w-[276px] h-[160px] bg-seashell"
        />
        <p class="text-base font-semibold mt-3">
          {{
            medicine.organisation?.[
              locale === "ru"
                ? "organisation_name"
                : `organisation_name_${locale}`
            ]
          }}
        </p>
        <p class="text-sm font-normal text-pumice">
          {{ medicine.organisation.address }}
        </p>
        <p class="text-sm font-normal text-pumice">
          {{ changePhoneMask("7" + medicine.organisation.phone) }}
        </p>
      </div>
    </nuxt-link>
  </div>
</template>
