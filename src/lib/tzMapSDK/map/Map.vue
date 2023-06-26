<script lang="tsx">
import {
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
} from "vue";
import { props } from "./props";
import QQMapWX from "../service/QQMapWX";
import { useMarks } from "./hooks/useMarks";
import { useMap } from "./hooks/useMap";

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
      QQMapWX.instance
        .reverseGeocoder({
          location: "39.984154,116.307490",
        })
        .then((res) => {
          console.log(res.result, 1);
        })
        .catch((err) => {
          console.log(err);
        });
      QQMapWX.instance
        .geocoder({
          address: "北京市海淀区彩和坊路海淀西大街74号",
        })
        .then((res) => {
          console.log(res.result.location, 2);
        })
        .catch((err) => {
          console.log(err);
        });

      QQMapWX.instance
        .direction({
          from: `39.915285,116.403857`,
          to: `39.915285,116.803857`,
          waypoints: `39.111,116.112;39.112,116.113`,
        })
        .then((res) => {
          console.log(res.result);
        });
      QQMapWX.instance
        .calculateDistance({
          from: `39.915285,116.403857`,
          to: `39.915285,116.803857`,
          waypoints: `39.111,116.112;39.112,116.113`,
        })
        .then((res) => {
          console.log(res.result);
        });

      QQMapWX.instance.getIpLocation().then((res) => {
        console.log(res.result);
      });
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
