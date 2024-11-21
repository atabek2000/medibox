<script setup>
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
      <nuxt-link
        :to="`/profile/history/purchase/${rental.id}?type=${rental.type}`"
      >
        <div
          class="flex justify-between ring-1 ring-wild-sand-200 rounded-2xl p-4 mb-6"
        >
          <div class="flex gap-4">
            <img
              :src="
                rental.userProduct?.medicine?.photo[0] ??
                rental.organisationEquipment?.equipment?.photo[0] ??
                '/common/avatar.png'
              "
              alt="avatar"
              class="w-28 h-24 object-cover rounded-xl"
            />
            <div>
              <p class="text-dove-gray text-xs font-normal">#{{ rental.id }}</p>
              <p class="text-base font-bold mt-2">
                {{ priceFormat(rental?.price) }}
              </p>
              <p
                v-if="rental.status === 'new' || rental.status === 'pending'"
                class="text-base font-bold text-indigo mt-2"
              >
                {{ $t("fields.status.wait") }}
              </p>
              <p
                v-if="rental.status === 'canceled'"
                class="text-base font-bold text-valencia mt-2"
              >
                {{ $t("fields.status.canceled") }}
              </p>
              <p
                v-if="rental.status === 'delivered'"
                class="text-base font-bold text-japanese-laurel mt-2"
              >
                {{ $t("fields.status.delivered") }}
              </p>
            </div>
          </div>
          <div>
            <p class="text-dove-gray text-xs font-normal">
              {{ dateToString(rental.created_at.split("T")[0]) }}
            </p>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>
