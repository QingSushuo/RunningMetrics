# RunningMetrics - 跑步经济性指标实时分析应用

![React Native](https://img.shields.io/badge/React%20Native-0.72.3-blue)
![Expo](https://img.shields.io/badge/Expo-49.0.0-lightgrey)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-success)

##  项目简介

RunningMetrics 是一个基于 React Native 和 Expo 的移动应用，专门用于实时分析跑步经济性指标。通过手机内置的加速度计和陀螺仪传感器，实时计算并展示关键的跑步动态数据。

##  核心功能

- **实时步频监测** - 精确计算每分钟步数
- **垂直振幅分析** - 评估跑步效率的关键指标
- **触地时间估算** - 简化算法估算脚掌与地面接触时间
- **数据平滑处理** - 实时数据滤波，显示稳定可读
- **直观UI界面** - 现代化设计，关键指标突出显示

##  技术架构

### 技术栈
- **前端框架**: React Native 0.72.3
- **开发平台**: Expo SDK 49
- **传感器API**: Expo Sensors
- **信号处理**: 自定义 JavaScript 算法
- **状态管理**: React Hooks

### 环境要求
- **Node.js 16+**
- **npm 或 yarn**
- **Expo CLI**
- **iOS/Android 真机或模拟器**

## 真机测试
- **在手机安装 Expo Go App(注意App的版本需要与环境兼容)**
- **扫描终端显示的二维码**
- **确保手机与电脑在同一网络**

## 致谢
- **Expo 团队提供的优秀传感器API**
- **React Native 社区丰富的资源**
