<script setup>
const cookie_jwt = useCookie("jwt");
const { t } = useI18n();
const { startLoading, stopLoading } = useLoader();
const props = defineProps({
  is_favourite: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: "",
  },
});

const is_fav = ref(props.is_favourite);
const emits = defineEmits(["refresh"]);

const addToFav = async (e) => {
  e.preventDefault();
  if (!cookie_jwt.value) {
    useToast().add({
      title: t("toast.error"),
      color: "red",
      description: t("toast.not_auth"),
    });
  } else if (props.url && !is_fav.value) {
    startLoading();
    await useFetchApi(props.url, {
      method: "POST",
      async onResponse({ request, response, options }) {
        is_fav.value = true;
        stopLoading();
      },
    });
  } else if (props.url && is_fav.value) {
    startLoading();
    await useFetchApi(props.url, {
      method: "DELETE",
      async onResponse({ request, response, options }) {
        is_fav.value = false;
        stopLoading();
      },
    });
  }

  emits("refresh");
};
</script>

<template>
  <div class="starred_button cursor-pointer" @click="addToFav">
    <img
      v-if="is_fav"
      src="~assets/svg/common/heart-red-starred-small.svg"
      alt="heart"
    />
    <img
      v-else
      src="~assets/svg/common/heart-gray-starred-small.svg"
      alt="heart"
    />
  </div>
</template>
