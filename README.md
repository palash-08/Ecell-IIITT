# E-Cell IIIT Trichy Web Platform 🚀

Welcome to the official web platform for the **Entrepreneurship Cell (E-Cell) of IIIT Trichy**. This is a premium, high-performance web application designed to manage events, showcase our team and alumni, and provide a seamless administrative experience.

![E-Cell Banner](https://img.shields.io/badge/IIIT_Trichy-E--Cell-FFB800?style=for-the-badge&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## ✨ Core Features

### 🏢 Public Interface
- **Dynamic Home Page**: Features a stunning Bento-style media gallery and interactive event previews.
- **Event Management**: Browse upcoming and past events with detailed descriptions and registration support.
- **Team & Faculty**: Showcasing the core members, volunteers, and faculty incharges with dedicated profile views.
- **Alumni Directory**: A dedicated space for our alumni community with advanced filtering and search capabilities.
- **Collaborate**: Integrated contact system for partners, sponsors, and interested collaborators.

### 🔐 Admin Ecosystem
- **Real-time Dashboard**: Live status monitoring, system stats, and a dynamic activity feed.
- **Content Management System (CMS)**:
  - **Events Control**: Full CRUD operations for events with CSV export functionality.
  - **Team & Faculty Management**: Easily manage members, roles, and public-facing profiles.
  - **Media Gallery**: Centralized management for photos and videos across all events.
  - **Message Center**: Real-time access to contact form submissions and collaboration requests.
- **Advanced Navigation**: Features a collapsible desktop sidebar and a fully scrollable, mobile-optimized navigation drawer.
- **Role-Based Access**: Secure authentication with specific permissions for Admins and Super Admins.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React, Turbopack |
| **Styling** | Tailwind CSS, CSS Modals, Glassmorphism |
| **Animations** | Framer Motion (Transitions, Gestures, AnimatePresence) |
| **Icons** | React Icons (Lucide, Feather, FontAwesome) |
| **Backend** | Node.js, Express.js (REST API) |
| **Database** | (e.g. MongoDB/PostgreSQL) |

---

## 📱 Responsiveness (Mobile-First)

The entire platform—including the complex Admin Dashboard—is engineered for **perfection across all devices**.
- **Adaptive Layouts**: Grids and tables that gracefully transition between desktop and mobile.
- **Touch-Optimized**: High tap-target accuracy and smooth gesture-based navigation.
- **Performance**: Optimized asset loading and efficient re-renders for a snappy feel on slower connections.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation

**Frontend:**
```bash
# Clone the repository
git clone https://github.com/Hemanshujc1/Ecell-IIITT.git

# Install dependencies
npm install

# Start development server
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 👨‍💻 Contributing

We welcome contributions! Please follow our coding standards and ensure all UI changes are verified for responsiveness across multiple viewports.

---

## 📄 License

This project is maintained by E-Cell IIIT Trichy. All rights reserved.
