# 🛡️ OneQR Admin Console

This is the system administrator console for OneQR. It provides platform-wide metrics, physical inventory/batch QR code production controls, workspace slot links, and direct subscription override managers.

---

## 📂 Architecture & Directory Structure

```
admin/
├── public/                 # Static admin resources
├── src/
│   ├── App.jsx             # Route definitions and dashboard wrappers
│   ├── index.css           # Global layout styles and admin UI layouts
│   ├── main.jsx            # Application mount point
│   ├── pages/              # Primary administrative views
│   │   ├── Login.jsx       # Admin portal authorization
│   │   ├── Dashboard.jsx   # Metrics, user lookups, and slot overrides
│   │   └── OneQr.jsx       # Fleet code batch generator and zip packing tool
│   ├── services/           # REST client hooks targeting /api/admin/*
│   └── assets/             # Admin console assets
├── vite.config.js          # Vite build environment configuration
└── README.md               # Admin documentation
```

---

## 🛠️ Administrative Capabilities

### 1. Fleet Operations (`OneQr.jsx`)
- **QR Generation Engine**: Instantly generates batch ranges of distinct serial code tags.
- **Zip Packaging**: Renders generated canvas QR code targets locally, packing them into structured `.zip` files using `jszip` for bulk download and commercial print runs.
- **Batch Tracking**: Log statuses (e.g. `ordered`, `printed`, `shipped`, `delivered`) to trace standee printing progress.

### 2. Platform Command Center (`Dashboard.jsx`)
- **Real-Time Counters**: Displays aggregate indicators across active users, profiles, and printed assets.
- **User Allocation Controls**: Capability to search user profiles, assign specific plans directly, or unlink standy profiles.
- **Override Terminals**: Clear mappings, link custom QRs to profile slots, or wipe entries.

---

## ⚙️ Local Development Quickstart

### 1. Environment Configurations
Verify the API connection by setting up a `.env` configuration file:
```ini
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The console will boot on the next available port, typically http://localhost:5174.

### 4. Build Production Bundle
```bash
npm run build
```
Generates production-ready static outputs inside the `dist/` directory.
