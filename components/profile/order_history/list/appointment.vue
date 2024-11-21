<script setup>
const { locale } = useI18n();
const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <div class="rental-list">
    <div v-for="rental in data" :key="rental.id">
      <nuxt-link :to="`/profile/history/appointment/${rental.id}`">
        <div
          class="flex justify-between ring-1 ring-wild-sand-200 rounded-2xl p-4 mb-6"
        >
          <div class="flex gap-4">
            <img
              :src="
                rental?.organisation_service?.service?.photo[0] ??
                '/common/avatar.png'
              "
              alt="avatar"
              class="w-28 h-28 object-cover rounded-xl"
            />
            <div>
              <p class="text-sm font-semibold">
                {{ rental?.specialist?.first_name }}
                {{ rental?.specialist?.last_name }}
              </p>
              <p class="font-normal text-sm">
                {{
                  rental?.specialist?.category?.[
                    `name${locale === "ru" ? "" : "_" + locale}`
                  ]
                }}
              </p>
              <div class="flex gap-1 mt-5 mb-2">
                <img src="~assets/svg/common/calendar-green.svg" alt="" />
                <p class="text-sm font-normal">
                  {{ dateToString(rental?.date) }},
                  {{ rental.service_time?.split(":")?.slice(0, 2)?.join(":") }}
                </p>
              </div>
              <p
                v-if="rental.status === 'signed'"
                class="text-base font-bold text-indigo"
              >
                {{ $t("fields.status.wait") }}
              </p>
              <p
                v-if="rental.status === 'accepted'"
                class="text-base font-bold text-indigo"
              >
                {{ $t("fields.status.accepted") }}
              </p>
              <p
                v-if="rental.status === 'canceled'"
                class="text-base font-bold text-valencia"
              >
                {{ $t("fields.status.service_canceled") }}
              </p>
              <p
                v-if="rental.status === 'completed'"
                class="text-base font-bold text-japanese-laurel"
              >
                {{ $t("fields.status.service_done") }}
              </p>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>
