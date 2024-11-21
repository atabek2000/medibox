<script setup>
const marker = defineModel({ required: true });
const center_default = [43.2452, 76.9367];
const setMarker = (event) => {
  marker.value = event.latlng;
};
</script>
<template>
  <div>
    <LMap
      style="height: 350px"
      :zoom="12"
      :center="marker.lat ? marker : center_default"
      class="rounded-2xl"
      @click="setMarker"
    >
      <LTileLayer
        url="https://{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}"
        :subdomains="['tile0', 'tile1', 'tile2', 'tile3']"
        :retinaMode="true"
      />
      <LMarker v-if="marker" :lat-lng="marker"></LMarker>
    </LMap>
  </div>
</template>
