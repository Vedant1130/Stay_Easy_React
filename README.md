# Stay Easy React

A full-stack web application with a React frontend and a Django backend.

## Project Structure

```
.
├── backend/    # Django backend
└── frontend/   # React frontend powered by Vite
```

## Technologies Used

### Frontend
- **React** (v18)
- **Vite** (Frontend Tooling)
- **Tailwind CSS** (Styling)
- **Ant Design & React Bootstrap** (UI Components)
- **Framer Motion** (Animations)
- **React Router** (Routing)
- **Axios** (API requests)
- **Razorpay** (Payment Integration)

### Backend
- **Django**
- **SQLite3** (Default Database)
- **Python**

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Python](https://www.python.org/) (v3.8 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Running the Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend/Stay_Easy
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the development server:
   ```bash
   python manage.py runserver
   ```
   The backend will typically be available at `http://127.0.0.1:8000/`.

### Running the Frontend (React Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will typically be accessible at `http://localhost:5173/`.
