<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { TzMap, type TzMapIntance } from './lib/tzMapSDK';
let mapRef = ref<TzMapIntance>()
onMounted(() => {
  mapRef.value?.addMarkers([
    {
      id: '1',
      styleId: 'myStyle',
      position: {
        lat: 39.984120,
        lng: 116.307484
      }
    }
  ])
})

let handleMapClick = (e) => {
  console.log('handleMapClick', e)
}
let handleMarkerClick = (e) => {
  console.log('handleMarkerClick', e)
}
let handleEventListener = (e) => {
  console.log('handleEventListener', e)
}

</script>

<template>
  <TzMap ref="mapRef" @click='handleMapClick' @markerClick='handleMarkerClick' @event="handleEventListener"></TzMap>
</template>

<style scoped></style>
