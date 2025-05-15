# Document Management Application

A full-stack document management system built with Next.js, Express, and PostgreSQL.

## Features

- User Authentication (Sign up, Login)
- Role-based Access Control (Admin, Editor, Viewer)
- Document Upload and Management
- Document Ingestion with OCR
- Search and Filter Documents
- User Management (Admin only)

## Tech Stack

### Frontend
- Next.js 15.3.2
- React 19
- TailwindCSS 4
- Headless UI Components
- TypeScript

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer for File Upload
- Tesseract.js for OCR

## Project Structure

```
document-management-app/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── utils/          # Utility functions
│   │   ├── apis/           # API integration
│   │   └── interfaces/     # TypeScript interfaces
│   └── public/             # Static assets
│
└── backend/                 # Express.js backend application
    ├── src/
    │   ├── controllers/    # Route controllers
    │   ├── middleware/     # Custom middleware
    │   ├── routes/         # API routes
    │   ├── utils/          # Utility functions
    │   └── prisma/         # Database schema and migrations
    └── uploads/            # Document storage
```

## User Roles and Permissions

### Admin
- Full access to all features
- User management (create, read, update, delete)
- Document management (upload, read, update, delete)
- Document ingestion management
- System configuration

### Editor
- Document management (upload, read, update, delete)
- Document ingestion
- Search and filter documents
- Cannot manage users or system settings

### Viewer
- Read-only access to documents
- Search and filter documents
- Cannot modify documents or manage users

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/document_management"
   JWT_SECRET="your-secret-key"
   PORT=3001
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   NEXT_PUBLIC_APP="document-management-app"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication

#### Sign Up
- **POST** `/auth/signup`
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "admin" | "editor" | "viewer"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### User Management

#### Get All Users (Admin only)
- **GET** `/users`
- **Headers:** `Authorization: Bearer <token>`

#### Get User by ID (Admin only)
- **GET** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Create User (Admin only)
- **POST** `/users`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "admin" | "editor" | "viewer"
  }
  ```

#### Update User (Admin only)
- **PUT** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "role": "admin" | "editor" | "viewer"
  }
  ```

#### Delete User (Admin only)
- **DELETE** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`

### Document Management

#### Upload Document (Admin, Editor)
- **POST** `/documents`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Body:**
  ```
  file: <file>
  ```

#### Get All Documents (All roles)
- **GET** `/documents`
- **Headers:** `Authorization: Bearer <token>`

#### Get Document by ID (All roles)
- **GET** `/documents/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Delete Document (Admin, Editor)
- **DELETE** `/documents/:id`
- **Headers:** `Authorization: Bearer <token>`

### Document Ingestion

#### Ingest Documents (Admin, Editor)
- **POST** `/ingestion`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "documentIds": ["string"]
  }
  ```

#### Get All Ingestions (All roles)
- **GET** `/ingestion`
- **Headers:** `Authorization: Bearer <token>`

## UI Components

### Authentication
- Login Form
- Sign Up Form
- Protected Routes
- Role-based Access Control

### Dashboard
- Role-specific Navigation
- Header with User Profile
- Document List
- Document Upload (Admin, Editor)
- Search and Filter

### User Management (Admin only)
- User List
- User Creation Form
- User Edit Form
- User Deletion Confirmation
- Role Assignment

### Document Management
- Document Grid/List View
- Document Preview
- Document Upload Modal (Admin, Editor)
- Document Actions (Admin, Editor)
  - Edit
  - Delete
  - Download
- Document View (Viewer)
  - Preview
  - Download

## Security Features

- JWT-based Authentication
- Role-based Access Control
- Password Hashing with bcrypt
- Secure File Upload
- CORS Protection
- Environment Variable Protection

## Error Handling

The application implements comprehensive error handling for:
- Authentication failures
- Authorization violations
- Invalid input data
- File upload errors
- Database operation failures
- API communication errors
- Role-based access restrictions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 