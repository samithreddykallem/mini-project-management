# Project Management System

A full-stack project tracking application built with **Spring Boot** and **React (Vite)**, powered by a cloud **MySQL** database.

## Features
- **Project Tracking**: Add name, description, start date, and deadline.
- **Dynamic Statuses**: Track projects by *Not Started*, *In Progress*, or *Completed*.
- **Quick Status Updates**: Change project status directly from card view or modal.
- **Interactive Filtering & Search**: Filter projects by status with live count badges and search by title/description.
- **Due Date Alerts**: Real-time status tags for overdue projects, projects due today, and countdowns.
- **Responsive UI**: Polished modern design with confirmation modals and notifications.

---

## Architecture
- **Frontend**: React 18, Vite, Axios, Pure CSS with responsive layout
- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Hibernate
- **Database**: Cloud MySQL (Aiven)

---

## Deployment Architecture

### 1. Backend on Render (Free Web Service)
- **Repository**: Connect your GitHub repo
- **Root Directory**: `backend`
- **Environment**: Java (or Docker)
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- **Environment Variables**:
  - `PORT`: `8080` (or leave default assigned by Render)

### 2. Frontend on Vercel (Free Static Hosting)
- **Repository**: Connect your GitHub repo
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://<your-render-backend-url>/api/projects`
