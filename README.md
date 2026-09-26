# SocietyHub

> A full-stack apartment and society management platform designed to simplify resident services, visitor management, maintenance billing, complaints, and amenity bookings.

## Overview

SocietyHub is a role-based apartment and society management platform built to digitize common residential community workflows.

The platform provides separate capabilities for residents, security guards, maintenance staff, and administrators. It combines a React frontend with an ASP.NET Core Web API backend, PostgreSQL database, JWT authentication, and Entity Framework Core.

The project focuses on practical full-stack development concepts including layered architecture, REST API design, role-based authorization, relational database modeling, visitor approval workflows, QR-based visitor passes, maintenance billing, complaint management, and amenity booking conflict prevention.

---

## Key Features

### Role-Based Access

SocietyHub supports multiple user roles:

- **Resident** — Manage visitors, complaints, maintenance bills, and amenity bookings
- **Security Guard** — Manage visitor entry and exit
- **Maintenance Staff** — Support maintenance-related workflows
- **Admin** — Manage residents, maintenance bills, amenities, bookings, and society-level operations

API access is protected using JWT authentication and role-based authorization.

---

### Smart Visitor Management

Residents can manage expected visitors through an approval-based workflow.

**Visitor workflow:**

```text
Create Visitor
      ↓
Pending
      ↓
Resident Approval
      ↓
Approved
      ↓
Generate QR Pass
      ↓
Security Verification
      ↓
Visitor Entered
      ↓
Visitor Exited
```

Features include:

- Visitor registration
- Resident approval and rejection
- Visitor status tracking
- QR visitor pass generation
- Security entry verification
- Security exit verification
- Entry and exit timestamps

---

### Complaint Management

Residents can create and track complaints related to their flats.

Features include:

- Complaint creation
- Complaint title and description
- Priority levels
- Complaint status tracking
- Complaint history
- Staff assignment support

Supported priorities:

```text
Low
Medium
High
Critical
```

Supported statuses:

```text
Open
Assigned
In Progress
Resolved
Closed
```

---

### Maintenance Billing

Administrators can create maintenance bills for flats.

Residents can:

- View their maintenance bills
- Check payment status
- View billing month
- View due dates
- Track payment timestamps
- View paid and pending bills

The current implementation manages payment status within the application. Online payment gateway integration is planned as a future enhancement.

---

### Amenity Booking

Residents can book society amenities such as:

- Gym
- Clubhouse
- Community Hall
- Swimming Pool

The booking system includes time-slot conflict detection.

A booking is rejected when another confirmed booking overlaps with the requested time range for the same amenity.

The overlap condition is:

```text
Existing.StartTime < Requested.EndTime
AND
Existing.EndTime > Requested.StartTime
```

This prevents overlapping confirmed bookings for the same amenity.

Residents can also view and cancel their existing bookings.

---

### Admin Dashboard

The administrator dashboard provides a centralized view of society operations.

It includes:

- Resident statistics
- Maintenance information
- Complaint overview
- Amenity booking activity
- Society activity
- Quick administrative actions

---

## Application Screenshots

### Login

![SocietyHub Login](screenshots/login.png)

### Resident Dashboard

![Resident Dashboard Overview](screenshots/resident-dashboard-1.png)

![Resident Dashboard Activity](screenshots/resident-dashboard-2.png)

### Visitor Management

![Visitor Management](screenshots/visitors-1.png)

![Visitor QR Pass](screenshots/visitors-2.png)

### Complaint Management

![Complaint Management](screenshots/complaints.png)

### Maintenance Billing

![Maintenance Billing](screenshots/maintenance.png)

### Amenity Booking

![Amenity Booking](screenshots/amenities-1.png)

![My Amenity Bookings](screenshots/amenities-2.png)

### Admin Dashboard

![Admin Dashboard Overview](screenshots/admin-dashboard-1.png)

![Admin Dashboard Activity](screenshots/admin-dashboard-2.png)

### Resident Management

![Admin Resident Management](screenshots/admin-residents.png)

### API Documentation

![SocietyHub Swagger API](screenshots/swagger-api.png)

---

## Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- React Router
- Axios
- CSS
- qrcode.react

### Backend

- ASP.NET Core Web API
- .NET 10
- C#
- Entity Framework Core
- JWT Authentication
- BCrypt password hashing
- Swagger / OpenAPI

### Database

- PostgreSQL
- Npgsql
- Entity Framework Core Migrations

### Development & Tools

- Git
- GitHub
- Docker
- Docker Compose
- Visual Studio Code

---

## Architecture

SocietyHub follows a layered backend architecture:

```text
                    React Frontend
                         │
                         │ HTTP / REST
                         ▼
                ASP.NET Core Web API
                         │
              ┌──────────┴──────────┐
              │                     │
       Application Layer       Authentication
              │                     │
              ▼                     ▼
       Infrastructure         JWT / BCrypt
              │
              ▼
        Entity Framework Core
              │
              ▼
          PostgreSQL
```

The architecture separates domain models, application contracts, infrastructure services, and API controllers to keep responsibilities organized and maintainable.

---

## Backend Project Structure

```text
backend/
├── SocietyHub.API
│   ├── Controllers
│   └── Program.cs
│
├── SocietyHub.Application
│   ├── DTOs
│   └── Interfaces
│
├── SocietyHub.Domain
│   ├── Entities
│   └── Enums
│
└── SocietyHub.Infrastructure
    ├── Data
    └── Services
```

### Layer Responsibilities

**SocietyHub.API**

- HTTP controllers
- Authentication configuration
- Authorization
- Dependency injection
- API configuration

**SocietyHub.Application**

- DTOs
- Service interfaces
- Application contracts

**SocietyHub.Domain**

- Core entities
- Enums
- Domain relationships

