# OneQR Server

Backend server for the OneQR application built with Express.js and Node.js.

## Project Structure

```
server/
├── src/
│   ├── index.js              # Main application entry point
│   ├── config/
│   │   └── config.js         # Configuration settings
│   ├── routes/
│   │   └── index.js          # Route definitions
│   ├── controllers/          # Business logic for routes
│   ├── middleware/           # Custom middleware
│   │   └── index.js          # Middleware setup
│   ├── models/               # Data models
│   └── utils/                # Utility functions
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
└── package-lock.json         # Locked dependency versions
```

## Installation

1. Clone the repository
2. Navigate to the server directory
   ```bash
   cd server
   ```
3. Install dependencies
   ```bash
   npm install
   ```

## Environment Setup

1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
2. Update environment variables as needed

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
```

## API Endpoints

- `GET /` - Health check
- `GET /api/health` - API health status
- `GET /api/users` - Get users (to be implemented)
- `GET /api/qr` - Get QR codes (to be implemented)

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (development)
- `npm test` - Run tests

## Dependencies

- **express** - Web application framework
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

## License

ISC
