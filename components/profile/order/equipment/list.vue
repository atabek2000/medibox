<script setup>
const { locale } = useI18n();

const cookie_user = useCookie("user");
const props = defineProps({
  order: {
    type: Array,
    default: [],
  },
});
</script>

<template>
  <div class="flex flex-wrap mt-5 gap-3 md:gap-6">
    <nuxt-link
      v-for="app in order"
      :key="app.id"
      :to="`/profile/order/${app.equipment_rentals?.[0]?.id}?type=equipment`"
      class="w-[48%] md:w-fit md:max-w-[276px]"
    >
      <img
        class="w-full md:w-[276px] h-[276px] object-cover rounded-xl"
        :src="
          app.equipment_rentals?.[0]?.organisationEquipment?.equipment?.photo
            ?.length > 0
            ? app.equipment_rentals?.[0]?.organisationEquipment?.equipment
                ?.photo[0]
            : '/common/avatar.png'
        "
        alt="avatar"
      />
      <p class="mt-3 font-semibold text-base">
        {{
          app.equipment_rentals?.[0]?.organisationEquipment?.equipment?.[
            locale === "ru" ? "name" : `name_${locale}`
          ]
        }}
      </p>
      <p
        class="text-base font-semibold"
        :class="{
          ' text-indigo':
            app?.equipment_rentals?.[0].delivery?.status === 'pending' ||
            app?.equipment_rentals?.[0].delivery?.status === 'new',
          ' text-valencia':
            app?.equipment_rentals?.[0].delivery?.status === 'canceled',
          ' text-japanese-laurel':
            app?.equipment_rentals?.[0].delivery?.status === 'delivered',
        }"
      >
        {{
          app?.equipment_rentals?.[0].delivery?.status === "canceled" &&
          app?.equipment_rentals?.[0]?.canceled_user?.id &&
          app?.equipment_rentals?.[0]?.canceled_user?.id !== cookie_user.id
            ? $t(`fields.order_status.canceled_client`)
            : $t(
                `fields.order_status.${app?.equipment_rentals?.[0].delivery?.status}`
              )
        }}
      </p>
      <p class="mt-3 font-semibold text-base">
        {{ priceFormat(app.equipment_rentals?.[0]?.delivery?.price) }}
      </p>
    </nuxt-link>
  </div>
</template>