**SocietyHub.Infrastructure**

- Entity Framework Core
- PostgreSQL database access
- Service implementations
- Password hashing
- JWT token generation

---

## Frontend Structure

```text
frontend/
├── src/
│   ├── assets/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
└── package.json
```

The frontend uses React components and React Router for navigation. Axios is used for communication with the backend API, while an Axios interceptor automatically attaches the JWT bearer token to authenticated requests.

---

## Authentication & Authorization

SocietyHub uses JWT-based authentication and role-based authorization.

### Authentication Flow

```text
User Login
    ↓
Validate Credentials
    ↓
Verify Password Hash
    ↓
Generate JWT
    ↓
Frontend Stores Token
    ↓
Axios Adds Bearer Token
    ↓
Protected API Endpoint
    ↓
Role-Based Authorization
```

Passwords are hashed using BCrypt rather than being stored as plain text.

JWT claims include:

- User ID
- Email
- Role

Protected API endpoints use role-based authorization such as:

```csharp
[Authorize(Roles = "Admin")]
```

and:

```csharp
[Authorize(Roles = "Resident")]
```

---

## Database Design

The main society structure is represented through related entities:

```text
User
 │
 └── FlatResident
          │
          └── Flat
               │
               └── Tower
                    │
                    └── Society
```

Operational entities include:

```text
Visitor
Complaint
MaintenanceBill
Amenity
AmenityBooking
```

Entity Framework Core is used for:

- Database modeling
- Entity relationships
- Queries
- Migrations
- Data persistence

PostgreSQL is used as the relational database.

---

## API

The backend exposes REST APIs for the main application modules:

```text
/api/Auth
/api/Resident
/api/Visitor
/api/Complaint
/api/MaintenanceBill
/api/AmenityBooking
```

Swagger/OpenAPI is integrated into the backend for API documentation and testing.

Swagger is available locally at:

```text
http://localhost:5179/swagger
```

---

## Local Setup

### Prerequisites

Make sure the following are installed:

- .NET 10 SDK
- Node.js
- npm
- Docker
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Aaditya1902/SocietyHub.git
cd SocietyHub
```

---

### 2. Start PostgreSQL

The project includes Docker Compose configuration for PostgreSQL.

```bash
docker compose up -d
```

Verify that the PostgreSQL container is running:

```bash
docker ps
```

The database is configured to run on:

```text
localhost:5432
```

---

### 3. Configure Backend Secrets

The project uses .NET User Secrets for local development so that database credentials and JWT secrets are not committed to Git.

Navigate to the API project:

```bash
cd backend/SocietyHub.API
```

Initialize User Secrets if required:

```bash
dotnet user-secrets init
```

Set the database connection string:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=societyhub;Username=societyhub;Password=YOUR_DATABASE_PASSWORD"
```

Set the JWT signing key:

```bash
dotnet user-secrets set "Jwt:Key" "YOUR_DEVELOPMENT_JWT_SECRET"
```

Verify the configured secrets:

```bash
dotnet user-secrets list
```

Do not commit real passwords or JWT secrets to the repository.

---

### 4. Run Database Migrations

From the `backend` directory:

```bash
dotnet ef database update --project SocietyHub.Infrastructure --startup-project SocietyHub.API
```

This creates or updates the PostgreSQL database using Entity Framework Core migrations.

---

### 5. Run the Backend

Navigate to:

```bash
cd backend/SocietyHub.API
```

Run the API:

```bash
dotnet run
```

The API will be available locally at:

```text
http://localhost:5179
```

Swagger:

```text
http://localhost:5179/swagger
```

---

### 6. Run the Frontend

Open another terminal from the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Example Visitor Workflow

A typical visitor request follows this sequence:

```text
Resident creates visitor request
             ↓
Visitor remains Pending
             ↓
Resident approves visitor
             ↓
Visitor becomes Approved
             ↓
Resident generates QR pass
             ↓
Security verifies QR
             ↓
Visitor entry recorded
             ↓
Visitor exit recorded
```

This workflow demonstrates role-based interaction and state transitions between residents and security personnel.

---

## Technical Highlights

Key engineering concepts implemented in SocietyHub include:

- Layered backend architecture
- RESTful API design
- JWT authentication
- Role-based authorization
- BCrypt password hashing
- Entity Framework Core
- PostgreSQL relational database
- EF Core migrations
- DTO-based API contracts
- Dependency injection
- Visitor state management
- QR-based visitor verification
- Amenity booking conflict detection
- Dockerized PostgreSQL
- React component-based frontend
- Axios API integration
- Protected frontend routes

---

## Future Enhancements

Planned improvements include:

- Real-time notifications using SignalR
- Redis caching
- Online maintenance payment integration
- File and image uploads for complaints
- Vehicle management
- Society notices and announcements
- Advanced analytics
- Automated testing
- CI/CD pipeline
- Cloud deployment

---

## Project Structure

```text
SocietyHub/
│
├── backend/
│   ├── SocietyHub.API/
│   ├── SocietyHub.Application/
│   ├── SocietyHub.Domain/
│   └── SocietyHub.Infrastructure/
│
├── frontend/
│   └── src/
│
├── screenshots/
│   ├── login.png
│   ├── resident-dashboard-1.png
│   ├── resident-dashboard-2.png
│   ├── visitors-1.png
│   ├── visitors-2.png
│   ├── complaints.png
│   ├── maintenance.png
│   ├── amenities-1.png
│   ├── amenities-2.png
│   ├── admin-dashboard-1.png
│   ├── admin-dashboard-2.png
│   ├── admin-residents.png
│   └── swagger-api.png
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Author

**Aaditya Singh Rawat**

GitHub: https://github.com/Aaditya1902/SocietyHub

---

## License

This project is developed as a portfolio and learning project.