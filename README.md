Here's a properly structured `README.md` file for your project:

````md
# ManushTech NestJS App

This is a NestJS-based backend application for handling authentication and generating sales reports. The app uses Docker for containerization, Redis for caching, and PostgreSQL as the database.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mabuhanifa/manushtech-nest-app
cd manushtech-nest-app
```
````

### 2. Run with Docker

Make sure Docker and Docker Compose are installed.

```bash
sudo docker compose up --build
```

---

## 🌱 Seeding the Database

To seed the database with test data:

1. Replace the content of `src/main.ts` with the code from `seed.ts`.
2. Run the app again:

```bash
sudo docker compose up --build
```

3. Once seeding is complete, undo the changes to `main.ts` (restore its original content).
4. Rebuild and restart the app:

```bash
sudo docker compose up --build
```

---

## 🔐 Authentication Endpoints

### **Login**

**POST** `/auth/login`

- **Payload**: **from data provided for seeding**
  ```json
  {
    "email": "your@email.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "userId": 1,
    "name": "User Name",
    "email": "your@email.com"
  }
  ```

### **Logout**

**POST** `/auth/logout`

- **Payload**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### **Validate Session**

**POST** `/auth/validate`

- **Payload**:
  ```json
  {
    "token": "jwt_token_here",
    "userId": 1
  }
  ```
- **Response**:
  ```json
  true
  ```

---

## 📊 Report Endpoints

All report routes require a **Bearer Token** in the header:

```
Authorization: Bearer <jwt_token_here>
```

### **Monthly Sales**

**GET** `/reports/monthly-sales`

- **Response**: Array of monthly sales data

### **User Orders**

**GET** `/reports/user-orders`

- **Response**: Array of user orders

### **Product Sales**

**GET** `/reports/product-sales`

- **Response**: Array of product sales data

---

## 🧰 Tech Stack

- **NestJS**
- **PostgreSQL**
- **Redis**
- **Docker**
- **JWT Auth**

---
