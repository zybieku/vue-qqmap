import type { PropType } from "vue";

export const props = {
  id: {
    type: String,
    default: "tz-map",
  },

  appKey: {
    type: String,
    default: "5JZBZ-GSIWZ-2F4XH-Z77S2-A6Z7Q-OGB3Q",
  },

  height: {
    type: String,
  },
  center: {
    type: Object as PropType<TMap.IPoint>,
    default: () => ({ lat: 22.549662, lng: 114.070247 }),
  },
  scale: {
    type: Number,
    default: 16,
  },
  showLocation: {
    type: Boolean,
    default: false,
  },

  iconPath: {
    type: String,
    default: "",
  },

  markers: {
    type: Array as PropType<TMap.PointGeometry[]>,
    default: () => [],
  },
};
