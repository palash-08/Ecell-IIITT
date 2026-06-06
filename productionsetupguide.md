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

### 1. Frontend Environment Variables (`.env.production`)
Create this file in the root directory for production builds.

```env
# URL for the Backend API
NEXT_PUBLIC_API_URL=https://ecell.backend.iiitt.ac.in/api

# (Optional) URL for uploaded files/media
# If your images are stored on a different domain or CDN
# Default: If empty, images resolve to NEXT_PUBLIC_API_URL path
NEXT_PUBLIC_UPLOAD_URL=http://store.iiitt.ac.in
```

> [!IMPORTANT]
> Since these variables start with `NEXT_PUBLIC_`, they are **"baked in"** to the frontend during the `npm run build` step. If you change these values, you **MUST** run the build again for the changes to take effect on your website.

### 2. Backend Environment Variables (`.env`)
Create this file in the `backend/` directory.

```env
# Server Configuration
NODE_ENV=production
PORT=5001
LOG_RETENTION_DAYS=30d
TRUST_PROXY=false
PROXY_HOPS=1

# CORS Configuration
# Comma-separated list of allowed frontend domains
CORS_ORIGIN=https://ecell.iiitt.ac.in,http://localhost:3000

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

### Step 0: Create Initial Super Admin
Before starting the servers for the first time, you must create an initial administrative account to access the dashboard.

1. Navigate to `/backend`.
2. Run the bootstrap script:
   ```bash
   node createadmin.js
   ```
3. **Default Credentials**:
   - **Email**: `superadmin@gmail.com`
   - **Password**: `admin@123`
4. > [!WARNING]
   > For security, log in immediately and change this password in the **Manage Admins** section of the dashboard.

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
        # Local storage proxy (if still serving through Nginx)
        proxy_pass http://localhost:5001/uploads; 
        client_max_body_size 30M;
    }
}
```

---

## 🖼️ Media Storage Strategies

If you want to host your media (images/videos) on a separate domain like `store.iiitt.ac.in`, choose one of the following strategies:

### Strategy 1: Nginx Alias (Simplest)
Keep files on the Backend server but serve them through the `store` domain.

1. **Backend**: No changes needed. Files remain in `backend/uploads`.
2. **Storage Server**: Point `store.iiitt.ac.in` to your Backend's IP and use this Nginx config:
   ```nginx
   server {
       listen 80;
       server_name store.iiitt.ac.in;

       location / {
           alias /path/to/your/backend/uploads/;
           autoindex off;
           add_header Access-Control-Allow-Origin "https://ecell.iiitt.ac.in";
       }
   }
   ```

### Strategy 2: Cloud Storage (S3/DigitalOcean Spaces)
Best for scalability. Uploads go directly to a cloud provider.

1. **Backend**: Install dependencies: `npm install multer-s3 @aws-sdk/client-s3`.
2. **Backend Code**: Modify `backend/utils/upload.js` to use `multerS3` instead of `multer.diskStorage`.
3. **Backend `.env`**: Add your cloud credentials:
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=ap-south-1
   AWS_BUCKET_NAME=ecell-storage
   ```

### Strategy 3: Shared Network Volume (Advanced)
Best if you have multiple servers but want a single source of truth.

1. **Infrastructure**: Mount the Storage server's disk as a local folder on the Backend server using **NFS** or **CIFS**.
2. **Backend**: Point the `multer` destination to the mounted folder path.
3. **Frontend**: Set `NEXT_PUBLIC_UPLOAD_URL` to the domain pointing to that volume.

---

---

## 📁 Directory Permissions
Ensure the backend has write access to the uploads folder:
```bash
chmod -R 755 backend/uploads
```

---
