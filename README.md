# Ajodge

A Telegram-integrated web application for creating and managing Ajo (thrift/rotational savings) groups.

Created for the [Enyata Hackathon 2026](https://buildathon.enyata.com/)

## Overview

Ajodge allows users to create and manage Ajo savings groups directly through Telegram. Users can create groups, set up contribution amounts and durations, register members, and track payments.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion
- **Backend**: Express.js, Firebase Admin
- **Bot**: Telegram Bot API integration

## Project Structure

```
ajodge/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── form/         # Form components (Registration, Payment, AjoCreation)
│   │   │   ├── modals/       # Modal components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── services/         # API services
│   │   ├── animations/       # Lottie animations
│   │   └── assets/           # Static assets
│   └── package.json
│
├── backend/                  # Express.js backend server
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utilities (logging, Telegram, helpers)
│   └── package.json
```

## Features

- **Ajo Creation**: Create new savings groups with custom names, durations (3 days, 1 week, 1 month), and contribution amounts
- **Member Registration**: Register members to Ajo groups
- **Payment Tracking**: Track and manage member payments
- **Telegram Integration**: Bot commands for group management directly from Telegram

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Telegram Bot Token (for bot functionality)
- Firebase project (for backend services)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ajodge
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Configuration

The backend requires environment variables for:
- Firebase configuration
- Telegram Bot Token

Create a `.env` file in the backend directory with your configuration.

### Running the Application

**Frontend (development):**
```bash
cd frontend
npm run dev
```

**Backend (development):**
```bash
cd backend
npm run dev
```

The frontend runs on `http://localhost:5173` (default Vite port).
The backend runs on `http://localhost:8080`.

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

## API Endpoints

- `POST /api/ping` - Health check
- `POST /api/bot` - Telegram bot webhook endpoint
- `POST /api/session` - Ajo session management

## Routes

| Path | Description |
|------|-------------|
| `/` | Ajo creation form |
| `/ajo-payment` | Payment form |
| `/ajo-registration` | Registration form |

## License

ISC
