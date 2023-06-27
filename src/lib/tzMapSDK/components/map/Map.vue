<script lang="tsx">
import { defineComponent, nextTick, onMounted } from "vue";
import { useMap } from "./hooks/useMap";
import { useMarks } from "./hooks/useMarks";
import { props } from "./props";

export default defineComponent({
  name: "TzMap",
  props,
  inheritAttrs: false,
  setup(props, ctx) {
    let { expose } = ctx;
    let mapCtx: TMap.Map;

    let { initMultiMarker, ...exposeMarker } = useMarks(ctx);
    let { initMap, setCenter, destory } = useMap(ctx);

    onMounted(() => {
      if (window.TMap) {
        mapCtx = initMap(props.id);
      } else {
        nextTick(() => {
          mapCtx = initMap(props.id);
        });
      }
      initMultiMarker(mapCtx);
    });

    expose({ setCenter, destory, ...exposeMarker });

    return () => (
      <div id={props.id} style={{ height: props.height }} class="tz-map"></div>
    );
  },
});
</script>

<style lang="scss">
.tz-map {
  width: 100%;
}
</style>
../service/TMapWeb
