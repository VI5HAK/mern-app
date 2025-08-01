# MERN Stack Task Management Application

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for managing agents and distributing tasks. The application features role-based access control with admin and agent user types.

## 🚀 Features

### Admin Features
- **User Authentication**: Secure login system with JWT tokens
- **Agent Management**: Create, view, edit, and delete agents
- **File Upload**: Upload CSV/XLSX files containing task data
- **Task Distribution**: Automatically distribute tasks among available agents
- **Dashboard**: Overview of all system activities

### Agent Features
- **Task Viewing**: View assigned tasks with contact details and notes
- **Personal Dashboard**: Clean interface showing only relevant information
- **Secure Access**: Role-based authentication ensuring agents only see their tasks

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Bcryptjs**: Password hashing
- **Multer**: File upload handling
- **XLSX**: Excel file parsing

### Frontend
- **React.js**: JavaScript library for building user interfaces
- **Material-UI**: React component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Context API**: State management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB Community Server** (v4.4 or higher)
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd mern-app
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Set Up Environment Variables

#### Backend Environment Setup

Create a `.env` file in the `backend` directory:

```bash
cd ../backend
```

Create the `.env` file with the following content:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mern-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

**Important Notes:**
- Replace `your-super-secret-jwt-key-here` with a strong, unique secret key
- The MongoDB URI assumes MongoDB is running locally on the default port (27017)
- The backend will run on port 3000

### Step 5: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Otherwise, start it manually from the MongoDB installation directory
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 6: Start the Backend Server

```bash
cd backend
npm start
```

You should see output like:
```
Server running on port 3000
Connected to MongoDB
```

### Step 7: Start the Frontend Development Server

Open a new terminal window and run:

```bash
cd frontend
npm start
```

The React app will open automatically in your browser at `http://localhost:3001` (or the next available port).

## 👥 User Setup

### Creating the First Admin User

The application doesn't come with a default admin user. You'll need to create one using the API:

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "mobile": "+1234567890",
    "password": "admin123",
    "role": "admin"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Creating Agent Users

After logging in as admin, you can create agents through the web interface or API:

```bash
curl -X POST http://localhost:3000/users/agents \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agent Name",
    "email": "agent@example.com",
    "mobile": "+1234567890",
    "password": "agent123"
  }'
```

## 📁 Project Structure

```
mern-app/
├── backend/
│   ├── models/
│   │   ├── User.js          # User/Agent model
│   │   └── Task.js          # Task model
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── routes/
│   │   └── users.js         # All API routes
│   ├── .env                 # Environment variables
│   ├── app.js               # Express server setup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AgentDashboard.js
│   │   │   ├── AgentManagement.js
│   │   │   └── FileUpload.js
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile

### Agent Management (Admin Only)
- `POST /users/agents` - Create new agent
- `GET /users/agents` - Get all agents
- `GET /users/agents/:id` - Get specific agent
- `PUT /users/agents/:id` - Update agent
- `DELETE /users/agents/:id` - Delete agent

### File Upload & Task Distribution (Admin Only)
- `POST /users/upload` - Upload CSV/XLSX file and distribute tasks

### Task Management
- `GET /users/tasks/:agentId` - Get tasks for specific agent (Admin)
- `GET /users/my-tasks` - Get tasks for logged-in agent (Agent)

## 📊 File Upload Format

The application accepts CSV, XLS, and XLSX files with the following format:

**CSV Example:**
```csv
FirstName,Phone,Notes
John Doe,+1234567890,Interested in premium plan
Jane Smith,+0987654321,Follow up next week
```

**Required Columns:**
- `FirstName`: Contact's first name
- `Phone`: Contact's phone number
- `Notes`: Additional notes (optional)

## 🧪 Testing the Application

### 1. Test Admin Login
1. Open `http://localhost:3001` in your browser
2. Login with admin credentials
3. You should see the admin dashboard with "Agent Management" and "File Upload" options

### 2. Test Agent Creation
1. Go to "Agent Management"
2. Click "Add Agent"
3. Fill in the form and create an agent

### 3. Test File Upload
1. Go to "File Upload"
2. Upload a CSV file with the required format
3. Tasks should be distributed among available agents

### 4. Test Agent Login
1. Logout and login with agent credentials
2. You should see the agent dashboard with only "My Tasks"
3. Click "My Tasks" to view assigned tasks

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcryptjs for secure password storage
- **Role-based Access**: Admin and agent role separation
- **Protected Routes**: Frontend and backend route protection
- **Input Validation**: Server-side validation for all inputs

---

**Happy Coding! 🎉** 