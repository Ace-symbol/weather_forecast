import React, { useState } from 'react';
import { getWeatherByCity, getWeatherByCoords, WeatherData } from './services/weatherService';
import CitySearch from './components/CitySearch';
import WeatherInfo from './components/WeatherInfo';
import FavoriteCities from './components/FavoriteCities';
import { 
  AppContainer, 
  Loading, 
  ErrorMessage, 
  Header,
  Card 
} from './components/styled/StyledComponents';
import './App.css';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null);

  // 添加返回首页的处理函数
  const handleBackToHome = () => {
    setWeatherData(null);
    setError(null);
    setCurrentCity(null);
    setCurrentCoords(null);
  };

  // 处理API错误的辅助函数
  const handleApiError = (err: any, context: string) => {
    console.error(`Error ${context}:`, err);
    
    if (err.response) {
      // 服务器响应了，但状态码超出了2xx范围
      const { status } = err.response;
      
      if (status === 401) {
        setError('API密钥无效或未授权。请在weatherService.ts文件中检查并更新您的API密钥。');
      } else if (status === 404) {
        setError(`找不到请求的数据，请检查输入是否正确。`);
      } else if (status === 429) {
        setError('API请求频率超限，请稍后再试。');
      } else {
        setError(`服务器返回错误 (${status})，请稍后再试。`);
      }
    } else if (err.request) {
      // 请求已发送但没有收到响应
      setError('无法连接到天气服务器，请检查您的网络连接。');
    } else {
      // 设置请求时发生错误
      setError('请求天气数据时出错: ' + err.message);
    }
  };

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getWeatherByCity(city);
      setWeatherData(data);
      setCurrentCity(city);
      setCurrentCoords(null);
    } catch (err: any) {
      handleApiError(err, 'fetching weather by city');
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError(null);
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log(`获取到位置坐标: 纬度=${latitude}, 经度=${longitude}`);
            
            // 使用按坐标获取天气的API
            const data = await getWeatherByCoords(latitude, longitude);
            setWeatherData(data);
            setCurrentCoords({ lat: latitude, lon: longitude });
            setCurrentCity(null);
          } catch (err: any) {
            handleApiError(err, 'fetching weather by coordinates');
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          setLoading(false);
          console.error('Geolocation error:', geoError);
          
          if (geoError.code === 1) {
            setError('获取位置失败: 用户拒绝了位置访问权限');
          } else if (geoError.code === 2) {
            setError('获取位置失败: 无法确定当前位置');
          } else if (geoError.code === 3) {
            setError('获取位置失败: 请求超时');
          } else {
            setError('获取位置信息失败: ' + geoError.message);
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0 
        }
      );
    } else {
      setError('您的浏览器不支持地理位置功能');
    }
  };

  return (
    <div className="App" style={{ 
      backgroundImage: 'linear-gradient(to bottom, #89cff0, #a6d8f0)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <AppContainer>
        <Header>
          <h1>天气预报</h1>
          <p>查询全球各地实时天气信息</p>
        </Header>
        
        <FavoriteCities onCitySelect={handleSearch} />
        
        <CitySearch onSearch={handleSearch} isLoading={loading} />
        
        {error && (
          <ErrorMessage>
            {error}
            {error.includes('API密钥') && (
              <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                您需要在src/services/weatherService.ts文件中使用有效的OpenWeatherMap API密钥。
                <br />
                <a 
                  href="https://home.openweathermap.org/api_keys" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#a94442', textDecoration: 'underline' }}
                >
                  点击这里获取免费的API密钥
                </a>
              </div>
            )}
          </ErrorMessage>
        )}
        
        {loading ? (
          <Loading>正在加载天气数据...</Loading>
        ) : weatherData ? (
          <WeatherInfo 
            weatherData={weatherData} 
            onBackToHome={handleBackToHome}
            city={currentCity || undefined}
            coords={currentCoords || undefined}
          />
        ) : (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>欢迎使用天气预报应用</h2>
              <p>请输入城市名称查询天气</p>
              <button 
                onClick={handleGetCurrentLocation}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                使用当前位置
              </button>
            </div>
          </Card>
        )}
      </AppContainer>
    </div>
  );
};

export default App;
