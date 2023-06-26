
<script lang="tsx">
import { defineComponent, nextTick, onMounted, onUnmounted, reactive } from "vue";
import { props } from "./props";
import QQMapWX from "../service/QQMapWX";
import { useMarks } from './hooks/useMarks'
import { useMap } from './hooks/useMap'


export default defineComponent({
  name: "TzMap",
  props,
  inheritAttrs: false,
  setup(props, ctx) {
    let { expose } = ctx;
    let mapCtx: TMap.Map;

    let { initMultiMarker, ...exposeMarker } = useMarks(ctx)
    let { initMap, setCenter, destory } = useMap(ctx)
    expose({ setCenter, destory, ...exposeMarker });

    onMounted(() => {
      if (window.TMap) {
        mapCtx = initMap(props.id)
      } else {
        nextTick(() => {
          mapCtx = initMap(props.id)
        })
      }
      initMultiMarker(mapCtx)
    })


    return () => <div id={props.id} style={{ height: props.height }
    } class="tz-map" ></div >
  },
});
</script>

<style lang="scss">
.tz-map {
  width: 100%;
}
</style>
