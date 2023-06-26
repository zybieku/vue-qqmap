import TzMap from "./Map.vue";

type TzMapIntance = InstanceType<typeof TzMap> & {
  map: TMap.Map;
  marker: TMap.MultiMarker;
  addMarkers: (
    markers: (TMap.IBasePointGeometry & { position: TMap.IPoint })[]
  ) => void;
  removeMarkers: (ids: string[]) => void;
  setMarkerStyles: (styles: TMap.IMarkerStyleOption) => void;
};
export { TzMap };
export type { TzMapIntance };
