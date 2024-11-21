<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { locale } = useI18n();

const props = defineProps({
  equipment: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="equipment-card md:max-w-[276px] h-full">
    <nuxt-link
      :to="`/profile/equipment/edit/${equipment.id}`"
      class="inline-block h-full w-full"
    >
      <div class="relative flex flex-col justify-between h-full">
        <p
          class="px-2 py-1 mt-2 bg-emerald-100 text-japanese-laurel rounded-lg w-fit absolute left-2"
        >
          {{ $t(`filter.${equipment.equipment?.type}`) }}
        </p>
        <p
          v-if="equipment.type === 'rent'"
          class="px-2 py-1 mt-2 bg-emerald-100 text-japanese-laurel rounded-lg w-fit absolute right-2"
        >
          {{ $t(`fields.duration.${equipment.duration ?? "daily"}`) }}
        </p>
        <img
          :src="
            equipment.equipment?.photo && equipment.equipment?.photo[0]
              ? equipment.equipment?.photo[0]
              : '/common/avatar.png'
          "
          alt="avatar"
          class="rounded-2xl object-cover w-full md:min-w-[276px] md:w-[276px] h-[160px] bg-seashell"
        />
        <p class="text-base font-semibold mt-3">
          {{
            equipment.equipment?.[locale === "ru" ? "name" : `name_${locale}`]
          }}
        </p>
        <p class="text-base font-semibold mt-3">
          {{ priceFormat(equipment.price) }}
        </p>
        <UButton
          :ui="TransparentButtonConfig()"
          class="flex justify-center w-full mt-2"
          >{{ $t("button.edit") }}
          <img src="~assets/svg/common/edit-pen.svg" alt="" class="ms-2" />
        </UButton>
      </div>
    </nuxt-link>
  </div>
</template>
