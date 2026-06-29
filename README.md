# QuoteFlow

A full-stack quote management application built with **React** (frontend) and **Node.js/Express + MongoDB** (backend).

## Project Structure

```
Quoteflow/
└── quoteflow/
    ├── backend/          # Express API server
    │   ├── config/       # Database configuration
    │   ├── controllers/  # Route handlers
    │   ├── middleware/    # Auth middleware
    │   ├── models/       # Mongoose schemas
    │   ├── routes/       # API routes
    │   └── server.js     # Entry point
    └── frontend/         # React application
        ├── public/       # Static assets
        └── src/
            ├── api/        # Axios instance
            ├── components/ # Reusable components
            ├── context/    # Auth context
            └── pages/      # Page components
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd quoteflow/backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev             # Starts with nodemon on port 5000
```

### Frontend Setup

```bash
cd quoteflow/frontend
npm install
npm start               # Starts on port 3000
```

## Environment Variables

See [`quoteflow/backend/.env.example`](quoteflow/backend/.env.example) for required backend environment variables.

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Tailwind CSS
- **Backend:** Express, Mongoose, JWT Authentication, bcrypt
- **Database:** MongoDB Atlas

## License

MIT
