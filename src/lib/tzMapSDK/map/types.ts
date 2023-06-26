declare namespace TMap {
  interface IPoint {
    lat: number;
    lng: number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat: number;
    lng: number;
    getLat(): number;
    getLng(): number;
  }

  interface IMapOption {
    /**
     * 设置地图中心点坐标
     */
    center: LatLng;
    /**
     * 设置地图缩放级别
     */
    zoom?: number;
    /**
     * 设置俯仰角
     */
    pitch?: number;
    /**
     * 设置地图旋转角度
     */
    rotation?: number;
    viewMode?: "2D" | "3D";
    baseMap?: {
      type: "vector" | "raster" | string;
      features: string[];
    };
  }
  /**
   *  地图事件返回参数规范。
   */
  interface MapEvent extends Record<string, any> {
    latLng: LatLng;
    /**
     * 事件类型
     */
    type: string;
    point: {
      x: number;
      y: number;
    };
    target: Record<string, any>;
    poi: {
      latLng: LatLng;
      name: string;
    };
    originalEvent: TouchEvent | MouseEvent;
  }

  class Map {
    constructor(el: HTMLElement | string | null, option: IMapOption);
    setCenter(center: LatLng): void;
    getCenter(center: LatLng): void;
    /**
     * 设置地图缩放级别
     * @param zoom number
     */
    setZoom(zoom: Number): void;

    /**
     * 设置地图是否支持双击缩放
     * @param doubleClickZoom boolean
     */
    setDoubleClickZoom(doubleClickZoom: Boolean): void;
    /**
     * 设置地图视图模式
     * @param viewMode string
     */
    setViewMode(viewMode: "2D" | "3D"): void;

    /**
     *鼠标左键单击地图时触发，移动与桌面web都触发。
     * @param event
     * @param handle
     */
    click(event: (evt: MapEvent) => void): void;

    /**
     * 添加listener到eventName事件的监听器数组中。
     * @param event 事件名
     * @param handle 事件处理函数
     */
    on(event: string, handle: (evt: MapEvent) => void): void;
    off(event: string, handle: Function): void;
    /**
     * 销毁地图
     */
    destroy(): void;
  }

  interface IMarkerStyleOption extends Record<string, any> {
    /**
     * 点标记样式宽度（像素）
     */
    width: number;
    /**
     * 点标记样式高度（像素）
     */
    height: number;
    /**
     * 图片路径
     */
    src?: string;

    /**
     * 圆形点以圆心位置为焦点
     */
    anchor?: { x: number; y: number };
    rotate?: number;
    color?: string;
    size?: number;
    /**
     * 标注点文本文字相对于标注点图片的方位
     */
    direction?: "center" | "top" | "bottom" | "left" | "right";
    /**
     * 标注点文本文字基于direction方位的偏移量
     */
    offset?: { x: number; y: number };
    /**
     * 标注点文本自动换行，支持设置软换行和硬换行，软换行支持配置最大换行宽度，硬换行换行符为’\n’。
     *  LabelWrapOptions如果为空对象则以文本中换行符进行换行，如果为null或undefined则不换行
     */
    wrapOptions?: {
      /**
       * 最大换行宽度，单位是像素，默认不限制
       */
      maxWidth: number;
      maxLineCount: number;
      rowSpacing: number;
    };
  }

  class MarkerStyle {
    constructor(option: Partial<IMarkerStyleOption>);
  }

  interface IBasePointGeometry {
    /**
     * 点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
     */
    id: string;
    /**
     * 指定样式id
     */
    styleId?: String;
    /**
     * 标注点的图层内绘制顺序
     */
    rank?: number;
    properties?: {
      //自定义属性
      title: string;
    };
    /**
     * 自定义内容
     */
    content?: string;
  }

  interface PointGeometry extends IBasePointGeometry {
    /**
     * 标注点位置坐标
     */
    position: LatLng;
  }

  interface GeometryOverlayEvent extends MapEvent {
    geometry: PointGeometry;
  }

  /**
   * 聚合点option
   */
  interface IMultiMarkerOption {
    map: Map;
    styles: MarkerStyle;
    geometries?: PointGeometry[];
  }

  /**
   * 集合点类
   */
  class MultiMarker {
    constructor(option: IMultiMarkerOption);
    getId(): string;
    getMap(): Map;
    getGeometryById(id: String): PointGeometry;
    getGeometries(): PointGeometry[];
    setStyles(styles: IMarkerStyleOption): void;
    getStyles(): MarkerStyle;
    getVisible(): boolean;
    add(geometries: PointGeometry[]): void;
    remove(ids: string[]): void;
    /**
     * 添加listener到eventName事件的监听器数组中。
     * @param event 事件名
     * @param handle 事件处理函数
     */
    on(event: string, handle: (evt: GeometryOverlayEvent) => void): void;
    off(event: string, handle: Function): void;
    /**
     *鼠标左键单击地图时触发，移动与桌面web都触发。
     * @param event
     * @param handle
     */
    click(event: (evt: GeometryOverlayEvent) => void): void;
    dblclick(event: (evt: GeometryOverlayEvent) => void): void;
    hover(event: (evt: GeometryOverlayEvent) => void): void;
    touchstart(event: (evt: GeometryOverlayEvent) => void): void;
  }

  interface InfoWindowOptions {
    /**
     * 显示信息窗的地图
     */
    map: Map;
    /**
     * 信息窗的经纬度坐标
     */
    position: LatLng;
    /**
     * 信息窗显示内容，默认为空字符串。当enableCustom为true时，需传入信息窗体的dom字符串
     */
    content?: string;
    /**
     * 信息窗的z-index值，默认为0
     */
    zIndex?: number;
    /**
     * 信息窗相对于position对应像素坐标的偏移量，x方向向右偏移为正值，y方向向下偏移为正值，默认为{x:0, y:0}
     */
    offset?: Record<string, number>;
    /**
     * 信息窗体样式是否为自定义，默认为false
     */
    enableCustom?: boolean;
  }
  /**
   * 信息窗
   */
  class InfoWindow {
    constructor(option: InfoWindowOptions);
    open(): void;
    close(): void;
    destroy(): void;
  }
}
