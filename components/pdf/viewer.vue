<template>
  <div class="pdf-view">
    <div id="pdf-container"></div>
    <div v-if="pending" class="flex justify-center flex-col items-center">
      <img
        src="~assets/svg/common/close-gray-big.svg"
        alt=""
        class="w-[48px] mb-4"
        :class="{ 'animate-spin': pending }"
      />
      {{ $t("content.loading") }}...
    </div>
  </div>
</template>
<script setup>
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const props = defineProps({
  url: {
    type: String,
    default: "",
  },
});
const pending = ref(true);
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs";

//   https://github.com/mozilla/pdf.js/discussions/17622
const showPdf = async () => {
  const url = props.url;

  try {
    const response = await fetch(url);
    const pdfBlob = await response.blob();

    const pdfUrl = URL.createObjectURL(pdfBlob);

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    const container = document.getElementById("pdf-container");
    const pageNumber = 1;
    const page = await pdf.getPage(pageNumber);
    const scale = 0.6;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    container.appendChild(canvas);

    const renderContext = {
      canvasContext: context,
      viewport,
    };
    await page.render(renderContext);
    pending.value = false;
  } catch (error) {
    console.error("Error fetching or rendering PDF:", error);
  }
};

onMounted(async () => {
  let count = 0;
  let timeout = setTimeout(function () {
    if (props.url !== "") {
      console.log(props.url);
      showPdf();
      clearTimeout(timeout);
    }
    count++;
    if (count > 10) {
      clearTimeout(timeout);
    }
    console.log("timeout");
  }, 2000);
});
</script>

<style scoped>
#pdf-container {
  width: 100%;
  /* max-width: 360px; */
  height: 100%;
  /* max-height: 520px; */
  overflow: auto;
}
</style>
