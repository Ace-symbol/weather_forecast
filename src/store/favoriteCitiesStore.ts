import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeatherData } from '../services/weatherService';

export interface FavoriteCity {
  name: string;
  country: string;
  weatherData?: WeatherData;
  lastUpdated: number;
}

interface FavoriteCitiesState {
  favoriteCities: FavoriteCity[];
  addFavoriteCity: (city: string, country: string, weatherData?: WeatherData) => void;
  removeFavoriteCity: (cityName: string) => void;
  isFavoriteCity: (cityName: string) => boolean;
  updateCityWeatherData: (cityName: string, weatherData: WeatherData) => void;
  getFavoriteCitiesWithWeather: () => FavoriteCity[];
  debugLog: () => FavoriteCity[];
}

export const useFavoriteCitiesStore = create<FavoriteCitiesState>()(
  persist(
    (set, get) => ({
      favoriteCities: [],
      
      // 添加调试方法
      debugLog: () => {
        console.log('当前收藏城市:', get().favoriteCities);
        return get().favoriteCities;
      },
      
      addFavoriteCity: (city: string, country: string, weatherData?: WeatherData) => {
        set((state) => {
          // 检查是否已经收藏
          const existingIndex = state.favoriteCities.findIndex(
            (fav) => fav.name.toLowerCase() === city.toLowerCase()
          );
          
          if (existingIndex >= 0) {
            // 如果已存在，更新天气数据
            const updatedCities = [...state.favoriteCities];
            updatedCities[existingIndex] = {
              ...updatedCities[existingIndex],
              weatherData,
              lastUpdated: Date.now(),
            };
            return { favoriteCities: updatedCities };
          } else {
            // 如果不存在，添加新收藏
            const newFavorite: FavoriteCity = {
              name: city,
              country,
              weatherData,
              lastUpdated: Date.now(),
            };
            return {
              favoriteCities: [...state.favoriteCities, newFavorite],
            };
          }
        });
      },
      
      removeFavoriteCity: (cityName: string) => {
        set((state) => ({
          favoriteCities: state.favoriteCities.filter(
            (fav) => fav.name.toLowerCase() !== cityName.toLowerCase()
          ),
        }));
      },
      
      isFavoriteCity: (cityName: string) => {
        const { favoriteCities } = get();
        return favoriteCities.some(
          (fav) => fav.name.toLowerCase() === cityName.toLowerCase()
        );
      },
      
      updateCityWeatherData: (cityName: string, weatherData: WeatherData) => {
        set((state) => ({
          favoriteCities: state.favoriteCities.map((fav) =>
            fav.name.toLowerCase() === cityName.toLowerCase()
              ? { ...fav, weatherData, lastUpdated: Date.now() }
              : fav
          ),
        }));
      },
      
      getFavoriteCitiesWithWeather: () => {
        const { favoriteCities } = get();
        return favoriteCities.filter((fav) => fav.weatherData);
      },
    }),
    {
      name: 'favorite-cities-storage',
    }
  )
);