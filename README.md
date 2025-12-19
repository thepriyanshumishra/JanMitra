# 🏛️ JAN-MITRA: Governance with Intelligence

[![Vercel App](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://janmitraportal.vercel.app/)
[![PWA Ready](https://img.shields.io/badge/PWA-Mobile%20Ready-purple?style=for-the-badge&logo=pwa)](https://janmitraportal.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-f55036?style=for-the-badge)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

![Jan-Mitra Homepage](public/screenshots/homepage.png)

> **"Delay is just a symptom. The system is the disease."**

**Jan-Mitra** (People's Friend) is a next-generation civic grievance redressal platform designed to bridge the gap between citizens and administration. It moves beyond simple "complaint logging" to **Intelligent Resolution**.

## 🚨 The Reality Check
- **1.2 Crore+** Public complaints filed in the last 5 years.
- **36%** of cases cross SLA deadlines without accountability.
- **63,000+** new cases added to the backlog every month.

Jan-Mitra solves this with **"Understand First, Act Smartly"** logic.

---

## 🌟 Key Features

### 🤖 AI Grievance Agent (Jan-Mitra AI)
Forget boring forms. Chat with our intelligent agent to file complaints.
-   **Context-Aware**: Understands natural language (e.g., "There's a huge pothole near my house").
-   **Smart Interrogation**: Asks follow-up questions if details are missing (e.g., "Is it causing a traffic jam?").
-   **Auto-Categorization**: Instantly tags issues (Sanitation, Roads, Electricity).
-   **Priority Scoring**: Assigns urgency based on keywords (e.g., "Sparking wire" = High Priority).

### 📍 Geo-Spatial Intelligence
Precise location data for faster resolution.
-   **One-Tap GPS**: Fetches your exact coordinates and converts them to a readable address.
-   **Smart Location Manager**: Choose between **GPS**, **Manual Entry**, or **Skip**.
-   **Map Verification**: Confirm your location on a card before sending.
-   **Contextual Requests**: If you say "Near the park", the AI asks "Which park?" and triggers the location picker.

### 🇮🇳 India-Localized Context
Built specifically for the Indian civic ecosystem.
-   **Civic Body Recognition**: Identifies and assigns departments like **MCD**, **BBMP**, **PWD**, **BESCOM**, **Jal Board**.
-   **Citizen Charter SLAs**: Estimates resolution time based on Indian standards (e.g., 24 hours for power outages).
-   **Local Terminology**: Understands "Ward", "Zone", "Naka", and other local terms.

### 🛡️ Role-Based Access Control (RBAC) & Admin Portal
A complete governance system with dedicated portals.
-   **Three-Tier Roles**: **Citizen** (Report), **Officer** (Resolve), **Admin** (Manage).
-   **Admin Dashboard**: comprehensive view of system health, user management, and department oversight.
-   **Department Management**: Create and manage civic bodies (PWD, Health, Police).
-   **Secure Routing**: Middleware protection ensures users only access authorized areas.

### 🌐 Multilingual Support (Bharat Interface)
Accessible to every Indian citizen.
-   **30+ Languages**: Full UI translation for Hindi, Bengali, Tamil, Telugu, and more.
-   **Native Script**: Displays languages in their native script (e.g., "हिंदी", "தமிழ்").
-   **Real-time Translation**: Integrated Google Translate engine for dynamic content.

### 🔔 Real-Time Notifications & Email
Stay informed at every step.
-   **Instant Alerts**: In-app notifications for status changes and assignments.
-   **Email Updates**: Automated emails sent to citizens when their grievance is resolved.
-   **Smart Polling**: Auto-refreshing notification bell for real-time awareness.

### 📊 Analytics & Insights
Data-driven governance for Admins.
-   **Visual Dashboards**: Interactive charts showing grievance trends and department performance.
-   **Heatmaps**: Identify problem areas (e.g., "Pothole Clusters").
-   **Resolution Metrics**: Track SLA compliance and officer efficiency.

### ⛓️ Blockchain Trust Layer (Polygon)
Immutable accountability for every grievance.
-   **Public Ledger**: Every grievance is hashed and recorded on the Polygon PoS network.
-   **Tamper-Proof**: Citizens can verify that their complaint hasn't been altered.
-   **Smart Contracts**: Deployed `GrievanceRegistry` ensures transparency.

---

## 📸 Screenshots

| **AI Chat Interface** | **Location Manager** |
|:---:|:---:|
| ![Chat](public/screenshots/chat-interface.png) | ![Location](public/screenshots/location-manager.png) |

| **Admin Portal** | **Public Ledger** |
|:---:|:---:|
| ![Admin](public/screenshots/admin-portal.png) | ![Ledger](public/screenshots/ledger.png) |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User[Citizen/User] -->|Web Interface| NextJS[Next.js App]
    NextJS -->|Auth & Data| Supabase[Supabase (PostgreSQL)]
    NextJS -->|AI Analysis| Gemini[Google Gemini AI]
    NextJS -->|Transparency| Polygon[Polygon Blockchain]
    
    subgraph "Backend Services"
        Supabase
        Gemini
        Polygon
    end
    
    subgraph "Frontend Layer"
        NextJS
        Tailwind[Tailwind CSS]
        Framer[Framer Motion]
    end
    
    Supabase -->|Real-time| NextJS
    Gemini -->|Categorization| NextJS
    NextJS -->|Hash Storage| Polygon
```

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **AI Engine**: [Groq SDK](https://groq.com/) (Llama 3.3 70B)
-   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
-   **Blockchain**: [Polygon PoS](https://polygon.technology/) (Amoy Testnet) + [Ethers.js](https://docs.ethers.org/)
-   **Maps/Geocoding**: [OpenStreetMap](https://www.openstreetmap.org/) (Nominatim API)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glass Utilities
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚡ Getting Started

### Prerequisites
-   Node.js 18+
-   npm / yarn / pnpm
-   **Groq API Key**: Get one from [console.groq.com](https://console.groq.com/)
-   **Supabase Project**: Create one at [supabase.com](https://supabase.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/thepriyanshumishra/JanMitra.git
    cd JanMitra
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file:
    ```env
    GROQ_API_KEY=your_groq_key
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open your browser**
    Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔮 Future Roadmap

-   [x] **AI Chat Interface**: Conversational grievance filing.
-   [x] **Geo-Spatial Integration**: GPS and Reverse Geocoding.
-   [x] **Localization**: India-specific departments and SLAs.
-   [x] **Real Backend**: Integrate Supabase for persistent data.
-   [x] **Smart Contracts**: Deploy actual Solidity contracts to Polygon Amoy Testnet.
-   [x] **Multilingual Support**: Hindi, Kannada, Tamil support for the AI.
-   [x] **Admin Portal**: User and Department management.
-   [ ] **Officer Mobile App**: Dedicated PWA for field officers.
-   [ ] **WhatsApp Integration**: File grievances via WhatsApp Bot.

---

Made with ❤️ for **Digital India**.
