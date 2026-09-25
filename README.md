\# SocietyHub 🏢



A full-stack apartment and society management platform designed to digitize

resident services, visitor management, maintenance billing, complaints,

amenity bookings, and administrative operations.



\## 🚀 Overview



SocietyHub provides a centralized platform for residents and administrators

to manage day-to-day society activities through a role-based web application.



The system follows a layered backend architecture using ASP.NET Core Web API

and a React frontend, with PostgreSQL as the primary database.



\## ✨ Key Features



\### 🔐 Authentication \& Authorization

\- JWT-based authentication

\- Role-based access control

\- Resident and Admin dashboards

\- Protected frontend routes

\- BCrypt password hashing



\### 👥 Resident Management

\- Register residents

\- Assign residents to flats

\- Track resident relationships

\- View resident and flat information

\- Admin resident management dashboard



\### 🚪 Smart Visitor Management

\- Create visitor requests

\- Resident approval/rejection workflow

\- QR-based visitor passes

\- Security entry verification

\- Security exit verification

\- Visitor status tracking



\*\*Visitor workflow:\*\*



```text

Visitor Request

&#x20;     ↓

&#x20;  Pending

&#x20;     ↓

Resident Approval

&#x20;     ↓

&#x20;  Approved

&#x20;     ↓

&#x20;  QR Pass

&#x20;     ↓

Security Verification

&#x20;     ↓

&#x20;   Entered

&#x20;     ↓

&#x20;    Exited

