# Ridge Plumbing — MERN Stack Website

Full-stack website with public frontend and admin panel built in the MERN stack.

## Project Structure

```
ridge-plumbing/
├── backend/          ← Express + MongoDB API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── seed.js
│   ├── server.js
│   └── .env.example
│
└── frontend/         ← React + Vite
    └── src/
        ├── components/
        │   ├── common/     (Icons, ProtectedRoute)
        │   ├── layout/     (Navbar, Footer)
        │   ├── sections/   (Hero, Services, Testimonials, etc.)
        │   └── admin/      (AdminLayout)
        ├── pages/
        │   ├── Home, Services, Testimonials, Contact
        │   └── admin/      (Dashboard, Leads, Services, Testimonials, Gallery, Settings)
        ├── context/        (AuthContext)
        └── utils/          (api.js)
```

---

## Setup Instructions

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, and Cloudinary credentials
npm install
npm run seed      # Creates admin user + default services
npm run dev       # Starts on port 5000
```

**Default admin credentials after seeding:**
- Email: `admin@ridgeplumbing.ca`
- Password: `RidgeAdmin2024!`

> Change the password immediately after first login via Settings page.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev       # Starts on port 3000
```

---

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ridge-plumbing
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## Admin Panel

Navigate to `/admin` after login.

| Section | Description |
|---|---|
| Dashboard | Lead stats + recent enquiries |
| Leads | View, filter, and update lead status |
| Services | Add/edit services with Cloudinary image upload |
| Testimonials | Manage customer reviews |
| Gallery | Upload work photos to Cloudinary |
| Settings | Hero content, offer banner, SEO, logo |

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | Public | Admin login |
| GET | /api/auth/me | Admin | Get current user |
| POST | /api/leads | Public | Submit contact form |
| GET | /api/leads | Admin | Get all leads |
| GET | /api/leads/stats | Admin | Lead statistics |
| PUT | /api/leads/:id | Admin | Update lead |
| DELETE | /api/leads/:id | Admin | Delete lead |
| GET | /api/services | Public | Get active services |
| POST | /api/services | Admin | Create service |
| PUT | /api/services/:id | Admin | Update service |
| DELETE | /api/services/:id | Admin | Delete service |
| GET | /api/testimonials | Public | Get active reviews |
| POST | /api/testimonials | Admin | Create review |
| GET | /api/gallery | Public | Get gallery images |
| POST | /api/gallery | Admin | Upload image |
| GET | /api/settings | Public | Get site settings |
| PUT | /api/settings | Admin | Update settings |

---

## Deployment

### Backend — Railway / Render
- Set all environment variables from `.env`
- Set `NODE_ENV=production`
- Set `FRONTEND_URL=https://yourdomain.com`

### Frontend — Vercel / Netlify
- Set `VITE_API_URL=https://your-backend.railway.app/api`
- Build command: `npm run build`
- Output directory: `dist`

---

## Logo

Upload `logo.png` to the `frontend/public/` folder. The logo is referenced at `/logo.png`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB |
| Auth | JWT + bcryptjs |
| Image uploads | Cloudinary via multer-storage-cloudinary |
| Frontend | React 18, Vite 5 |
| Routing | React Router v6 |
| HTTP client | Axios |
| Notifications | react-hot-toast |
| Styling | CSS Modules + CSS Custom Properties |
| Icons | Custom SVG components |
| Public images | Unsplash |
| Service images | Cloudinary |
