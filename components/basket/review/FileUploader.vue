<script setup>
const images = defineModel({ required: true });
const selectedImages = ref([]);
const handleFileChange = (event) => {
  const images_arr = event.target.files;
  images.value = event.target.files;
  if (!images_arr) return;

  selectedImages.value = [];
  for (let i = 0; i < images_arr.length; i++) {
    const file = images_arr[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImages.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};
</script>

<template>
  <div class="file-uploader">
    <div class="images-block flex">
      <img
        v-for="(image, index) in selectedImages"
        :src="image"
        :key="index"
        alt="img"
        class="max-w-20 max-h-20 me-2"
      />
    </div>
    <div class="input-block mt-3">
      <input
        @change="handleFileChange"
        id="file-uploader-input"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
      />
      <label
        for="file-uploader-input"
        class="w-full flex justify-center items-center px-4 py-3 bg-wild-sand rounded-2xl cursor-pointer ring-1 ring-primary"
      >
        <img src="~assets/svg/common/camera-icon.svg" alt="camera" />
        <span class="ms-2 border-b border-b-black leading-[18px]">
           + {{ $t("form.add_5_file") }}
        </span>
      </label>
    </div>
  </div>
</template>
