# 📱 OneQR Client Frontend Application

This is the customer-facing and merchant-facing frontend web application for OneQR. It provides a landing experience, a comprehensive workspace dashboard for merchants to edit and manage business cards/billing, and mobile-responsive public profile templates.

---

## 🎨 Design System & Animation Engine

This interface uses a premium design approach:
- **Tailwind CSS v4.0**: Leverages CSS variables and custom utility tokens for layout rendering.
- **GSAP (GreenSock)** & **Framer Motion**: Orchestrates animations, hover actions, and page transitions.
- **Lenis**: Controls smooth, hardware-accelerated viewport scrolling for a premium visual flow.

---

## 📂 Project Structure

```
client/
├── public/                 # Static public assets (icons, images)
├── src/
│   ├── App.jsx             # React router mapping landing, dashboards, and profiles
│   ├── index.css           # Global typography, Tailwind v4 configurations, and themes
│   ├── main.jsx            # Application mount point
│   ├── components/         # Modular React components
│   │   ├── dashboard/      # Billing tabs, custom cards, scan monitors, and scanners
│   │   ├── landing/        # Hero grids, value propositions, and use cases
│   │   └── shared/         # Navigation bars, dialogs, and footers
│   ├── context/            # React context providers managing auth state and themes
│   ├── pages/              # Primary view pages (LandingPage, DashboardPage, DemoProfilePage)
│   ├── services/           # Backend API connector wrappers
│   └── utils/              # Export helpers, validators, and contact handlers
├── vite.config.js          # Vite and Tailwind compiler parameters
└── README.md               # Client documentation
```

---

## 🛠️ Key Frontend Workspaces

### 1. Merchant Dashboard (`DashboardPage.jsx`)
Features a tabbed sidebar console allowing user-level profile configuration:
- **Overview**: Real-time scan and view analytics.
- **Profile Setup**: Interactive input forms mapping phone numbers, catalogs, colors, and links.
- **QR / Standy Allocation**: Scan or input unique QR serial IDs to claim hardware.
- **Plan & Billing**: Review order history, purchase upgrades, and invoke checkout modals.
- **Feedbacks Tracker**: List customer testimonials, reviews, and ratings.

### 2. Digital Profile Template (`DemoProfilePage.jsx`)
A highly optimized, mobile-first dynamic business card page containing:
- Direct click-to-contact shortcuts.
- Interactive custom links.
- Document readers (Cloudinary downloads).
- Review submission forms.
- One-click vCard (.vcf) compilation.

---

## ⚙️ Local Development Quickstart

### 1. Establish Environmental Credentials
Create a `.env` file in the root of the client directory:
```ini
VITE_API_URL=http://localhost:5000/api
VITE_QR_URL_PREFIX=http://localhost:5173
```

### 2. Install Project Packages
```bash
npm install
```

### 3. Run Dev Server
```bash
npm run dev
```
The application will boot on http://localhost:5173.

### 4. Compiling Production Bundles
```bash
npm run build
```
Generates optimized static web assets inside the `dist/` directory.
