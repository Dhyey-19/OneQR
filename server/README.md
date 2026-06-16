# 🚀 OneQR Backend Service Gateway

This is the central Express.js REST API gateway for the OneQR platform. It handles user authentication, profile styling configurations, QR code redirection metrics, Cloudinary digital asset streaming, and subscription payment transactions.

---

## 📂 Core Structure

```
server/
├── src/
│   ├── app.js               # Express application initialization & middleware pipeline
│   ├── index.js             # Main server HTTP bootstrapper
│   ├── config/              # Infrastructure and cloud service integrations (MongoDB, Cloudinary, Swagger)
│   ├── controllers/         # Core business logic handlers (Auth, Profile, Payments, Admin)
│   ├── dtos/                # Data Transfer Objects / Request-Response format helpers
│   ├── middleware/          # Security, auth verification, and file parsing layers
│   ├── models/              # Mongoose database schemas (User, Profile, OneQr, Feedback, Batch)
│   ├── routes/              # HTTP routers mapping endpoints to controllers
│   ├── services/            # Auxiliary service layers (Payments, uploads)
│   └── utils/               # Shared helper functions and stream parsers
├── .env.example             # Configuration settings template
├── package.json             # Service dependencies and runners
└── README.md                # Server developer guide
```

---

## 🛠️ Middleware Architecture

The backend pipeline enforces several security and operational middleware components:
1. **Gzip Compression**: Powered by `compression` to minimize payload footprint and optimize responses.
2. **CORS Guard**: Strict source origin checking verifying requests against comma-separated white-lists set in the environment variables.
3. **Request Logger**: Custom performance log tracker printing execution speed (`ms`) and endpoint paths to the console.
4. **JWT Verification**: Validates requests with `Bearer <token>` headers to populate `req.user`.
5. **Multer Buffer Stream**: Parses incoming multipart file uploads in-memory, streaming them directly to Cloudinary without local disk dependency.
6. **Global Error Boundary**: Catch-all handler rendering formatted JSON outputs for unexpected runtime failures, preventing process crashes.

---

## 📄 Swagger API Documentation Playground

The platform integrates Swagger UI. When the server is running in development mode, access the live playground:
👉 **URL**: `http://localhost:<PORT>/api-docs` (Default: `http://localhost:5000/api-docs`)

This playground lists:
- Strict JSON Request/Response payloads.
- Security bearer token headers.
- Return codes (`200 OK`, `400 Bad Request`, `401 Unauthorized`, `500 Server Error`).

---

## ⚙️ Local Development Quickstart

### 1. Configure the Environment
Copy the configuration template:
```bash
cp .env.example .env
```
Ensure you fill in at least the MongoDB connection URL (`DB_URL`) and a `JWT_SECRET`.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Runs the service inside `nodemon` for auto-reloading upon file modifications.

### 4. Production Build Execution
```bash
npm start
```

---

## 📦 Service Dependencies

- **express (v5.x)**: Next-generation fast, minimalist web framework.
- **mongoose (v9.x)**: Schema-based MongoDB modeling.
- **bcryptjs**: Secure password hashing logic.
- **jsonwebtoken**: Bearer token authentication.
- **cloudinary**: Cloud hosting for catalog PDFs and branding assets.
- **razorpay**: Automated billing and merchant checks.
- **nodemailer**: Dispatches SMTP feedback and inquiry messages.
- **swagger-ui-express & swagger-jsdoc**: Renders API schemas and definitions.
