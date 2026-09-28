# VerifyID Local Deployment

## Direct development mode

### PostgreSQL

Create the database `verifyid_db` in PostgreSQL and ensure the configured PostgreSQL server is running.

### Backend

Set environment variables:

- DB_URL
- DB_USERNAME
- DB_PASSWORD
- JWT_SECRET
- JWT_EXPIRATION

Then:

```
cd backend
mvnw.cmd spring-boot:run
```

Backend port: 8080.

### Frontend

```
cd frontend
npm install
npm run dev
```

Frontend port: 5173.

## Container configuration

The repository also contains:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `docker-compose.yml`

Docker configuration is provided for reproducible deployment. The local development machine used during the prototype work did not have Docker installed, so container execution should be validated on a machine with Docker before being presented as locally executed evidence.
