import { qqMapApi } from "./jsonp/index.js";
import type {
  ICalculateDistanceOption,
  ICalculateDistanceResp,
  ICityByIdOption,
  ICityResp,
  IDirectionOption,
  IDirectionResp,
  IGeocoderOption,
  IGeocoderResp,
  IReverseGeocoderOption,
  IReverseGeocoderResp,
  ISearchOption,
  ISearchResp,
  ISuggestionOption,
  ISuggestionResp,
  ITranslateOption,
  ITranslateResp,
  IpLocationOption,
  IpLocationResp,
} from "./types.js";
interface QQMapOption {
  key: string;
}

/**
 * 腾讯地图SDK
 */
export default class TMapWeb {
  private static _instance: TMapWeb | null = null;
  private qqmapsdk: any;

  public static get instance(): TMapWeb {
    if (!TMapWeb._instance) {
      TMapWeb._instance = new TMapWeb();
    }
    return TMapWeb._instance;
  }

  public static init(option: QQMapOption) {
    TMapWeb._instance = TMapWeb.instance;
    return TMapWeb._instance;
  }

  /**
   * 获取QQMapSDK实例
   * @returns TMapWeb
   */
  qqMapsdk() {
    return this.qqmapsdk;
  }

  /**
   * 地点搜索，搜索周边poi，比如：“酒店” “餐饮” “娱乐” “学校” 等等
   * @param options ISearchOption
   * @returns Promise<ISearchResp>
   */
  search(options: ISearchOption) {
    return qqMapApi<ISearchResp>(`/place/v1/search`, options);
  }

  /**
   * 用于获取输入关键字的补完与提示，帮助用户快速输入
   * 坐标系采用gcj02坐标系
   * @param options ISuggestionOption
   * @returns Promise<ISuggestionResp>
   */
  getSuggestion(options: ISuggestionOption): Promise<ISuggestionResp> {
    return qqMapApi(`/place/v1/suggestion/`, options);
  }

  /**
   *  本接口提供由坐标到坐标所在位置的文字描述的转换，输入坐标返回地理位置信息和附近poi列表。
   * 注：坐标系采用gcj02坐标系
   * @param options IReverseGeocoderOption
   * return Promise<IReverseGeocoderResp>
   */
  reverseGeocoder(options: IReverseGeocoderOption) {
    return qqMapApi<IReverseGeocoderResp>("/geocoder/v1/", options);
  }
  /**
   *  提供由地址描述到所述位置坐标的转换，与逆地址解析reverseGeocoder()的过程正好相反。
   *  注：坐标系采用gcj02坐标系
   * @param options  IGeocoderOption
   * @returns  Promise<IGeocoderResp>
   */
  geocoder(options: IGeocoderOption): Promise<IGeocoderResp> {
    return qqMapApi("/geocoder/v1/", options);
  }
  /**
   *  提供路线规划能力。
        1.驾车（driving）：支持结合实时路况、少收费、不走高速等多种偏好，精准预估到达时间（ETA）；
        2.步行（walking）：基于步行路线规划。
        3.骑行（bicycling）：基于自行车的骑行路线；
        4.公交（transit）：支持公共汽车、地铁等多种公共交通工具的换乘方案计算；
    @param options
   */
  direction(options: IDirectionOption): Promise<IDirectionResp> {
    let { mode = "driving", ...params } = options;
    return qqMapApi(`/direction/v1/${mode}`, params);
  }

  /**
   * 计算一个点到多点的步行、驾车距离。
   *  注：坐标系采用gcj02坐标系
   * @param options ICalculateDistanceOption
   * @returns   Promise<ICalculateDistanceResp>
   */
  calculateDistance(
    options: ICalculateDistanceOption
  ): Promise<ICalculateDistanceResp> {
    return qqMapApi("/distance/v1/matrix/", options);
  }

  /**
   * 获取当前ip的为准的地理位置信息。
   * @param options IpLocationOption
   * @returns   Promise<IpLocationResp>
   */
  getIpLocation(options: IpLocationOption = {}): Promise<IpLocationResp> {
    return qqMapApi("/location/v1/ip", options);
  }

  /**
   * 获取全国城市列表数据。
   * 注：坐标系采用gcj02坐标系
   * @param options  {sig?: 用于对请求进行签名的一个值}
   * @returns Promise<ICityResp>
   */
  getCityList(options: { sig?: string } = {}): Promise<ICityResp> {
    return qqMapApi(`/district/v1/list`, options);
  }

  /**
   *  通过城市ID返回城市下的区县。
   *  注：坐标系采用gcj02坐标系
   * @param options {id: 城市ID，如：“110000”}
   * @returns Promise<ICityResp>
   */
  getDistrictByCityId(options: ICityByIdOption): Promise<ICityResp> {
    return qqMapApi(`/district/v1/getchildren`, options);
  }

  /**
   * 实现从其它地图供应商坐标系或标准GPS坐标系，
   * 批量转换到腾讯地图坐标系。
   * @returns Promise<ITranslateResp>
   */
  translate(options: ITranslateOption): Promise<ITranslateResp> {
    return qqMapApi(`/coord/v1/translate`, options);
  }
}
