import axios from 'axios';

// OpenWeatherMap API URL和密钥
// 注意：您需要注册OpenWeatherMap账户并获取自己的API密钥
// 注册网址：https://home.openweathermap.org/users/sign_up
const API_KEY = '5e5b5132c80fcdf9afa022d25f1beb27'; // 请替换为您的有效API密钥
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 接口定义
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

// 预报数据接口
export interface ForecastData {
  city: {
    name: string;
    country: string;
  };
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }[];
}

// 温度图表数据接口
export interface TemperatureChartData {
  time: string;
  temperature: number;
  date: string;
}

// 中文城市名到英文城市名的映射
const CITY_NAME_MAPPING: Record<string, string> = {
  '北京': 'Beijing',
  '上海': 'Shanghai',
  '广州': 'Guangzhou',
  '深圳': 'Shenzhen',
  '杭州': 'Hangzhou',
  '南京': 'Nanjing',
  '成都': 'Chengdu',
  '重庆': 'Chongqing',
  '天津': 'Tianjin',
  '武汉': 'Wuhan',
  '西安': 'Xi\'an',
  '苏州': 'Suzhou',
  '长沙': 'Changsha',
  '沈阳': 'Shenyang',
  '青岛': 'Qingdao',
  '郑州': 'Zhengzhou',
  '大连': 'Dalian',
  '宁波': 'Ningbo',
  '厦门': 'Xiamen',
  '福州': 'Fuzhou',
  '济南': 'Jinan',
  '昆明': 'Kunming',
  '哈尔滨': 'Harbin',
  '长春': 'Changchun',
  '石家庄': 'Shijiazhuang',
  '合肥': 'Hefei',
  '太原': 'Taiyuan',
  '南昌': 'Nanchang',
  '贵阳': 'Guiyang',
  '南宁': 'Nanning',
  '兰州': 'Lanzhou',
  '海口': 'Haikou',
  '呼和浩特': 'Hohhot',
  '银川': 'Yinchuan',
  '西宁': 'Xining',
  '拉萨': 'Lhasa',
  '乌鲁木齐': 'Urumqi'
};

// 城市名转换函数
const convertCityName = (city: string): string => {
  // 去除首尾空格
  const trimmedCity = city.trim();
  
  // 如果已经是英文，直接返回
  if (/^[a-zA-Z\s]+$/.test(trimmedCity)) {
    return trimmedCity;
  }
  
  // 查找映射表
  const englishName = CITY_NAME_MAPPING[trimmedCity];
  if (englishName) {
    return englishName;
  }
  
  // 如果没有找到映射，返回原城市名（可能是其他中文城市名）
  return trimmedCity;
};

// 按城市名称获取天气
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const englishCity = convertCityName(city);
    const response = await axios.get(`${API_BASE_URL}/weather`, {
      params: {
        q: englishCity,
        appid: API_KEY,
        units: 'metric', // 使用摄氏度
        lang: 'zh_cn', // 返回中文数据
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取天气数据时出错:', error);
    throw error;
  }
};

// 按地理坐标获取天气
export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    console.log(`正在获取坐标(${lat}, ${lon})的天气数据...`);
    const response = await axios.get(`${API_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'zh_cn',
      },
    });
    return response.data;
  } catch (error: any) {
    // 详细记录错误信息以便调试
    if (error.response) {
      // 服务器响应了，但状态码超出了2xx范围
      console.error('API响应错误:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // 针对401无权限错误提供更明确的错误信息
      if (error.response.status === 401) {
        console.error('API密钥无效或未授权，请检查您的OpenWeatherMap API密钥');
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('未收到API响应:', error.request);
    } else {
      // 设置请求时发生错误
      console.error('请求设置错误:', error.message);
    }
    throw error;
  }
};

// 按城市名称获取5天预报
export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  try {
    const englishCity = convertCityName(city);
    const response = await axios.get(`${API_BASE_URL}/forecast`, {
      params: {
        q: englishCity,
        appid: API_KEY,
        units: 'metric', // 使用摄氏度
        lang: 'zh_cn', // 返回中文数据
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取预报数据时出错:', error);
    throw error;
  }
};

// 按地理坐标获取5天预报
export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'zh_cn',
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取预报数据时出错:', error);
    throw error;
  }
};

// 处理预报数据，提取未来48小时的温度数据用于图表显示
export const processForecastData = (forecastData: ForecastData): TemperatureChartData[] => {
  const chartData: TemperatureChartData[] = [];
  const now = new Date();
  
  // 获取未来48小时的数据点（每3小时一个数据点）
  const futureData = forecastData.list
    .filter(item => {
      const itemDate = new Date(item.dt * 1000);
      const hoursDiff = (itemDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      // 选择未来48小时内的数据点，且跳过当前小时的数据
      return hoursDiff > 0 && hoursDiff <= 48;
    });
  
  // 为每个小时数据点计算其所在时间段的最高和最低温度
  futureData.forEach(item => {
    const itemDate = new Date(item.dt * 1000);
    const timeStr = itemDate.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
    
    chartData.push({
      date: timeStr,
      time: timeStr,
      temperature: parseFloat(item.main.temp.toFixed(1))
    });
  });
  
  return chartData;
};