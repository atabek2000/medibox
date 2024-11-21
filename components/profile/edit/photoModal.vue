<script setup>
import { TransparentButtonConfig } from "~/composables/ui/useConfig";
const { profileEdit } = useAuth();
const isOpen = defineModel({ required: true });
const setModelValue = (value) => {
  isOpen.value = value;
};
const avatar_input = ref();
const emits = defineEmits(["refresh"]);

const handleFileChange = async (event) => {
  const images_arr = event.target.files;
  const formData = new FormData();
  formData.append("avatar[]", images_arr[0]);
  await profileEdit(formData);
  emits("refresh");
};
</script>

<template>
  <div class="phodo-modal">
    <UModal v-model="isOpen">
      <div class="py-9 px-14">
        <div class="flex justify-between">
          <p class="font-semibold text-xl">{{ $t("form.select_other_img") }}</p>
          <UButton
            color="gray"
            variant="ghost"
            class="-my-1"
            @click="setModelValue(false)"
          >
            <img src="~assets/svg/common/close-modal-small.svg" alt=""
          /></UButton>
        </div>
        <div class="flex justify-between gap-3 mt-6">
          <div class="w-1/2">
            <input
              ref="avatar_input"
              @change="handleFileChange"
              id="file-uploader-input"
              type="file"
              accept="image/*"
              class="hidden"
            />
            <label for="file-uploader-input">
              <UButton
                @click="avatar_input.click()"
                class="w-full"
                variant="outline"
                :ui="TransparentButtonConfig()"
                >{{ $t("button.yes") }}</UButton
              >
            </label>
          </div>
          <div class="w-1/2">
            <UButton
              class="w-full"
              variant="outline"
              color="black"
              :ui="TransparentButtonConfig()"
              @click="setModelValue(false)"
              >{{ $t("button.no") }}</UButton
            >
          </div>
        </div>
        <UButton
          class="mt-4 w-full flex justify-center bg-coral-red-200"
          color="coral-red"
          variant="soft"
          :ui="TransparentButtonConfig()"
          >{{ $t("button.delete_img") }}</UButton
        >
      </div>
    </UModal>
  </div>
</template>
