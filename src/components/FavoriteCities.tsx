import React, { useState, useEffect } from 'react';
import { 
  Card, 
  TemperatureText, 
  WeatherDescription
} from './styled/StyledComponents';
import { getWeatherByCity } from '../services/weatherService';
import { useFavoriteCitiesStore } from '../store/favoriteCitiesStore';

interface FavoriteCitiesProps {
  onCitySelect: (city: string) => void;
}

const FavoriteCities: React.FC<FavoriteCitiesProps> = ({ onCitySelect }) => {
  const { favoriteCities, removeFavoriteCity, updateCityWeatherData } = useFavoriteCitiesStore();
  const [loadingCities, setLoadingCities] = useState<Set<string>>(new Set());
  
  // 自动更新收藏城市的天气数据
  useEffect(() => {
    const updateWeatherData = async () => {
      const now = Date.now();
      const updateInterval = 10 * 60 * 1000; // 10分钟更新一次
      
      for (const favorite of favoriteCities) {
        // 如果天气数据不存在或超过10分钟未更新，则重新获取
        if (!favorite.weatherData || now - favorite.lastUpdated > updateInterval) {
          setLoadingCities(prev => new Set(prev).add(favorite.name));
          
          try {
            const weatherData = await getWeatherByCity(favorite.name);
            updateCityWeatherData(favorite.name, weatherData);
          } catch (error) {
            console.error(`更新${favorite.name}天气数据失败:`, error);
          } finally {
            setLoadingCities(prev => {
              const newSet = new Set(prev);
              newSet.delete(favorite.name);
              return newSet;
            });
          }
        }
      }
    };
    
    updateWeatherData();
    
    // 每5分钟检查一次是否需要更新
    const interval = setInterval(updateWeatherData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [favoriteCities, updateCityWeatherData]);
  
  const handleRemoveFavorite = (cityName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发卡片点击
    removeFavoriteCity(cityName);
  };
  
  const handleCityClick = (cityName: string) => {
    onCitySelect(cityName);
  };
  
  // 获取有天气数据的收藏城市
  const citiesWithWeather = favoriteCities.filter(fav => fav.weatherData);
  
  if (citiesWithWeather.length === 0) {
    return null;
  }
  
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ 
        color: '#333', 
        marginBottom: '1rem', 
        textAlign: 'center',
        fontSize: '1.2rem'
      }}>
        收藏城市
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem' 
      }}>
        {citiesWithWeather.map((favorite) => {
          const weather = favorite.weatherData!;
          const isLoading = loadingCities.has(favorite.name);
          
          return (
            <Card 
              key={favorite.name}
              onClick={() => handleCityClick(favorite.name)}
              style={{ 
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
              }}
            >
              {/* 移除收藏按钮 */}
              <button
                onClick={(e) => handleRemoveFavorite(favorite.name, e)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(255, 107, 107, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}
                title="取消收藏"
              >
                ×
              </button>
              
              {/* 城市名称 */}
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#333',
                fontSize: '1.1rem'
              }}>
                {favorite.name}, {favorite.country}
              </h4>
              
              {/* 天气信息 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <TemperatureText style={{ fontSize: '1.5rem' }}>
                    {Math.round(weather.main.temp)}°C
                  </TemperatureText>
                  <WeatherDescription style={{ fontSize: '0.9rem' }}>
                    {weather.weather[0].description}
                  </WeatherDescription>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    体感: {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>
                <div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
                    alt={weather.weather[0].description} 
                    style={{ width: '60px', height: '60px' }}
                  />
                </div>
              </div>
              
              {/* 加载状态 */}
              {isLoading && (
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    更新中...
                  </div>
                </div>
              )}
              
              {/* 最后更新时间 */}
              <div style={{ 
                fontSize: '0.7rem', 
                color: '#999', 
                marginTop: '0.5rem',
                textAlign: 'right'
              }}>
                更新: {new Date(favorite.lastUpdated).toLocaleTimeString('zh-CN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteCities;