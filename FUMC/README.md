# Performance Management System

A web application for the 5-phase performance management model.

## Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL

## Database Setup

1. Create a PostgreSQL database named `performance_db`.
2. Update `backend/src/main/resources/application.properties` if your credentials differ from `postgres/postgres`.

## Backend Setup

1. Navigate to `backend` directory.
2. Run `mvn spring-boot:run`.
   - The application will start on `http://localhost:8080`.
   - Tables will be automatically created.

## Frontend Setup

1. Navigate to `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `ng serve` (or `npm run start`) to start the development server.
4. Open `http://localhost:4200` in your browser.

## Usage

1. **Login**: Use the login page. You may need to create a user first via the API or database.
   - API Endpoint: `POST /api/auth/register`
   - Body: `{ "username": "user", "password": "password", "role": "USER" }`
2. **Dashboard**: View and create forms.
3. **Phases**:
   - **Phase 1**: Register activities and headers.
   - **Phase 2**: Set frequency. Can go back to Phase 1 to add activities.
   - **Phase 3**: Set priorities (Importance, Coherence, Relevance).
   - **Phase 4**: Set time values.
   - **Phase 5**: View results.

## Project Structure

- `backend/`: Spring Boot application.
- `frontend/`: Angular application.
