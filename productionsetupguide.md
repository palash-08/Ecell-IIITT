# Production Setup Guide

This guide provides step-by-step instructions for deploying the E-Cell IIIT Trichy website to a production environment.

## Prerequisites

- **Node.js**: v18.x or higher
- **NPM**: v9.x or higher
- **MongoDB**: A running instance (local or Atlas)
- **Nginx**: For reverse proxy and SSL
- **PM2**: For process management

---

## 1. Backend Setup

### Environment Configuration
Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Port
PORT=5001

# MongoDB Connection
MONGO_URI=mongodb+srv://<db_user>:<db_password>@<db_cluster>/<db_name>

# Security
JWT_SECRET=<strong_random_secret_at_least_32_chars>
JWT_EXPIRES_IN=30d
```

### Installation and Deployment
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server with PM2:
   ```bash
   pm2 start server.js --name "ecell-backend"
   ```

---

## 2. Frontend Setup

### Environment Configuration
Create a `.env.local` file in the root directory:

```env
# API URL (The URL where your backend is accessible)
NEXT_PUBLIC_API_URL=https://<api_domain>/api
```

### Build and Deployment
1. Navigate to the root directory.
2. Install dependencies: `npm install`
3. Build the Next.js application: `npm run build`
4. Start the frontend with PM2:
   ```bash
   pm2 start npm --name "ecell-frontend" -- start
   ```

---

## 3. Nginx Configuration

Configure Nginx to serve the frontend and proxy API/Upload requests to the backend.

```nginx
server {
    listen 80;
    server_name <your_domain>;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static Uploads
    location /uploads {
        proxy_pass http://localhost:5001/uploads;
        proxy_set_header Host $host;
        client_max_body_size 50M;
    }
}
```

---

## 4. Directory Permissions

Ensure the backend has write permissions for the uploads directory.

```bash
# From the backend directory
mkdir -p uploads/events uploads/team uploads/faculty uploads/gallery
chmod -R 755 uploads
```

---

## 5. Security Recommendations

- **SSL**: Use Certbot (Let's Encrypt) to enable HTTPS on Nginx.
- **Firewall**: Ensure only ports 80, 443, and 22 (SSH) are open to the public.
- **Database**: Ensure MongoDB is not accessible from the public internet (use IP whitelisting).
- **Environment Variables**: Never commit `.env` or `.env.local` files to version control.
