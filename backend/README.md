# Zero Trust Student Document Platform - Backend

Spring Boot backend for Zero-Trust Student Document Issuance and Verifiable QR Credential Platform.

## Tech Stack

- Java 21
- Spring Boot 3.5.5
- Spring Security (JWT Authentication)
- PostgreSQL / Supabase
- Hibernate / JPA
- ZXing (QR Code Generation)
- iText 7 (PDF Generation)
- Lombok
- Swagger/OpenAPI

## Features

- JWT-based authentication with role-based access control
- Student document management (Bonafide, Marksheet, Degree, Internship, Transfer certificates)
- Digital signature-based credential verification (RSA 2048-bit)
- QR code generation for document verification
- PDF certificate generation with embedded QR codes
- Request workflow (student requests → admin approval → auto document issuance)
- Audit logging for all operations
- Public verification endpoint for credential validation

## Prerequisites

- Java 21 or higher
- Maven 3.9+
- PostgreSQL 16+ (or Supabase)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Zero-Trust-Student-Document-Issuance-and-Verifiable-QR-Credential-Platform/backend
```

### 2. Configure Database

Create a `.env` file in the backend directory:

```env
DB_URL=jdbc:postgresql://localhost:5432/zero_trust_platform
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Create Database

Using PostgreSQL:

```sql
CREATE DATABASE zero_trust_platform;
```

Or use Supabase and get your connection string.

### 4. Build and Run

```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Documentation

Once the application is running, access Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Students
- `GET /api/students/me` - Get current student profile
- `POST /api/students` - Create student (Admin only)
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/{id}` - Get student by ID
- `GET /api/students/student-id/{studentId}` - Get student by student ID
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/{id}` - Get document by ID
- `POST /api/documents` - Create document
- `GET /api/documents/student/{studentId}` - Get documents by student
- `PUT /api/documents/{id}/revoke` - Revoke document

### Credentials
- `POST /api/credentials/document/{documentId}` - Create credential
- `GET /api/credentials` - Get all credentials
- `GET /api/credentials/{id}` - Get credential by ID
- `GET /api/credentials/verify/{credentialId}` - Get credential by credential ID
- `GET /api/credentials/{credentialId}/qr` - Download QR code (PNG)
- `GET /api/credentials/{credentialId}/pdf` - Download certificate PDF
- `PUT /api/credentials/{id}/revoke` - Revoke credential

### Requests
- `POST /api/requests` - Create document request
- `GET /api/requests` - Get all requests
- `GET /api/requests/{id}` - Get request by ID
- `GET /api/requests/student/{studentId}` - Get requests by student
- `PUT /api/requests/{id}/approve` - Approve request
- `PUT /api/requests/{id}/reject` - Reject request

### Verification (Public)
- `GET /api/verify/{credentialId}` - Verify credential

### Admin
- `GET /api/admin/requests` - Get all requests
- `GET /api/admin/requests/{id}` - Get request by ID

## Running with Docker

### Using Docker Compose (Recommended)

From the project root:

```bash
docker-compose up
```

This will start:
- PostgreSQL database
- Backend API on port 8080
- Frontend on port 5173

### Using Docker (Backend Only)

```bash
# Build the Docker image
docker build -t zero-trust-backend .

# Run the container
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/zero_trust_platform \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=your_password \
  zero-trust-backend
```

## Testing

Run tests:

```bash
mvn test
```

## Project Structure

```
backend/
├── src/
│   └── main/
│       ├── java/com/ztplatform/
│       │   ├── config/          # Configuration classes
│       │   ├── controller/      # REST controllers
│       │   ├── dto/             # Data transfer objects
│       │   ├── exception/       # Exception handlers
│       │   ├── model/           # JPA entities
│       │   ├── repository/      # JPA repositories
│       │   ├── security/        # Security configuration
│       │   └── service/         # Business logic
│       └── resources/
│           ├── application.yml  # Application configuration
│           └── application-dev.yml
├── Dockerfile
├── pom.xml
└── README.md
```

## Security Notes

- Change the JWT_SECRET in production
- Use strong database passwords
- Enable HTTPS in production
- Configure CORS properly for your frontend domain
- Consider implementing rate limiting
- Use environment variables for sensitive data

## License

MIT License