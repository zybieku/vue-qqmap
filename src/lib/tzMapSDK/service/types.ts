export interface ILatLngReq {
  latitude: string;
  longitude: string;
}

export interface ILatLngResp {
  lat: string;
  lng: string;
}

export interface IMapBaseResp {
  /**
   * 状态码，0为正常,
   * 310请求参数信息有误，
   * 311Key格式错误,
   * 306请求有护持信息请检查字符串,
   * 110请求来源未被授权
   */
  status: number;
  /**
   * 状态说明，即对状态码status进行说明，
   * 如：
   * status为0,message为"query ok",为正常,
   * status为310,message为"请求参数信息有误",
   * status为311,message为"key格式错误",
   * status为306,message为"请求有护持信息请检查字符串",
   * status为110,message为"请求来源未被授权"
   */
  message: string;
  /**
   * 本次搜索结果总数
   */
  count: number;
}

export interface IMapBaseOption {
  /**
   * 短地址，缺省时返回长地址，可选值：‘short’
   */
  address_format?: string;
  /**
   * 每页条目数，最大限制为20条，默认值10
   */
  page_size?: number;

  /**
   * 第x页，默认第1页
   */
  page_index?: number;

  /**
   *指定地区名称，不自动扩大范围，如北京市,（使用该功能，若涉及到行政区划，建议将auto_extend设置为0）
   *当用户使用泛关键词搜索时（如酒店、超市），这类搜索多为了查找附近， 使用location参数，搜索结果以location坐标为中心，返回就近地点，体验更优(默认为用户当前位置坐标)
   *不与rectangle同时使用
   */
  region?: string;

  /**
   * 矩形区域范围，不与region同时使用
   */
  rectangle?: string;

  /**
   * 取值1：[默认]自动扩大范围；
   * 取值0：不扩大。 仅适用于默认周边搜索以及制定地区名称搜索。
   */
  auto_extend?: string;

  /**
   *最多支持五个分类
   *搜索指定分类
   *category=公交站
   *搜索多个分类
   *category=大学,中学
   */
  filter?: string;

  /**
   * 签名校验
   * 开启WebServiceAPI签名校验的必传参数，只需要传入生成的SK字符串即可，不需要进行MD5加密操作
   */
  sig?: string;
}

// **********************************************
/**
 * 搜索
 */
export interface ISearchOption extends IMapBaseOption {
  /**
   * POI搜索关键字
   */
  keyword: string;
  /**
   * 位置坐标
   * 默认是当前位置
   * @example
   * '39.984060,116.307520'
   * {latitude: 39.980014, longitude: 116.313972}
   */
  location?: string | ILatLngReq;
}

export interface ISearchResp extends IMapBaseResp {
  data: {
    id: string;
    title: string;
    /**
     * 地址
     */
    address: string;
    tel: string;
    /**
     * POI分类
     */
    category: string;
    /**
     * POI类型，值说明：0:普通POI / 1:公交车站 / 2:地铁站 / 3:公交线路 / 4:行政区划
     */
    type: number;
    location: ILatLngResp;
    ad_info: { adcode: string };
    boundary?: Array<any>;
    pano?: {
      id: string;
      heading?: number;
      pitch?: number;
      zoom?: number;
    };
  };
}

// **********************************************

/**
 * 关键词输入提示
 */
export interface ISuggestionOption extends IMapBaseOption {
  /**
   * 用户输入的关键词（希望获取后续提示的关键词）
   */
  keyword: string;

  /**
   * 位置坐标
   * 默认是当前位置
   * @example
   * '39.984060,116.307520'
   */
  location?: string;

  /**
   * 取值： 0：[默认]当前城市无结果时，自动扩大范围到全国匹配 1：固定在当前城市
   */
  region_fix?: number;

  /**
   * 检索策略，目前支持：
   * policy=0：默认，常规策略
   * policy=1：本策略主要用于收货地址、上门服务地址的填写，
   * 提高了小区类、商务楼宇、大学等分类的排序，过滤行政区、
   * 道路等分类（如海淀大街、朝阳区等），排序策略引入真实用户对输入提示的点击热度，
   * 使之更为符合此类应用场景，体验更为舒适
   */
  policy?: number;

  /**
   * 是否返回子地点，如大厦停车场、出入口等取值：
   *  0 [默认]不返回
   *  1 返回
   */
  get_subpois?: number;
}

export interface ISuggestionResp extends IMapBaseResp {
  data: {
    id: string;
    title: string;
    /**
     * 地址
     */
    address: string;
    /**
     * 省
     */
    province: string;

    /**
     * 市
     */
    city: string;

    /**
     * POI类型，值说明：0:普通POI / 1:公交车站 / 2:地铁站 / 3:公交线路 / 4:行政区划
     */
    type: number;
    location: ILatLngResp;
  }[];
}

// **********************************************
/**
 * 逆地址解析
 */
export interface IReverseGeocoderOption extends IMapBaseOption {
  /**
   * 位置坐标
   * 默认是当前位置
   * @example
   * '39.984060,116.307520'
   * {latitude: 39.980014, longitude: 116.313972}
   */
  location?: string | ILatLngReq;

