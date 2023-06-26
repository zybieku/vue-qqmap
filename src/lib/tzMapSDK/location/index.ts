import Taro from "@tarojs/taro";
import api from "../../../tzAxios";

export interface ILocation {
  accuracy: number;
  altitude: number;
  horizontalAccuracy: number;
  latitude: number;
  longitude: number;
  speed: number;
  verticalAccuracy: number;
}

export interface ILocationOption {
  immediate: boolean;
  atuoReport: boolean;
  //上报间隔
  delay: number;
  callback?: (res: ILocation) => void;
}
/**
 * @description: 定位服务
 */
export default class TzLocation {
  private static _instance: TzLocation | null = null;
  private option: ILocationOption;
  //获取当前时间
  private oldTime = 0;

  constructor(option: ILocationOption) {
    this.option = option;

    if (option.immediate) {
      this.stop();
      this.start();
    }
  }

  public static get instance() {
    if (!TzLocation._instance) {
      return TzLocation.init();
    }
    return TzLocation._instance;
  }

  public static init(
    option = {
      immediate: true,
      atuoReport: true,
      delay: 1000 * 6,
    }
  ) {
    if (!TzLocation._instance) {
      TzLocation._instance = new TzLocation(option);
    }
    return TzLocation._instance;
  }

  async authorize() {
    const set = await Taro.getSetting();

    if (
      !set.authSetting["scope.userLocationBackground"] ||
      !set.authSetting["scope.userLocation"]
    ) {
      const isAuth = await Taro.authorize({
        scope: "scope.userLocationBackground",
      }).catch(() => {
        return false;
      });

      if (!isAuth) {
        await Taro.showModal({
          content: "订单功能需要获取定位权限才能使用(使用时和离开后权限)",
          showCancel: false,
          confirmText: "去授权",
        });
        const res = await Taro.openSetting();
        if (res.authSetting["scope.userLocationBackground"]) {
          return true;
        } else {
          return await this.authorize();
        }
      }
    }
    return true;
  }

  stop() {
    Taro.stopLocationUpdate({
      success: () => {
        console.log("定位已关闭");
      },
    });
  }

  start() {
    Taro.startLocationUpdateBackground({
      success: () => {
        console.log("定位已开启");
        this.onLocationChange();
      },
      fail: (err) => {
        console.log(err);
        this.authorize();
      },
    });
  }

  onLocationChange(callback?: (res: ILocation) => void) {
    const listener = (res) => {
      const currentTime = new Date().getTime();
      if (currentTime - this.oldTime < this.option.delay) return;
      this.oldTime = currentTime;
      console.log("定时上报", currentTime);
      callback?.(res) ?? this.option?.callback?.(res);
      if (!this.option.atuoReport) return;
      api
        .post({
          url: "/transport/location/report",
          data: {
            location: {
              lat: res.latitude,
              lng: res.longitude,
            },
          },
        })
        .catch((err) => {
          console.log("上报失败: ", err.data?.msg);
        });
    };
    Taro.offLocationChange(listener);
    Taro.onLocationChange(listener);
  }
}
