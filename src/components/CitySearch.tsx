import React, { useState } from 'react';
import { SearchForm, Input, Button } from './styled/StyledComponents';

interface CitySearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({ onSearch, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="输入城市名称 (如: 北京, 上海, 广州)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={!city.trim() || isLoading}>
        {isLoading ? '加载中...' : '查询天气'}
      </Button>
    </SearchForm>
  );
};

export default CitySearch; 