  /**
   * 检索策略，目前支持：
   * policy=0：默认，常规策略
   * policy=1：本策略主要用于收货地址、上门服务地址的填写，
   * 提高了小区类、商务楼宇、大学等分类的排序，过滤行政区、
   * 道路等分类（如海淀大街、朝阳区等），排序策略引入真实用户对输入提示的点击热度，
   * 使之更为符合此类应用场景，体验更为舒适
   */
  policy?: number;

  /**
   * 是否返回周边POI列表：
   * 1.返回；0不返回(默认)
   */
  get_poi?: number;

  /**
   * 用于控制Poi列表：
   * 1 poi_options=address_format=short 返回短地址，缺省时返回长地址
   * 2 poi_options=radius=5000 半径，取值范围 1-5000（米）
   * 3 poi_options=policy=1/2/3 控制返回场景，
   *  policy=1[默认] 以地标+主要的路+近距离poi为主，着力描述当前位置；
   *  policy=2 到家场景：筛选合适收货的poi，并会细化收货地址，精确到楼栋；
   *  policy=3 出行场景：过滤掉车辆不易到达的POI(如一些景区内POI)，增加道路出路口、交叉口、大区域出入口类POI，排序会根据真实API大用户的用户点击自动优化
   */
  poi_options?: string;
}

type famousAreaType = {
  title: string;
  location: ILatLngResp;
  _distance: number;
  /**
   * 此参考位置到输入坐标的方位关系，如：北、南、内
   */
  _dir_desc: string;
};

type addressComponentType = {
  /**
   * 国家
   */
  nation: string;
  /**
   * 省
   */
  province: string;
  /**
   * 市
   */
  city: string;
  /**
   * 区，可能为空字串
   */
  district: string;
  /**
   * 街道，可能为空字串
   */
  street: string;
  /**
   * 门牌，可能为空字串
   */
  street_number: string;
};

export interface IReverseGeocoderResp extends IMapBaseResp {
  result: {
    /**
     * 地址
     */
    address: string;
    /**
     * 位置描述
     */
    formatted_addresses: {
      /**
       * 经过腾讯地图优化过的描述方式，更具人性化特点
       */
      recommend: string;
      /**
       * 大致位置，可用于对位置的粗略描述
       */
      rough: string;
    };

    /**
     * 地址部件，address不满足需求时可自行拼接
     */
    address_component: addressComponentType;

    ad_info: {
      /**
       * 行政区划中心点坐标
       */
      location: ILatLngResp;
      /**
       * 行政区划代码
       */
      adcode: string;
      /**
       * 行政区划名称
       */
      name: string;
      /**
       * 国家
       */
      nation: string;
      /**
       * 省 / 直辖市
       */
      province: string;
      /**
       * 市 / 地级区 及同级行政区划
       */
      city: string;
      /**
       * 区 / 县级市 及同级行政区划
       */
      district: string;
    };
    /**
     * 坐标相对位置参考
     */
    address_reference: {
      famous_area: famousAreaType;
      town: famousAreaType;
      /**
       * 一级地标，可识别性较强、规模较大的地点、小区等
       */
      landmark_l1: famousAreaType;
      /**
       *  二级地标，较一级地标更为精确，规模更小
       */
      landmark_l2: famousAreaType;
      /**
       * 街道
       */
      street: famousAreaType;
      /**
       * //门牌
       */
      street_number: famousAreaType;
      /**
       * //交叉路口
       */
      crossroad: famousAreaType;
      /**
       * //水系
       */
      water: famousAreaType;
    };
    /**
     * POI数组，对象中每个子项为一个POI对象，返回的POI数量及页数可通过请求参数poi_options设置
     */
    pois: {
      /**
       * POI唯一标识
       */
      id: string;
      title: string; //poi名称
      address: string; //地址
      /**
       * POI分类
       */
      category: string;
      location: ILatLngResp; //提示所述位置坐标
      /**
       * 该POI到逆地址解析传入的坐标的直线距离
       */
      _distance: number;
    }[];
  };
}

// **********************************************

/**
 * 地址解析
 */
export interface IGeocoderOption extends IMapBaseOption {
  /**
   * 地址（注：地址中请包含城市名称，否则会影响解析效果），如：‘北京市海淀区彩和坊路海淀西大街74号’
   */
  address: string;

  /**
   * 指定地址所属城市,如北京市
   * @example
   */
  region?: string;
}

export interface IGeocoderResp extends IMapBaseResp {
  result: {
    location: ILatLngResp;
    address_components: addressComponentType;
    /**
     * 查询字符串与查询结果的文本相似度
     */
    similarity: number;
    /**
     * 误差距离，单位：米， 该值取决于输入地址的精确度；
     * 该值为 -1 时，说明输入地址为过于模糊，仅能精确到市区级。
     */
    deviation: number;
    /**
     * 可信度参考：值范围 1 低可信 - 10 高可信
     * 由低到高，分为1 - 10级，该值>=7时，解析结果较为准确，<7时，会存各类不可靠因素
     */
    reliability: number;
  };
}

