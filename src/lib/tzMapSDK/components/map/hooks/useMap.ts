import { SetupContext, onUnmounted } from "vue";

export let useMap = (ctx: SetupContext) => {
  let mapCtx: TMap.Map | null = null;

  let eventNames = [
    "click",
    "dblclick",
    "rightclick",
    "resize",
    "move",
    "zoom",
    "idle",
    "tilesloaded",
    "mousedown",
    "mouseup",
    "mousemove",
    "touchstart",
    "touchmove",
    "touchend",
    "dragstart",
    "drag",
    "dragend",
  ];

  let handleEventListener = (e: TMap.MapEvent) => {
    console.log(e);

    e.originalEvent?.stopPropagation();
    if (e.type) {
      ctx.emit(e.type, e);
    }
  };

  function initMapEvent() {
    eventNames.forEach((name) => {
      let attrName = "on" + name[0].toUpperCase() + name.slice(1);
      if (ctx.attrs[attrName]) {
        mapCtx?.on(name, handleEventListener);
      }
    });
  }

  function offMapEvent() {
    eventNames.forEach((name) => {
      mapCtx?.off(name, handleEventListener);
    });

    if (ctx.attrs["onEvent"]) {
      [
        "mousedown",
        "mouseup",
        "mousemove",
        "idle",
        "tilesloaded",
        "touchstart",
        "touchmove",
        "touchend",
      ].forEach((eventName) => {
        mapCtx?.off(eventName, handleEventListener);
      });
    }
  }

  function initMap(id: string) {
    //定义地图中心点坐标
    let center = new TMap.LatLng(39.98412, 116.307484);
    //定义map变量，调用 TMap.Map() 构造函数创建地图
    let map = new TMap.Map(document.getElementById(id), {
      center: center, //设置地图中心点坐标
      zoom: 18,
      viewMode: "2D",
    });
    mapCtx = map;
    initMapEvent();
    return map;
  }

  let setCenter = ({ lat, lng }: TMap.IPoint) => {
    //修改地图中心点
    mapCtx?.setCenter(new TMap.LatLng(lat, lng));
  };

  let destory = () => {
    offMapEvent();
    mapCtx?.destroy();
    mapCtx = null;
  };

  onUnmounted(() => {
    destory();
  });

  return { initMap, setCenter, destory };
};
