# React 天气预报应用

这是一个使用React和TypeScript构建的天气预报应用，可以查询全球各地的实时天气信息，并支持城市收藏功能。

## 功能特点

- 🌍 **城市搜索**：按城市名称搜索天气信息
- 📍 **定位服务**：使用地理位置获取当前位置的天气
- 📊 **详细信息**：显示当前温度、天气状况、湿度、风速、气压等完整信息
- 📈 **温度趋势**：展示未来三天的温度变化图表
- ❤️ **城市收藏**：收藏喜欢的城市，在首页快速查看天气
- 🔄 **自动更新**：收藏城市的天气信息自动更新（每10分钟）
- 📱 **响应式设计**：适配各种屏幕尺寸

## 如何开始

### 前提条件

- Node.js (推荐v14或更高版本)
- npm 或 yarn

### 安装

1. 克隆此仓库或下载源代码
2. 进入项目目录
3. 安装依赖

```bash
npm install
# 或
yarn install
```

4. 在 `src/services/weatherService.ts` 文件中，将 `API_KEY` 替换为您从 [OpenWeatherMap](https://openweathermap.org/api) 获取的API密钥

```typescript
const API_KEY = 'YOUR_API_KEY'; // 替换为您自己的API密钥
```

> **重要提示：** 如果使用当前位置查询天气时出现401无权限错误，请确保您已:
> 1. 注册并激活了OpenWeatherMap账户
> 2. 生成了有效的API密钥并等待激活（新注册的密钥可能需要几小时才能激活）
> 3. 正确地将密钥复制到weatherService.ts文件中
> 4. 确保您的API订阅计划允许使用当前位置查询（免费计划支持这一功能）

### 运行应用

```bash
npm start
# 或
yarn start
```

应用将在开发模式下运行，打开 [http://localhost:3000](http://localhost:3000) 即可在浏览器中查看。

## 使用说明

### 基本功能

1. **搜索城市天气**：
   - 在首页搜索框中输入城市名称
   - 点击搜索或按回车键查看天气详情

2. **使用当前位置**：
   - 点击首页的"使用当前位置"按钮
   - 允许浏览器访问位置信息
   - 自动获取当前位置的天气

### 收藏功能

1. **收藏城市**：
   - 搜索并进入任意城市的天气详情页
   - 点击右上角的"🤍 收藏"按钮
   - 按钮变为"❤️ 已收藏"表示收藏成功

2. **查看收藏城市**：
   - 返回首页，在搜索框下方会显示所有收藏的城市
   - 每个收藏城市显示当前温度、天气状况等信息
   - 点击收藏城市卡片可查看详细天气

3. **取消收藏**：
   - 在首页的收藏城市卡片中，点击右上角的"×"按钮
   - 或进入该城市的天气详情页，点击"❤️ 已收藏"按钮

4. **自动更新**：
   - 收藏城市的天气信息每10分钟自动更新一次
   - 更新时会显示"更新中..."状态

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

此命令会在 `build` 文件夹中生成用于生产环境的优化版本。

## 技术栈

### 前端框架
- **react**：用于构建用户界面的javascript库
- **typescript**：javascript的超集，提供静态类型检查

### 状态管理
- **zustand**：轻量级状态管理库，支持持久化存储

### 样式与ui
- **styled-components**：css-in-js库，用于组件样式管理
- **recharts**：基于react的图表库，用于绘制温度趋势图

### 网络请求
- **axios**：基于promise的http客户端，用于api请求

### 数据源
- **openweathermap api**：提供天气数据和预报信息

### 开发工具
- **react scripts**：create react app的构建工具
- **eslint**：代码质量检查工具
- **jest**：javascript测试框架

## 项目结构

```
src/
├── components/          # react组件
│   ├── citysearch.tsx     # 城市搜索组件
│   ├── favoritecities.tsx # 收藏城市展示组件
│   ├── weatherinfo.tsx   # 天气详情组件
│   └── styled/           # 样式组件
├── services/           # 服务层
│   └── weatherservice.ts # 天气api服务
├── store/              # 状态管理
│   └── favoritecitiesstore.ts # 收藏城市状态管理
├── app.tsx             # 主应用组件
└── index.tsx           # 应用入口
```

## 许可证

MIT
