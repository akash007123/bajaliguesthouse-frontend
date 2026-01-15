# Shri Balaji Home Stay - Ujjain, Madhya Pradesh

A modern homestay booking system for Shri Balaji Home Stay, located in the spiritual city of Ujjain, Madhya Pradesh. Experience authentic Indian hospitality with traditional warmth and modern amenities.

## Features

- User authentication and authorization
- Room booking and management for pilgrims and travelers
- Admin dashboard for staff and bookings
- Custom booking requests for groups and special occasions
- Temple visit arrangements and spiritual guidance
- Traditional Indian cuisine and cultural experiences
- Responsive design with Tailwind CSS
- Real-time booking status updates

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router DOM
- React Query

### Backend
- Node.js
- Express.js
- MongoDB
- JWT authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd balaji
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

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure your MongoDB connection and JWT secrets

5. Start the development servers:

Frontend:
```bash
cd frontend
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

The application will be available at `http://localhost:8080` for frontend and `http://localhost:5000` for backend.

## Project Structure

```
balaji/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