// **********************************************

/**
 * 提供路线规划
 */
export interface IDirectionOption extends Record<string, any> {
  /**
   * 路线规划选择，可选值：‘driving’（驾车）、‘walking’（步行）、‘bicycling’（骑行）、‘transit’（公交），默认：‘driving’
   */
  mode?: string;
  /**
   * 位置坐标
   * 默认是当前位置
   * @example
   * '39.984060,116.307520'
   * {latitude: 39.980014, longitude: 116.313972}
   */
  from: string | ILatLngReq;

  /**
   * 位置坐标
   * 默认是当前位置
   * @example
   * '39.984060,116.307520'
   * {latitude: 39.980014, longitude: 116.313972}
   */
  to: string | ILatLngReq;
  sig?: string;
}

export interface IDirectionResp extends IMapBaseResp {
  result: {
    routes: {
      /**
       * 方案交通方式，固定值：“DRIVING”
       */
      mode: string;
      /**
       * 方案标签，用于表明方案特点
       * 示例：tags:[“LEAST_LIGHT”]
       * 取值：
       * EXPERIENCE 经验路线
       * RECOMMEND 推荐路线
       * LEAST_LIGHT 红绿灯少
       * LEAST_TIME 时间最短
       * LEAST_DISTANCE 距离最短
       */
      tags?: Array<string>;
      /**
       * 方案总距离
       */
      distance: number;
      /**
       * 方案估算时间（含路况）
       */
      duration: number;

      /**
       *限行信息
       */
      restriction?: {
        /**
         * 限行状态码：
         *   0 途经没有限行城市，或路线方案未涉及限行区域
         *   1 途经包含有限行的城市
         *   3 [设置车牌] 已避让限行
         *   4 [设置车牌] 无法避开限行区域（本方案包含限行路段）
         */
        status: number;
      };
      /**
       * 方案路线坐标点串（该点串经过压缩）
       */
      polyline: Array<string>;
      /**
       * 途经点，顺序与输入waypoints一致
       */
      waypoints?: Array<{
        title: string;
        location: ILatLngResp;
      }>;

      /**
       * 预估打车费
       */
      taxi_fare?: {
        /**
         * 预估打车费用，单位：元
         */
        fare: number;
      };
      steps: Array<{
        instruction: string; //	阶段路线描述
        /**
         * 阶段路线坐标点串在方案路线坐标点串的位置
         */
        polyline_idx: Array<string>;
        /**
         * 阶段路线路名
         */
        road_name: string;
        /**
         * 阶段路线方向
         */
        dir_desc: string;
        /**
         * 阶段路线距离
         */
        distance: number;
        /**
         * 阶段路线末尾动作：如：左转调头
         */
        act_desc: string;
        /**
         * 末尾辅助动作：如：到达终点
         */
        accessorial_desc: string;
      }>;
    };
    [key: string]: any;
  };
}

// **********************************************

/**
 * 距离计算
 */
export interface ICalculateDistanceOption extends Record<string, any> {
  /**
   * 路线规划选择，可选值：‘driving’（驾车）、‘walking’（步行）、‘bicycling’（骑行）、‘transit’（公交），默认：‘driving’
   */
  mode?: string;
  /**
   * 位置坐标
   * 默认是当前位置
   * @example
   * '39.984060,116.307520'
   * {latitude: 39.980014, longitude: 116.313972}
   */
  from: string | ILatLngReq;

  /**
   * 位置坐标
   * 默认是当前位置
   * @example
   * '39.984060,116.307520'
   * {latitude: 39.980014, longitude: 116.313972}
   */
  to: string | ILatLngReq[] | ILatLngResp[];
  sig?: string;
}

export interface ICalculateDistanceResp extends IMapBaseResp {
  result: {
    elements: Array<{
      from: ILatLngResp;
      to: ILatLngResp;
      /**
       * 起点到终点的距离，单位：米，
       */
      distance: number;
      /**
       *表示从起点到终点的结合路况的时间，秒为单位
       */
      duration: number;
    }>;
  };
}

// **********************************************

/**
 * 全国城市列表
 */
export interface ICityByIdOption {
  /**
   * 对应接口getCityList返回数据的Id，如：北京是’110000’
   */
  id: string;
  sig?: string;
}

export interface ICityResp extends IMapBaseResp {
  /**
   * 结果数组，第0项，代表一级行政区划，第1项代表二级行政区划，以此类推；使用getchildren接口时，仅为指定父级行政区划的子级
   */
  result: {
    id: number; //	行政区划唯一标识
    name: string; //	简称，如“内蒙古”
    /**
     * 全称，如“内蒙古自治区”
     */
    fullname: string;
    /**
     * 中心点坐标
     */
    location: ILatLngResp;
    /**
     * 	行政区划拼音，每一下标为一个字的全拼，如：[“nei”,“meng”,“gu”]
     */
    pinyin: Array<string>;
    /**
     * 子级行政区划在下级数组中的下标位置
     */
    cidx: Array<string>;
  }[];
}
