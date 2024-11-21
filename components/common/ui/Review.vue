<script setup>
const { locale } = useI18n();
const props = defineProps({
  review: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="starred_button w-full flex gap-4 mb-4">
    <div class="">
      <img
        :src="
          review.user?.avatar && review.user?.avatar[0]
            ? review.user?.avatar[0]
            : '/common/avatar.png'
        "
        alt="avatar"
        class="block w-14 h-14 min-w-14 rounded-full object-cover"
      />
    </div>
    <div class="flex-auto">
      <div class="flex flex-col md:flex-row justify-between">
        <p
          v-if="
            review.user?.[
              locale === 'ru'
                ? 'organisation_name'
                : `organisation_name_${locale}`
            ]
          "
          class="font-semibold text-base"
        >
          {{
            review.user?.[
              locale === "ru"
                ? "organisation_name"
                : `organisation_name_${locale}`
            ]
          }}
        </p>
        <p v-else class="font-semibold text-base">
          {{ review.user?.first_name }} {{ review.user?.last_name }}
        </p>
        <div class="flex">
          <div
            v-for="n in Number.isNaN(Number.parseInt(review.rating))
              ? 1
              : Number.parseInt(review.rating)"
            :key="n"
          >
            <img
              src="~assets/svg/common/star-gold.svg"
              alt="star"
              class="block"
            />
          </div>
        </div>
      </div>
      <p class="font-normal text-base mt-1">{{ review.comment }}</p>
      <div v-if="review.photo && review.photo[0]" class="flex gap-3 mt-3">
        <img
          v-for="img in review.photo"
          :key="img"
          :src="img"
          alt="review"
          class="max-w-16 rounded"
        />
      </div>
      <p class="text-pumice font-normal text-xs mt-1">
        {{ splitDBDate(review.created_at).date.toLocaleString() }}
      </p>
    </div>
  </div>
</template>
