<script setup>
const props = defineProps({
  center: {
    type: Array,
    default: undefined,
  },
});
const center_default = [43.2452, 76.9367];
</script>
<template>
  <div>
    <LMap
      style="height: 350px"
      :zoom="12"
      :center="center[0] && center[1] ? center : center_default"
      class="rounded-2xl"
    >
      <LTileLayer
        url="https://{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}"
        :subdomains="['tile0', 'tile1', 'tile2', 'tile3']"
        :retinaMode="true"
      />
      <LMarker v-if="center[0] && center[1]" :lat-lng="center"></LMarker>
    </LMap>
  </div>
</template>
