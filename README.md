# ⚡ TASKIFY PRO — MULTIVERSE TASK MANAGER OS

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-FFE600?style=for-the-badge&logo=pwa&logoColor=black)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-FF007A?style=for-the-badge)](LICENSE)

> **Effortless planning. Limitless focus.**  
> A high-energy, Spider-Verse inspired, Pop-Art Neo-Brutalist Task Management OS designed for creators, developers, and high-velocity teams.

---

## ✨ Features Arsenal

- 🕷️ **Spider-Verse Neo-Brutalist Design System**: Halftone comic patterns, dynamic ASCII glitch hover effects, vibrant neon color palettes, and playful micro-animations.
- 📋 **Flexible Mission Views**:
  - **List View**: Rapid task tracking with priority badges, status filters, and category tags.
  - **Kanban Board**: Drag-and-drop workflow lanes (`Pending`, `In Progress`, `Completed`).
  - **Calendar Grid**: Visual deadline tracking with interactive day-by-day task inspection.
  - **Analytics Dossier**: Productivity metrics, completion percentages, streak badges, and velocity charts.
  - **Multiverse Focus Timer**: Interactive Pomodoro timer with audio chimes and glitch countdowns.
- 📱 **Progressive Web App (PWA) & Mobile Native Feel**:
  - Standalone app install on Android, iOS, Windows, and Mac.
  - Responsive layout tailored for all viewport sizes (including compact mobile devices like Vivo Y73, iPhones, and tablets).
  - Floating Action Button (FAB) for one-thumb task logging on mobile.
- 📄 **Comic PDF Dossier Export**: Generate and download formatted comic mission reports directly from the browser.
- 🔐 **Secure Multi-User Vault**: JWT authentication, OTP password reset vault, profile customization, and cross-origin LAN access.
- ⚡ **Global Command Palette**: Instant keyboard shortcuts (`Ctrl+K` / `Cmd+K`) for lightning navigation and rapid actions.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite 7**
- **TailwindCSS v4** + Custom Neo-Brutalist CSS tokens
- **Framer Motion** for physics-based spring animations and UI transitions
- **Lucide Icons** + Custom SVG glyphs
- **TanStack React Query** + **Axios** for data synchronization

### Backend
- **Python 3** + **Flask REST API**
- **Flask-SQLAlchemy** (SQLite / PostgreSQL)
- **Flask-JWT-Extended** for secure token authentication
- **Flask-Limiter** & **Flask-CORS** with dynamic LAN device support

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Taskify-Pro.git
cd Taskify-Pro
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```
Backend will start on `http://localhost:5000` (and `http://0.0.0.0:5000` for LAN access).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`. Open on your computer or scan the LAN network URL from your mobile device!

---

## 📱 PWA Installation

To install **Taskify Pro** as a standalone native app:
1. Open the app in **Google Chrome** (desktop or mobile).
2. Click the **"⚡ INSTALL APP"** button in the top navigation or sidebar.
3. On Android: Tap `⋮` menu ➔ Tap **"Install App"** / **"Add to Home screen"**.
4. On iOS: Tap `Share (⬆)` ➔ Tap **"Add to Home Screen"**.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
