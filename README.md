# ThingsBoard Universal Tool

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Electron](https://img.shields.io/badge/Electron-28.0.0-blueviolet.svg)
![React](https://img.shields.io/badge/React-18-blue)

A high-performance, cross-platform desktop management tool designed for **ThingsBoard** engineers. Built with Electron, React, and TypeScript, it delivers a specialized **Cyber-Industrial** experience for managing tenants, assets, and devices with high efficiency.

> **中文说明**: 这是一个专为 ThingsBoard 打造的高端通用交付工具，提供可视化的多环境管理、资产拓扑编排和高密度的设备监控界面。

---

## 🌟 Key Features

- **Cross-Platform**: Runs perfectly on macOS, Windows, and Linux.
- **Multi-Environment Management**: Seamlessly switch between Dev, Test, and Prod instances.
- **Cyber-Industrial Aesthetics**: Custom "Glassmorphism" UI with multiple themes (Cyberpunk, Dark, Light, Industrial).
- **High-Density Data Views**: Optimized list views for Tenants and Devices to manage large-scale deployments.
- **Visual Topology**: Interactive node-based graph editor for Assets and relations using React Flow.
- **Smart Auth**: Token management, auto-refresh, and "Magic Jump" to instantly impersonate tenants on the web dashboard.
- **Telemetry Analysis**: Real-time throughput calculation and visualization.

## 🛠 Tech Stack

- **Core**: Electron 28, Vite 5
- **Frontend**: React 18, TypeScript
- **State Management**: Zustand, React Query
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Visualization**: React Flow, Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/chenxu/thingsboard-universal-tool.git
   cd thingsboard-universal-tool
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run in Development Mode**

   ```bash
   npm run dev
   ```

   This will start the Vite dev server and launch the Electron application window.

4. **Build for Production**

   ```bash
   npm run build
   ```

   The distributed binaries (DMG, Exe, etc.) will be generated in the `dist` folder.

## 🎨 Themes & Customization

The tool comes with built-in themes that can be switched instantly in the Settings page:

- **Cyberpunk** (Default)
- **Dark / Light**
- **Industrial**
- **Forest**
- **Matrix**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Author**: Chen Yannan
