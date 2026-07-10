# Event Management System

A full-stack DBMS web application to manage events, organizers, participants, schedules, and event registrations.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- API: REST endpoints using JSON

## Features

- View scheduled events with organizer name, date, time, and participant count
- View all participants from the MySQL database
- Add a new participant from the React dashboard
- Delete participants
- Register a participant for an event
- Remove an event registration
- Uses SQL joins to display event, organizer, participant, and registration data
- Includes a database trigger to prevent schedule time clashes

## Database Tables

- `organizers`
- `events`
- `participants`
- `event_participation`
- `schedule`

## How To Run

### 1. Database Setup

Import the schema into MySQL:

```sql
SOURCE db/schema.sql;
```

Create a `.env` file in the project root:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=event_management
```

### 2. Backend

```powershell
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### 3. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## API Endpoints

```text
GET    /api/db_events
GET    /api/db_participants
POST   /api/participants
PUT    /api/participants/:id
DELETE /api/participants/:id
GET    /api/registrations
POST   /api/registrations
DELETE /api/registrations/:eventId/:participantId
```

## Project Structure

```text
server.js              Express backend
db/db.js               MySQL connection pool
db/schema.sql          Database schema and sample data
frontend/src/App.jsx   React dashboard logic
frontend/src/App.css   Dashboard styling
```
