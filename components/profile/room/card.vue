<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { locale } = useI18n();
const props = defineProps({
  room: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="pharmacy-item w-1/4 max-w-[276px] w-full relative">
    <NuxtLink :to="`/profile/room/edit/${room.id}`">
      <CommonUiCardInfo :duration="room.duration" />
      <img
        :src="
          room.photo && room.photo[0] ? room.photo[0] : '/common/avatar.png'
        "
        alt="eq_img"
        class="rounded-2xl w-[200px] h-[200px] 2xl:w-[276px] 2xl:h-[276px] object-cover"
      />
      <p class="font-bold mt-3">
        {{ priceFormat(room.price) }}
      </p>
      <p class="text-base font-semibold mt-2">
        {{ room.purpose?.[`name${locale === "ru" ? "" : "_" + locale}`]
        }}{{
          room.square ? `, ${room.square} ${$t("content.square_meter")}` : ""
        }}
      </p>
      <p class="font-normal text-sm text-pumice">{{ room.address }}</p>
      <UButton
        :ui="TransparentButtonConfig()"
        class="flex justify-center w-full mt-2"
        >{{ $t("button.edit") }}
        <img src="~assets/svg/common/edit-pen.svg" alt="" class="ms-2" />
      </UButton>
    </NuxtLink>
  </div>
</template>
