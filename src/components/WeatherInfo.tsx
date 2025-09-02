import React, { useState, useEffect } from 'react';
import { 
  Card, 
  TemperatureText, 
  WeatherDescription,
  WeatherDetailsGrid,
  WeatherDetailItem,
  DetailLabel,
  DetailValue
} from './styled/StyledComponents';
import { WeatherData, getForecastByCity, getForecastByCoords, processForecastData, TemperatureChartData } from '../services/weatherService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFavoriteCitiesStore } from '../store/favoriteCitiesStore';

interface WeatherInfoProps {
  weatherData: WeatherData;
  onBackToHome: () => void;
  city?: string;
  coords?: { lat: number; lon: number };
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weatherData, onBackToHome, city, coords }) => {
  const [forecastData, setForecastData] = useState<TemperatureChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { addFavoriteCity, removeFavoriteCity, isFavoriteCity, debugLog } = useFavoriteCitiesStore();
  
  const isFavorite = isFavoriteCity(weatherData.name);
  
  // 调试信息
  console.log('WeatherInfo组件渲染:', {
    cityName: weatherData.name,
    isFavorite,
    allFavorites: debugLog()
  });
  
  const handleToggleFavorite = () => {
    console.log('点击收藏按钮:', {
      cityName: weatherData.name,
      isFavorite,
      action: isFavorite ? '移除收藏' : '添加收藏'
    });
    
    if (isFavorite) {
      removeFavoriteCity(weatherData.name);
    } else {
      addFavoriteCity(weatherData.name, weatherData.sys.country, weatherData);
    }
    
    // 延迟输出状态变化
    setTimeout(() => {
      console.log('收藏操作后的状态:', debugLog());
    }, 100);
  };

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        let forecast;
        
        if (city) {
          forecast = await getForecastByCity(city);
        } else if (coords) {
          forecast = await getForecastByCoords(coords.lat, coords.lon);
        } else {
          // 如果没有城市或坐标，使用当前天气数据的城市名
          forecast = await getForecastByCity(weatherData.name);
        }
        
        const processedData = processForecastData(forecast);
        console.log(41, processedData)
        setForecastData(processedData);
      } catch (error) {
        console.error('获取预报数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [weatherData.name, city, coords]);
  // 格式化时间戳为本地时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 获取天气图标
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          onClick={onBackToHome}
          style={{
            padding: '0.5rem 1rem',
            background: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          返回首页
        </button>
        <button
          onClick={handleToggleFavorite}
          style={{
            padding: '0.5rem 1rem',
            background: isFavorite ? '#ff6b6b' : '#51cf66',
            color: 'white',
            border: '2px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 10
          }}
        >
          {isFavorite ? '❤️ 已收藏' : '🤍 收藏'}
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>
            {weatherData.name}, {weatherData.sys.country}
          </h1>
          <TemperatureText>{Math.round(weatherData.main.temp)}°C</TemperatureText>
          <WeatherDescription>
            {weatherData.weather[0].description}
          </WeatherDescription>
          <div style={{ margin: '0.5rem 0' }}>
            体感温度: {Math.round(weatherData.main.feels_like)}°C
          </div>
        </div>
        <div>
          <img 
            src={getWeatherIcon(weatherData.weather[0].icon)} 
            alt={weatherData.weather[0].description} 
            style={{ width: '100px', height: '100px' }}
          />
        </div>
      </div>

      <WeatherDetailsGrid>
        <WeatherDetailItem>
          <DetailLabel>湿度</DetailLabel>
          <DetailValue>{weatherData.main.humidity}%</DetailValue>
        </WeatherDetailItem>
        <WeatherDetailItem>
          <DetailLabel>气压</DetailLabel>
          <DetailValue>{weatherData.main.pressure} hPa</DetailValue>
        </WeatherDetailItem>
        <WeatherDetailItem>
          <DetailLabel>风速</DetailLabel>
          <DetailValue>{weatherData.wind.speed} m/s</DetailValue>
        </WeatherDetailItem>
        <WeatherDetailItem>
          <DetailLabel>风向</DetailLabel>
          <DetailValue>{weatherData.wind.deg}°</DetailValue>
        </WeatherDetailItem>
        <WeatherDetailItem>
          <DetailLabel>日出</DetailLabel>
          <DetailValue>{formatTime(weatherData.sys.sunrise)}</DetailValue>
        </WeatherDetailItem>
        <WeatherDetailItem>
          <DetailLabel>日落</DetailLabel>
          <DetailValue>{formatTime(weatherData.sys.sunset)}</DetailValue>
        </WeatherDetailItem>
      </WeatherDetailsGrid>

      {/* 温度趋势图表 */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>未来三天温度趋势</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            加载预报数据中...
          </div>
        ) : forecastData.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={forecastData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: '温度 (°C)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    return [`${value}°C`, '当前温度'];
                  }}
                  labelFormatter={(label) => `时间: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#4a90e2"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name="当前温度"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            暂无预报数据
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeatherInfo;