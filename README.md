# Table Reservation Lock API

A Node.js/Express API for managing table reservation locks to prevent double-bookings in restaurant management systems.

## 🚀 Features

- **Table Locking**: Temporarily lock tables during the booking process
- **Automatic Expiry**: Locks automatically expire after a specified duration
- **User Authorization**: Only the user who created a lock can unlock it
- **Real-time Status**: Check if a table is currently locked
- **In-memory Storage**: Fast and simple storage using JavaScript Map

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Security**: Helmet.js
- **CORS**: Cross-origin resource sharing enabled
- **Storage**: In-memory JavaScript Map (no external database required)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd table-reservation-lock-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

4. **Verify the server is running**
   ```bash
   curl http://localhost:3000/health
   ```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### 1. Lock a Table
**POST** `/api/tables/lock`

Locks a table for a specified duration to prevent double-bookings.

**Request Body:**
```json
{
  "tableId": "table-123",
  "userId": "user-abc",
  "duration": 600
}
```

**Parameters:**
- `tableId` (string, required): Unique identifier for the table
- `userId` (string, required): Unique identifier for the user
- `duration` (number, required): Lock duration in seconds

**Success Response (200):**
```json
{
  "success": true,
  "message": "Table locked successfully."
}
```

**Conflict Response (409):**
```json
{
  "success": false,
  "message": "Table is currently locked by another user."
}
```

### 2. Unlock a Table
**POST** `/api/tables/unlock`

Unlocks a table (only by the user who created the lock).

**Request Body:**
```json
{
  "tableId": "table-123",
  "userId": "user-abc"
}
```

**Parameters:**
- `tableId` (string, required): Unique identifier for the table
- `userId` (string, required): User who created the lock

**Success Response (200):**
```json
{
  "success": true,
  "message": "Table unlocked successfully"
}
```

**Forbidden Response (403):**
```json
{
  "success": false,
  "message": "You can only unlock tables that you have locked"
}
```

### 3. Check Table Status
**GET** `/api/tables/:tableId/status`

Checks if a table is currently locked.

**Parameters:**
- `tableId` (string, required): Unique identifier for the table

**Response (200):**
```json
{
  "isLocked": true
}
```

or

```json
{
  "isLocked": false
}
```

## 🧪 Testing with Postman

### Postman Collection

You can import the following collection into Postman:

```json
{
  "info": {
    "name": "Table Reservation Lock API",
    "description": "API for managing table reservation locks"
  },
  "item": [
    {
      "name": "Lock Table",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tableId\": \"table-123\",\n  \"userId\": \"user-abc\",\n  \"duration\": 600\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/tables/lock",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "tables", "lock"]
        }
      }
    },
    {
      "name": "Unlock Table",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tableId\": \"table-123\",\n  \"userId\": \"user-abc\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/api/tables/unlock",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "tables", "unlock"]
        }
      }
    },
    {
      "name": "Check Table Status",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/api/tables/table-123/status",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "tables", "table-123", "status"]
        }
      }
    }
  ]
}
```

### Manual Testing Examples

#### 1. Lock a Table
```bash
curl -X POST http://localhost:3000/api/tables/lock \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": "table-123",
    "userId": "user-abc",
    "duration": 600
  }'
```

#### 2. Try to Lock the Same Table (Should Fail)
```bash
curl -X POST http://localhost:3000/api/tables/lock \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": "table-123",
    "userId": "user-def",
    "duration": 300
  }'
```

#### 3. Check Table Status
```bash
curl http://localhost:3000/api/tables/table-123/status
```

#### 4. Unlock Table
```bash
curl -X POST http://localhost:3000/api/tables/unlock \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": "table-123",
    "userId": "user-abc"
  }'
```

## 🔧 Business Logic Features

### Automatic Lock Expiry
- Locks automatically expire after the specified duration
- Expired locks are automatically cleaned up when accessed
- Prevents indefinite table locks

### User Authorization
- Only the user who created a lock can unlock it
- Prevents unauthorized table unlocks
- Returns appropriate error messages for unauthorized attempts

### Edge Case Handling
- Validates all required fields
- Handles missing or invalid parameters
- Provides clear error messages
- Graceful handling of expired locks

## 📁 Project Structure

```
table-reservation-lock-api/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── README.md             # Project documentation
├── routes/
│   └── tableRoutes.js    # API route definitions
└── controllers/
    └── tableController.js # Business logic implementation
```

## 🚀 Deployment

The API can be deployed to any Node.js hosting platform:

- **Heroku**: Add `start` script to package.json
- **Vercel**: Configure for Node.js
- **Railway**: Direct deployment
- **AWS/DigitalOcean**: Standard Node.js deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 