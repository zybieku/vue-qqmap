import { SetupContext, onUnmounted } from "vue";

export let useMarks = (ctx: SetupContext) => {
  let markerCtx: TMap.MultiMarker | null = null;

  function handleMarkerListener(e: TMap.GeometryOverlayEvent) {
    e.originalEvent.stopPropagation?.();
    switch (e.type) {
      case "click":
        ctx.emit("markerClick", e);
        break;
      case "dblclick":
        ctx.emit("markerDblclick", e);
        break;
      case "hover":
        ctx.emit("markerHover", e);
        break;
      default:
        ctx.emit("markerEvent", e);
        break;
    }
  }

  let initMarkEvent = () => {
    markerCtx?.on("click", handleMarkerListener);
    markerCtx?.on("dblclick", handleMarkerListener);

    if (ctx.attrs["onHover"]) {
      markerCtx?.on("hover", handleMarkerListener);
    }
    if (ctx.attrs["onMarkEvent"]) {
      [
        "mousedown",
        "mouseup",
        "mousemove",
        "touchstart",
        "touchmove",
        "touchend",
        "moving",
        "move_ended",
        "move_stopped",
        "move_paused",
        "move_resumed",
      ].forEach((eventName) => {
        markerCtx?.on(eventName, handleMarkerListener);
      });
    }
  };

  let offMarkEvent = () => {
    ["click", "dblclick", "hover"].forEach((eventName) => {
      markerCtx?.off(eventName, handleMarkerListener);
    });

    if (ctx.attrs["onMarkEvent"]) {
      [
        "mousedown",
        "mouseup",
        "mousemove",
        "touchstart",
        "touchmove",
        "touchend",
        "moving",
        "move_ended",
        "move_stopped",
        "move_paused",
        "move_resumed",
      ].forEach((eventName) => {
        markerCtx?.off(eventName, handleMarkerListener);
      });
    }
  };

  function initMultiMarker(map: TMap.Map) {
    markerCtx = new TMap.MultiMarker({
      map: map, //指定地图容器
      //样式定义
      styles: {
        //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
        myStyle: new TMap.MarkerStyle({
          width: 25, // 点标记样式宽度（像素）
          height: 35, // 点标记样式高度（像素）
        }),
      },
    });
    initMarkEvent();
  }

  let addMarkers = (
    options: (TMap.IBasePointGeometry & { position: TMap.IPoint })[]
  ) => {
    let pointGeometry = options.map((item) => {
      let { position, ..._item } = item;
      (_item as TMap.PointGeometry).position = new TMap.LatLng(
        position.lat,
        position.lng
      );
      return _item as TMap.PointGeometry;
    });
    return markerCtx?.add(pointGeometry);
  };

  let removeMarkers = (ids: string[]) => {
    return markerCtx?.remove(ids);
  };

  let setMarkerStyles = (style: TMap.IMarkerStyleOption) => {
    return markerCtx?.setStyles(style);
  };

  let destory = () => {
    offMarkEvent();
    markerCtx = null;
  };

  onUnmounted(() => {
    destory();
  });

  return {
    markerCtx,
    initMultiMarker,
    addMarkers,
    removeMarkers,
    setMarkerStyles,
  };
};
