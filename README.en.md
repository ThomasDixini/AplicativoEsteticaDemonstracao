🌍 **Languages:** [Português](README.md) | [English](README.en.md)

## 📑 Table of Contents

- [🏗️ Project Architecture](#️-project-architecture)
  - [📱 Mobile App](#-mobile-app)
  - [🔔 Expo Notifications](#-expo-notifications)
  - [⚖️ NGINX – Load Balancer](#️-nginx--load-balancer)
  - [🧩 Backend (Layered Architecture)](#-backend-layered-architecture)
  - [🔐 Authentication – JWT (JSON Web Token)](#-authentication--jwt-json-web-token)
  - [🧠 API Layer (Controllers)](#-api-layer-controllers)
  - [⚙️ Service Layer (Business Rules)](#️-service-layer-business-rules)
  - [🗄️ Data Access Layer](#️-data-access-layer)
  - [🗃️ Database](#️-database)
  - [✅ Architecture Benefits](#-architecture-benefits)
- [🎥 Demonstration](#-demonstration)
  - [Screenshots](#screenshots)
- [⚙️ Prerequisites](#️-prerequisites)
- [🐳 Docker Setup (Recommended)](#-docker-setup-recommended)
- [🛠️ Setup Without Docker](#️-setup-without-docker)
  - [Backend (.NET)](#backend-net)
  - [Mobile (React Native/Expo)](#mobile-react-nativeexpo)
- [🔐 Environment Variables](#-environment-variables)

---

# Estética App

**Full stack** application for managing aesthetic clinics, developed with a **.NET backend** and a **React Native/Expo mobile app**.

The project was built with a strong focus on **clean architecture**, **separation of concerns**, **security**, and **scalability**, using practices and technologies commonly applied in real-world production environments, such as **JWT**, **Docker**, and **NGINX** as a load balancer.

This repository aims to **demonstrate technical skills and architectural decisions**, simulating a scenario close to a real production system.

> ⚠️ This is a demonstrative project inspired by a real system developed for a client. No sensitive data, business rules, or proprietary code were exposed.

## 👨‍💻 What I developed in this project
- Complete backend architecture in .NET
- JWT-based authentication implementation
- Database modeling
- Integration between mobile app and API
- Docker and NGINX configuration as a load balancer
- Integration with Expo Notifications

---

# 🏗️ Project Architecture

This project uses a modern, scalable, and well-defined architecture, focused on separation of responsibilities, security, and performance.

<img width="1536" height="1024" alt="Architecture Diagram" src="https://github.com/user-attachments/assets/dc295a44-54e9-41e6-acf8-6037c7c46de8" />

---

## 📱 Mobile App

Mobile application developed with **Expo / React Native**.

### Responsibilities
- User interface
- API consumption via HTTP/HTTPS
- Storage and transmission of **JWT** tokens in requests
- Receiving push notifications via **Expo Notifications**

---

## 🔔 Expo Notifications

Service responsible for sending push notifications to mobile devices.

### Flow
- The backend sends notifications using the **Expo Push Service**
- The Mobile App receives and displays notifications to the user

---

## ⚖️ NGINX – Load Balancer

**NGINX** acts as the load balancer and entry point of the application.

### Responsibilities
- Receive all requests from the Mobile App
- Distribute requests across backend instances
- Improve performance and availability
- Enable horizontal scalability
- Centralize security configurations (SSL, headers, etc.)

---

## 🧩 Backend (Layered Architecture)

The backend follows a **layered architecture**, ensuring organization, maintainability, and ease of evolution.

---

## 🔐 Authentication – JWT (JSON Web Token)

Authentication is based on **JWT**.

### How it works
- The user logs in
- The backend generates a JWT token
- The Mobile App sends the token with each request
- The backend validates the token before processing the request

---

## 🧠 API Layer (Controllers)

Layer responsible for exposing the application endpoints.

### Responsibilities
- Receive HTTP requests
- Validate input data
- Validate authentication (JWT)
- Forward requests to the Service Layer
- Return responses to the client

> Does not contain complex business rules.

---

## ⚙️ Service Layer (Business Rules)

Core layer of the application where business rules are implemented.

### Responsibilities
- Implement application logic
- Orchestrate operations
- Validate business rules
- Call the Data Access Layer when necessary
- Integrate with external services (e.g., Expo Notifications)

---

## 🗄️ Data Access Layer

Layer responsible for communication with the database.

### Responsibilities
- Execute queries
- Persist and retrieve data
- Isolate the database from the rest of the application
- Facilitate maintenance and database technology changes if needed

---

## 🗃️ Database

The application uses **a single database**, centralizing all system data.

### Characteristics
- Single source of truth
- Accessed exclusively through the Data Access Layer
- Ensures data integrity and consistency

---

## ✅ Architecture Benefits

- High code organization and readability
- Easier maintenance and testing
- Security with JWT
- Scalability with NGINX
- Clear separation of responsibilities
- Ready for future growth

---

## Demonstration
### Screenshots

<img width="387" height="834" alt="Screenshot" src="https://github.com/user-attachments/assets/c0de1cc6-910a-4bb8-bc0e-2e798454ec5a" />
<img width="390" height="835" alt="Screenshot" src="https://github.com/user-attachments/assets/1fe5ab4c-b80a-413b-9c79-2a459cf9965e" />
<img width="388" height="832" alt="Screenshot" src="https://github.com/user-attachments/assets/62e74c71-b167-4a2e-afda-16e175e54601" />
<img width="389" height="837" alt="Screenshot" src="https://github.com/user-attachments/assets/c04e524c-4a7a-438c-85b0-1d2d2f8d9ea5" />
<img width="389" height="836" alt="Screenshot" src="https://github.com/user-attachments/assets/6fc50fc7-a487-4b84-9488-60a782fc3d4e" />
<img width="386" height="841" alt="Screenshot" src="https://github.com/user-attachments/assets/42618e4e-092e-494d-95d8-a078d915f654" />
<img width="387" height="839" alt="Screenshot" src="https://github.com/user-attachments/assets/24227f2e-0b19-414a-bd63-1015b1e60095" />
<img width="389" height="844" alt="Screenshot" src="https://github.com/user-attachments/assets/bfc9d160-de90-4415-bf26-f72d261cdc06" />
<img width="390" height="840" alt="Screenshot" src="https://github.com/user-attachments/assets/cccac681-2cb4-4ead-a926-7846a7f561d1" />
<img width="387" height="838" alt="Screenshot" src="https://github.com/user-attachments/assets/1d32af81-d0ff-46be-b06a-408d3c88e4aa" />

## ⚙️ Prerequisites

- **Docker and Docker Compose** (version 3.8 or higher)
- **.NET 9.0 SDK** (for development without Docker)
- **Entity Framework Core 9.0.2**: For database queries
- **Node.js** (version 18 or higher) and **Expo CLI** (for mobile)
- **SQL Server** (for backend without Docker) or Docker for SQL Server

> To run the project on a physical device, additional configuration beyond Docker is required. The steps are described below.

## 🐳 Setup with Docker

2. Rename the .env.example file to .env. (Add your local IP if you intend to test on a physical mobile device).
3. (Optional) Edit the .env file if you need to customize passwords or URLs.
4. Run the containers:
    ```
    docker compose up --build
    ```
    The backend will be available at: http://localhostThe mobile app (Web version) will be available at: http://localhost:8081
5. Scaling: To scale multiple backend instances using the NGINX Load Balancer:
    ```
    docker compose up --build --scale backend=3
    ```

## 🛠️ Configuration without Docker
### Backend (.NET)

1. Install .NET 9.0 SDK.Configure a SQL Server database.
2. Rename backend/EsteticaAPI/appsettings.Development.example to appsettings.Development.json and update the password with the DB_PASSWORD value.
3. Run migrations:
    ```
    cd backend
    dotnet ef database update --startup-project EsteticaAPI --project EsteticaRepositorio
    ```
4. Run the project:
    ```
    dotnet watch run
    ```
5. Backend URL: http://localhost:5056

### Mobile (React Native/Expo)

1. Install Node.js and Expo CLI: npm install -g @expo/cli.Install dependencies:
    ```
    cd mobile
    npm install
    ```
2. Create a mobile/.env file and copy the EXPO_PUBLIC_* variables.
    Note: If using a physical device with Docker backend, use port 80. If backend is running locally (without Docker), use port 5056.Start the app:
    ```
    npm run start
    ```
### 🔐 Environment Variables (.env)
    
 - **DB_PASSWORD**: SQL Server password Used in Docker and appsettings.json
 - **EXPO_PUBLIC_API_APP_URL**: API URL for Mobile, Use your Local IP (Port 80 for Docker / 5056 local)
 - **EXPO_PUBLIC_API_WEB_URL**: API URL for Web, Use localhost (Port 80 for Docker / 5056 local)
 - **EXPO_PUBLIC_WHATSAPP**: WhatsApp link Social media integration
 - **EXPO_PUBLIC_FACEBOOK_URL**: Facebook link Social media integration
 - **EXPO_PUBLIC_INSTAGRAM_URL**: Instagram link Social media integration
