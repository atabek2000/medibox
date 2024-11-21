<script setup>
const { locale } = useI18n();

const cookie_user = useCookie("user");
const props = defineProps({
  user: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["refresh"]);
const photoModalVisible = ref(false);
const fio = computed(() => {
  // продавец и организация
  if (props?.user?.role?.id > 0 && props?.user?.role?.id !== 2) {
    return props.user?.[
      locale.value === "ru"
        ? "organisation_name"
        : `organisation_name_${locale.value}`
    ];
  }
  // физ лицо и врач
  else {
    return (props.user.first_name ?? "") + " " + (props.user.last_name ?? "");
  }
});
const isEdit = ref(false);
const setIsEdit = (value) => {
  emit("refresh");
  isEdit.value = value;
};
</script>

<template>
  <div class="profile-card w-full">
    <UChip
      size="md"
      position="bottom-right"
      inset
      class="cursor-pointer"
      @click="photoModalVisible = true"
      :ui="{
        base: '-mx-2 rounded-none ring-0',
        background: '',
        position: { 'bottom-right': 'bottom-2 right-2' },
      }"
    >
      <img
        :src="
          user.avatar && user.avatar[0] ? user.avatar[0] : `/common/avatar.png`
        "
        alt="user"
        class="w-24 h-24 rounded-full object-cover"
      />
      <template #content>
        <img src="~assets/svg/profile/camera.svg" alt="camera" />
      </template>
    </UChip>
    <div v-if="!isEdit">
      <div class="flex gap-x-2">
        <span class="text-base font-semibold">{{ fio }}</span
        ><img
          src="~assets/svg/profile/edit-pen.svg"
          alt="edit"
          class="cursor-pointer"
          @click="isEdit = true"
        />
      </div>
      <div class="flex gap-x-2">
        <span class="text-sm font-normal text-pumice">{{
          changePhoneMask("7" + user.phone)
        }}</span>
        <img
          v-if="user.email"
          src="~assets/svg/profile/gray-point.svg"
          alt="point"
        />
        <span class="text-sm font-normal text-pumice">{{ user.email }}</span>
      </div>
    </div>
    <div v-else>
      <ProfileEditOrganization
        v-if="user?.role?.id === 4 && cookie_user?.status === 'active'"
        :user="user"
        @setIsEdit="setIsEdit"
      />
      <ProfileEditSeller
        v-else-if="user?.role?.id === 3 && cookie_user?.status === 'active'"
        :user="user"
        @setIsEdit="setIsEdit"
      />
      <ProfileEditSpecialist
        v-else-if="user?.role?.id === 2 && cookie_user?.status === 'active'"
        :user="user"
        @setIsEdit="setIsEdit"
        @refresh="refresh"
      />
      <ProfileEditPrivate v-else :user="user" @setIsEdit="setIsEdit" />
    </div>
    <!-- <ProfileEditPhotoModal
      v-if="user?.type === 'individual'"
      v-model="photoModalVisible"
      :user="user"
      @refresh="emit('refresh')"
    /> -->
    <ProfileEditPhotoModalOrganization
      v-model="photoModalVisible"
      :user="user"
      @refresh="emit('refresh')"
    />
  </div>
</template>
