<script setup>
const props = defineProps({
  address: {
    type: Object,
    default: {},
  },
});

const emit = defineEmits(["delete", "edit"]);
</script>
<template>
  <div class="address-card">
    <div class="ring-1 ring-wild-sand-200 rounded-2xl p-5">
      <div class="flex justify-between">
        <p class="font-semibold text-base">{{ $t("address.address") }}</p>
        <div class="flex gap-2">
          <img
            src="~assets/svg/basket/edit-icon.svg"
            alt="edit"
            class="cursor-pointer"
            @click="emit('edit', address.id)"
          />
          <img
            src="~assets/svg/basket/delete-icon.svg"
            alt="delete"
            class="cursor-pointer"
            @click="emit('delete', address.id)"
          />
        </div>
      </div>
      <div class="flex flex-col gap-y-2 mt-3">
        <div class="flex justify-between">
          <p class="font-normal text-sm tetx-heavy-metal">
            {{ $t("form.city") }}
          </p>
          <p class="font-semibold text-sm">{{ address.city }}</p>
        </div>
        <div class="flex justify-between">
          <p class="font-normal text-sm tetx-heavy-metal">
            {{ $t("form.street") }}
          </p>
          <p class="font-semibold text-sm">{{ address.street }}</p>
        </div>
        <div class="flex justify-between">
          <p class="font-normal text-sm tetx-heavy-metal">
            {{ $t("form.home") }}
          </p>
          <p class="font-semibold text-sm">{{ address.house }}</p>
        </div>
        <div class="flex justify-between">
          <p class="font-normal text-sm tetx-heavy-metal">
            {{ $t("form.entrance") }}
          </p>
          <p class="font-semibold text-sm">
            {{ address.entrance ? address.entrance : "-" }}
          </p>
        </div>
        <div class="flex justify-between">
          <p class="font-normal text-sm tetx-heavy-metal">
            {{ $t("form.floor") }}
          </p>
          <p class="font-semibold text-sm">
            {{ address.floor ? address.floor : "-" }}
          </p>
        </div>
        <div class="flex justify-between">
          <p class="font-normal text-sm tetx-heavy-metal">
            {{ $t("form.flat") }}
          </p>
          <p class="font-semibold text-sm">
            {{ address.flat ? address.flat : "-" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
