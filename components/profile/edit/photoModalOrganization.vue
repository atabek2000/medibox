<script setup>
const { profileEdit } = useAuth();
const { stopLoading, startLoading } = useLoader();

const isOpen = defineModel({ required: true });
const props = defineProps({
  user: {
    type: Object,
    default: {},
  },
});
const emits = defineEmits(["refresh"]);
const { t } = useI18n();

const avatar_input = ref();
const carouselRef = ref();

const deletePhoto = async () => {
  startLoading();
  await useFetchApi("auth/delete-avatar", {
    method: "DELETE",
    body: {
      avatar_path: props.user.avatar[carouselRef.value.page - 1],
    },
    async onResponse({ response }) {
      stopLoading();
      if (response.ok)
        useToast().add({
          title: t("toast.success"),
          description: t("toast.success_saved"),
        });
      emits("refresh");
    },
  });
};

const handleFileChange = async (event) => {
  const images_arr = event.target.files;
  const formData = new FormData();
  for (const image of images_arr) {
    formData.append("avatar[]", image);
  }
  await profileEdit(formData);
  emits("refresh");
};

const fio = computed(() => {
  if (props?.user?.role?.id > 0) {
    return props.user.organisation_name;
  } else {
    return (props.user.first_name ?? "") + " " + (props.user.last_name ?? "");
  }
});

const stopPropagation = (e) => {
  if (e.target.className.includes("close-modal")) {
    isOpen.value = false;
  }
};
</script>

<template>
  <div>
    <UModal
      v-model="isOpen"
      :ui="{
        background: 'dark:bg-gray-900 bg-inherit',
        overlay: { background: 'bg-black bg-opacity-70 dark:bg-gray-800/75' },
        shadow: '',
        width: 'w-full sm:max-w-[100%]',
        padding: 'p-0 sm:p-0',
        container: 'flex min-h-full  items-start sm:items-start',
        base: 'relative text-left rtl:text-right flex flex-col h-screen',
      }"
    >
      <div class="relative w-full h-full close-modal" @click="stopPropagation">
        <div
          class="max-w-[500px] w-full p-2 md:p-0 md:w-[500px] absolute left-1/2 -translate-x-1/2 z-50"
        >
          <UCarousel
            ref="carouselRef"
            v-slot="{ item }"
            :items="props.user.avatar"
            :ui="{ item: 'basis-full' }"
            class="rounded-lg overflow-hidden"
            indicators
          >
            <img
              :src="item"
              alt="img"
              class="w-full object-cover"
              draggable="false"
            />
          </UCarousel>
        </div>
        <div
          class="absolute flex bottom-24 w-full p-2 md:p-32 justify-between items-center"
        >
          <div class="flex gap-4 items-center">
            <img
              :src="
                user.avatar && user.avatar[0]
                  ? user.avatar[0]
                  : '/common/avatar.png'
              "
              alt="img"
              class="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <p class="text-white font-semibold text-base">{{ fio }}</p>
              <div class="flex flex-col md:flex-row gap-x-2">
                <span class="text-sm font-normal text-pumice">{{
                  changePhoneMask("7" + $props.user.phone)
                }}</span>
                <span class="text-pumice hidden md:inline-block"> • </span>
                <span class="text-sm font-normal text-pumice">{{
                  $props.user.email
                }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-4">
            <div>
              <input
                ref="avatar_input"
                @change="handleFileChange"
                id="file-uploader-input"
                type="file"
                accept="image/*"
                class="hidden"
                multiple
              />
              <label for="file-uploader-input">
                <div
                  class="p-[10px] bg-japanese-laurel h-fit max-w-fit rounded-full cursor-pointer"
                >
                  <img src="~assets/svg/common/camera-white.svg" alt="" />
                </div>
              </label>
            </div>

            <div
              class="p-[10px] bg-valencia h-fit max-w-fit rounded-full cursor-pointer"
              @click="deletePhoto"
            >
              <img src="~assets/svg/common/delete-white-icon.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
