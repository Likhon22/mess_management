# Amar Dera - Backend

**Amar Dera** is a Mess Management System built with Go (Gin) and MongoDB.

## API Documentation

### 1. Authentication (`/api/v1/auth`)

| Method | Endpoint  | Description                       | Auth |
| :----- | :-------- | :-------------------------------- | :--- |
| `POST` | `/signup` | Create a new user account.        | No   |
| `POST` | `/login`  | Login and get JWT token.          | No   |
| `GET`  | `/users/me` | Get current user's profile.    | Yes  |

### 2. Mess Management (`/api/v1/mess`) (Protected)

| Method | Endpoint                   | Description                                      |
| :----- | :------------------------- | :----------------------------------------------- |
| `POST` | `/create`                  | Create a new mess (You become Admin).            |
| `POST` | `/join`                    | Request to join a mess using ID.                 |
| `GET`  | `/:id/requests`            | List pending join requests (Admin/Manager).      |
| `PATCH`| `/:id/requests/approve`    | Approve a member (Admin/Manager).                |
| `PATCH`| `/:id/roles`               | Assign roles (Admin only).                       |

### 3. Service Costs (`/api/v1/house`) (Protected)

| Method | Endpoint                   | Description                                      |
| :----- | :------------------------- | :----------------------------------------------- |
| `GET`  | `/:id/costs`               | Get all fixed costs for a month. `?month=YYYY-MM`|
| `POST` | `/:id/costs`               | Add a new fixed cost (e.g., WiFi, Gas).          |
| `DELETE`| `/:id/costs/:costId`      | Delete a cost.                                   |

### 4. Meals (`/api/v1/meals`) (Protected)

| Method | Endpoint                   | Description                                      |
| :----- | :------------------------- | :----------------------------------------------- |
| `GET`  | `/:id/daily`               | Get daily meal grid. `?month=YYYY-MM`            |
| `POST` | `/:id/update`              | Batch update daily meals (Manager).              |

### 5. Bazar (`/api/v1/bazar`) (Protected)

| Method | Endpoint                   | Description                                      |
| :----- | :------------------------- | :----------------------------------------------- |
| `POST` | `/:id/entry`               | Member submits bazar cost.                       |
| `GET`  | `/:id/pending`             | List pending bazar entries. `?month=YYYY-MM`     |
| `PATCH`| `/:id/approve/:bazarId`    | Approve a bazar entry (Manager).                 |

### 6. Payments (`/api/v1/payments`) (Protected)

| Method | Endpoint                   | Description                                      |
| :----- | :------------------------- | :----------------------------------------------- |
| `POST` | `/:id/submit`              | Member submits cash payment (House/Meal).        |
| `GET`  | `/:id/pending`             | List pending payments. `?month=YYYY-MM`          |
| `PATCH`| `/:id/verify/:payId`       | Verify cash received (Manager).                  |

### 7. Reports & Summary (`/api/v1/summary`) (Protected)

| Method | Endpoint                   | Description                                      |
| :----- | :------------------------- | :----------------------------------------------- |
| `GET`  | `/:id/fixed`               | Get Fixed Cost summary.                          |
| `GET`  | `/:id/meals`               | Get Meal Rate calc summary.                      |
| `GET`  | `/:id/final`               | Get Final Balance sheet.                         |

### 8. History Control (`/api/v1/history`) (Protected)

| Method | Endpoint                   | Description                                      |
| :----- | :------------------------- | :----------------------------------------------- |
| `POST` | `/:id/unlock-request`      | Manager requests to unlock a past month.         |
| `GET`  | `/:id/pending-requests`    | Admin views unlock requests.                     |
| `PATCH`| `/:id/lock-status`         | Admin unlocks a month for a duration.            |

## Setup & Testing

1.  **Configuration**: Check `.env` (or defaults in code).
2.  **Run**: `cd backend && go run cmd/server/main.go`
3.  **Test**: Import `postman.json` (in this folder) into Postman.
