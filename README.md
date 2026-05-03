# Study-Easy LMS

Study-Easy is a full-stack learning management system built with the MERN stack. It allows students to browse, purchase, and consume courses, while instructors can create courses, manage content, and track their teaching activity.

Developed by **Amit Kumar**.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [License](#license)

## Features

### Student Features

- User registration and login
- OTP-based email verification
- Course browsing and course details
- Wishlist and cart management
- Course purchase using Razorpay
- Enrolled course access
- Profile management
- Course ratings and reviews

### Instructor Features

- Instructor dashboard
- Course creation and editing
- Section and subsection management
- Video and media upload using Cloudinary
- Course analytics and insights
- Profile management

### Backend Features

- JWT-based authentication
- Password reset flow
- Role-based user workflows
- Course, category, profile, and payment APIs
- Razorpay payment integration
- Cloudinary media storage
- MongoDB data persistence

## Tech Stack

### Frontend

- React.js
- Vite
- Redux Toolkit
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer
- Razorpay
- Cloudinary

## Project Structure

```text
Study-Notion-LMS/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- .env.example
|   |-- package.json
|   |-- vite.config.js
|   `-- vercel.json
|-- render.yaml
|-- LICENSE
`-- README.md
```

## Environment Variables

Create `.env` files in both `backend` and `frontend` directories. Use the included `.env.example` files as templates.

### Backend

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

MAIL_HOST=your_mail_host
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

### Frontend

```env
VITE_APP_BASE_URL=http://localhost:5000/api/v1
VITE_APP_RAZORPAY_KEY=your_razorpay_key
```

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Study-Notion-LMS
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create the following files:

- `backend/.env`
- `frontend/.env`

Copy the variables from `.env.example` files and fill in your own credentials.

### 5. Start the backend

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### 6. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Deployment

This project is designed for split deployment:

- Deploy `backend` as a Node.js web service.
- Deploy `frontend` as a static Vite site.

### Render Deployment

The repository includes a `render.yaml` blueprint.

1. Push the repository to GitHub.
2. Open Render and create a new Blueprint.
3. Select this repository.
4. Add all required backend environment variables from `backend/.env.example`.
5. Add all required frontend environment variables from `frontend/.env.example`.
6. Set backend `FRONTEND_URL` to your deployed frontend URL.
7. Set frontend `VITE_APP_BASE_URL` to your deployed backend URL followed by `/api/v1`.

Example:

```env
VITE_APP_BASE_URL=https://your-backend-service.onrender.com/api/v1
FRONTEND_URL=https://your-frontend-service.onrender.com
```

### Vercel Frontend Deployment

The frontend includes `frontend/vercel.json` for React Router refresh support.

Use these settings on Vercel:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Set this frontend environment variable:

```env
VITE_APP_BASE_URL=https://your-backend-service-url/api/v1
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
