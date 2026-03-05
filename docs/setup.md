# Setup & Development Guide

Follow these steps to get the AI SDLC Platform running on your local machine.

## Prerequisites

- **Node.js**: v18 or later.
- **npm**: v9 or later.

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Backend Setup**:

   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:

   ```bash
   cd ../frontend-app
   npm install
   ```

## Configuration

1. Create a `.env` file in the `backend/` directory based on the following:

   ```env
   PORT=3001
   NODE_ENV=development
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY=your_openai_api_key_here
   AI_MODE=mock # Toggle between 'mock' and 'real'
   ```

## Database Initialization

In the `backend/` directory:

1. **Initialize the database**:

   ```bash
   npx prisma db push
   ```

2. **Seed Sample Data**:
   - Seed global employees:

     ```bash
     npx tsx seed_employees.ts
     ```

   - Seed demo projects:

     ```bash
     npx tsx prisma/seed_projects.ts
     ```

## Running the Application

### Option 1: Automatic (Windows)

Run the root-level batch file:

```bash
./start.bat
```

### Option 2: Manual

- **Backend**: `cd backend && npm run dev`
- **Frontend**: `cd frontend-app && npm run dev`

The platform will be available at [http://localhost:3000](http://localhost:3000).
