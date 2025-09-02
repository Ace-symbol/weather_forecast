import styled from 'styled-components';

// 应用容器
export const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

// 卡片容器
export const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

// 城市选择表单
export const SearchForm = styled.form`
  display: flex;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Input = styled.input`
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  margin-right: 0.5rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #357abf;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// 天气信息组件
export const WeatherContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const TemperatureText = styled.h2`
  font-size: 3rem;
  margin: 0;
  color: #333;
`;

export const WeatherDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0.5rem 0;
`;

export const WeatherDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const WeatherDetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DetailLabel = styled.span`
  font-size: 0.9rem;
  color: #888;
`;

export const DetailValue = styled.span`
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  padding: 1rem;
  background-color: #fce8e6;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`; 