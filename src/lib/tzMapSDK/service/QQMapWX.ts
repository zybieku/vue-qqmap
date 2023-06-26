import QQMapSdk from "./qqmap-wx-jssdk.min.js";
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
} from "./types.js";
interface QQMapOption {
  key: string;
}

/**
 * 腾讯地图SDK
 */
export default class QQMapWX {
  private static _instance: QQMapWX | null = null;

  private qqmapsdk: InstanceType<typeof QQMapSdk>;

  public static get instance(): QQMapWX {
    if (!QQMapWX._instance) {
      QQMapWX._instance = new QQMapWX();
    }
    return QQMapWX._instance;
  }

  public static init(option: QQMapOption) {
    QQMapWX._instance = QQMapWX.instance;
    QQMapWX._instance.qqmapsdk = new QQMapSdk(option);
    return QQMapWX._instance;
  }

  /**
   * 获取QQMapSDK实例
   * @returns QQMapWX
   */
  qqMapsdk() {
    return this.qqmapsdk;
  }

  /**
   * 地点搜索，搜索周边poi，比如：“酒店” “餐饮” “娱乐” “学校” 等等
   * @param options ISearchOption
   * @returns Promise<ISearchResp>
   */
  search(options: ISearchOption): Promise<ISearchResp> {
    return new Promise((reslove, reject) => {
      this.qqmapsdk.search({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
  }

  /**
   * 用于获取输入关键字的补完与提示，帮助用户快速输入
   * 坐标系采用gcj02坐标系
   * @param options ISuggestionOption
   * @returns Promise<ISuggestionResp>
   */
  getSuggestion(options: ISuggestionOption): Promise<ISuggestionResp> {
    return new Promise((reslove, reject) => {
      this.qqmapsdk.getSuggestion({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
  }

  /**
   *  本接口提供由坐标到坐标所在位置的文字描述的转换，输入坐标返回地理位置信息和附近poi列表。
   * 注：坐标系采用gcj02坐标系
   * @param options IReverseGeocoderOption
   * return Promise<IReverseGeocoderResp>
   */
  reverseGeocoder(
    options: IReverseGeocoderOption
  ): Promise<IReverseGeocoderResp> {
    return new Promise((reslove, reject) => {
      this.qqmapsdk.reverseGeocoder({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
  }
  /**
   *  提供由地址描述到所述位置坐标的转换，与逆地址解析reverseGeocoder()的过程正好相反。
   *  注：坐标系采用gcj02坐标系
   * @param options  IGeocoderOption
   * @returns  Promise<IGeocoderResp>
   */
  geocoder(options: IGeocoderOption): Promise<IGeocoderResp> {
    return new Promise((reslove, reject) => {
      this.qqmapsdk.geocoder({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
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
    return new Promise((reslove, reject) => {
      this.qqmapsdk.direction({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
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
    return new Promise((reslove, reject) => {
      this.qqmapsdk.calculateDistance({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
  }

  /**
   * 获取全国城市列表数据。
   * 注：坐标系采用gcj02坐标系
   * @param options  {sig?: 用于对请求进行签名的一个值}
   * @returns Promise<ICityResp>
   */
  getCityList(options: { sig?: string } = {}): Promise<ICityResp> {
    return new Promise((reslove, reject) => {
      this.qqmapsdk.getCityList({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
  }

  /**
   *  通过城市ID返回城市下的区县。
   *  注：坐标系采用gcj02坐标系
   * @param options {id: 城市ID，如：“110000”}
   * @returns Promise<ICityResp>
   */
  getDistrictByCityId(options: ICityByIdOption): Promise<ICityResp> {
    return new Promise((reslove, reject) => {
      this.qqmapsdk.getDistrictByCityId({
        ...options,
        success: function (res) {
          reslove(res);
        },
        fail: function (err) {
          reject(err);
        },
      });
    });
  }
}
