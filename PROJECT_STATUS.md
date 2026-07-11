# Event Management Project Status

Last updated: July 10, 2026

## Main Goal

Finish and push the Event Management full-stack project as the main React + DBMS project.

## Project Path

`C:\Users\M Prasad\placement_prep\web_dev\event-management-system`

## Current Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL

## Completed

- Express backend exists in `server.js`.
- MySQL connection exists in `db/db.js`.
- SQL schema exists in `db/schema.sql`.
- React frontend exists in `frontend`.
- Dashboard displays events, participants, and registrations.
- Dashboard displays the most attended events report.
- Dashboard has a schedule form to demonstrate trigger-based time clash prevention.
- Participant add/delete logic is implemented.
- Event registration add/remove logic is implemented.
- Vite proxy points `/api` to `http://localhost:5000`.
- Backend route list is documented in README.
- Frontend production build passes.
- Backend syntax check passes.

## Backend Routes

- `GET /api/db_events`
- `GET /api/db_participants`
- `POST /api/participants`
- `PUT /api/participants/:id`
- `DELETE /api/participants/:id`
- `GET /api/registrations`
- `POST /api/registrations`
- `DELETE /api/registrations/:eventId/:participantId`
- `GET /api/reports/most-attended`
- `GET /api/schedules`
- `POST /api/schedules`

## How To Run

Backend:

```powershell
cd "C:\Users\M Prasad\placement_prep\web_dev\event-management-system"
npm.cmd run dev
```

Frontend:

```powershell
cd "C:\Users\M Prasad\placement_prep\web_dev\event-management-system\frontend"
npm.cmd run dev
```

## Immediate Next Tasks

1. Run MySQL and import `db/schema.sql`.
2. Run backend and frontend together.
3. Test add participant.
4. Test event registration.
5. Test most-attended report.
6. Test trigger demo using event 2 on 2024-03-20 from 11:00 to 13:00.
7. Take screenshots.
8. Push to GitHub.

## Skip For This Week

- FocusRefund React conversion
- Redux
- Next.js
- TypeScript
- Authentication/JWT
- Docker
- Advanced system design

## One-Week DSA Focus

- Arrays and strings revision
- Hash maps and sets
- Stack/queue basics
- Linked list basics
- Trees basics
- Graph BFS/DFS
- Topological sort only if time remains
