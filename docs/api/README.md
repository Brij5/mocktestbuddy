# API Documentation

## Base URL

```
https://api.exambuddy.com/v1
```

## Authentication

All API endpoints (except `/auth/*`) require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

### Common HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

## API Endpoints

### Authentication

#### Register a new user

```http
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

### Users

#### Get current user profile

```http
GET /users/me
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Exams

#### Get all exams

```http
GET /exams
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| sort | string | Sort field (default: createdAt) |
| order | string | Sort order (asc/desc) |

**Response:**

```json
{
  "success": true,
  "data": {
    "exams": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Mathematics Final Exam",
        "description": "Comprehensive mathematics exam",
        "duration": 120,
        "totalQuestions": 30,
        "passingScore": 70
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1,
      "limit": 10
    }
  }
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address for unauthenticated endpoints
- 1000 requests per 15 minutes per user for authenticated endpoints

## Versioning

API versioning is done through the URL path (e.g., `/v1/...`).

## Data Formats

### Dates

All dates are returned in ISO 8601 format (UTC):
```
YYYY-MM-DDTHH:MM:SS.SSSZ
```

### Pagination

Paginated responses include:
- `data`: Array of items
- `pagination`: Pagination metadata

### Filtering

Filtering is supported via query parameters:
```
GET /resources?field=value&otherField[gte]=10
```

### Sorting

Sorting is supported via the `sort` and `order` parameters:
```
GET /resources?sort=createdAt&order=desc
```

## Webhooks

Webhook notifications are sent for important events. The following events are supported:

- `exam.completed` - When a user completes an exam
- `payment.processed` - When a payment is processed
- `account.updated` - When user account details are updated

## SDKs

Official SDKs are available for:

- JavaScript/Node.js
- Python
- Java
- PHP

## Support

For API support, please contact support@exambuddy.com.
