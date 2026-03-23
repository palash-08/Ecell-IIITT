# Production Setup & Deployment Guide 🚀

This guide provides the technical specifications and steps required to deploy the **E-Cell IIIT Trichy** platform to a production environment.

---

## 🛠️ Technical Stack & Versions

### Frontend
- **Framework**: Next.js `15.3.5` (App Router)
- **Library**: React `19.0.0`

### Backend
- **Runtime**: Node.js `v18.x` or higher (Recommended: `v20.x`)
- **Framework**: Express.js `^5.2.1`
- **Database**: MongoDB (Mongoose `^9.3.1`)

---

## ⚙️ Environment Configuration

### 1. Frontend (`.env.local`)
Create this file in the root directory.

```env
# URL for the Backend API
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 2. Backend (`.env`)
Create this file in the `backend/` directory.

```env
# Server Configuration
NODE_ENV=production
PORT=5001
LOG_RETENTION_DAYS=30d

# MongoDB Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecell_db

# Security
# Generate a strong 64-character secret
JWT_SECRET=your_super_secret_64_char_key_here
JWT_EXPIRES_IN=30d

# Email (SMTP) Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME="E-Cell IIIT Trichy"
```

---

## 🚀 Deployment Steps

### Step 1: Backend Deployment
1. Navigate to `/backend`.
2. Run `npm install --production`.
3. Use a process manager like **PM2** to keep the server running:
   ```bash
   pm2 start server.js --name "ecell-api"
   ```

### Step 2: Frontend Deployment
1. Navigate to the root folder.
2. Run `npm install`.
3. Run `npm run build`.
4. Start the production server:
   ```bash
   pm2 start npm --name "ecell-web" -- start
   ```

### Step 3: Nginx Reverse Proxy (Example)
```nginx
server {
    listen 80;
    server_name ecell.iiitt.ac.in;

    location / {
        proxy_pass http://localhost:3000; # Frontend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5001; # Backend API
        proxy_set_header Host $host;
    }

    location /uploads {
        proxy_pass http://localhost:5001/uploads; # Local storage proxy
        client_max_body_size 30M;
    }
}
```

---

## 📁 Directory Permissions
Ensure the backend has write access to the uploads folder:
```bash
chmod -R 755 backend/uploads
```

---

## 🔒 Security Checklist
- [ ] Use HTTPS/SSL (Certbot/Let's Encrypt).
- [ ] Set `NODE_ENV` to `production`.
- [ ] Ensure `JWT_SECRET` is unique and rotated.
- [ ] Limit `client_max_body_size` in Nginx to match app limits (30MB).
