# 🚀 Project ALMA — Production Deployment Guide

This guide provides comprehensive, step-by-step instructions for deploying **Project ALMA** to production across various cloud platforms and container architectures.

---

## 🏗️ Architecture Overview

Project ALMA consists of four primary components:
1. **Frontend**: React 19 Single Page Application (Vite, React Router v7, Recharts, Socket.IO client).
2. **Backend API**: Node.js & Express 4 server providing REST APIs and WebSocket communication via Socket.IO.
3. **Machine Learning Engine**: Python 3 runtime running Scikit-Learn and XGBoost models for campus placement prediction and resume skill gap extraction.
4. **Database**: MongoDB (v6 or v7), self-hosted or cloud-managed via MongoDB Atlas.

---

## 📋 Environment Variables Reference

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `PORT` | No | `5000` | Port for the backend Express server to listen on. |
| `NODE_ENV` | **Yes** | `production` | Set to `production` in production environments. |
| `MONGODB_URI` | **Yes** | `mongodb://127.0.0.1:27017/alumniconnect` | MongoDB connection string (local or MongoDB Atlas SRV). |
| `JWT_SECRET` | **Yes** | — | Cryptographically random string (32+ chars) used to sign JWTs. |
| `CLIENT_URL` | **Yes** | `http://localhost:5173` | Public URL of the frontend (used in password reset emails & CORS). |
| `ALLOWED_ORIGIN` | No | `${CLIENT_URL}` | Comma-separated list of allowed origins for CORS & WebSockets. |
| `VITE_API_URL` | Decoupled only | `""` (relative `/api`) | Base backend URL when frontend is hosted separately (e.g. Vercel). |
| `VITE_SOCKET_URL`| Decoupled only | `""` (relative `/`) | WebSocket endpoint when frontend is hosted separately. |
| `PYTHON_BIN` | No | `python3` (or `python`) | Path or command name for the Python 3 binary. |
| `ML_DIR` | No | auto-detected | Path to the `ml/` directory containing models and scripts. |
| `GMAIL_USER` | No | — | Gmail address used for sending password reset OTPs. |
| `GMAIL_APP_PASSWORD` | No | — | 16-character Google App Password for SMTP authentication. |
| `EMAIL_FROM_NAME` | No | `"AlmaConnect Portal"` | Display name shown as email sender. |

---

## 🐳 Option 1: Multi-Container Deployment with Docker Compose (Recommended for VPS / On-Premise)

This architecture runs three orchestrated containers:
- **`projectalma-mongodb`**: Official MongoDB 7 database with healthcheck and persistent volume.
- **`projectalma-backend`**: Node.js 20 + Python 3 ML runtime with persistent upload storage.
- **`projectalma-frontend`**: Nginx Alpine serving the optimized React SPA with gzip and reverse proxying `/api/`, `/socket.io/`, and `/uploads/` to the backend.

### 1. Prerequisites
- Docker Engine (v24+) and Docker Compose (v2+)

### 2. Configure Environment
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Edit `.env` and set secure secrets:
```env
JWT_SECRET=generate_a_secure_random_string_here_32_chars_or_more
CLIENT_URL=http://your-server-ip:5173
ALLOWED_ORIGIN=http://your-server-ip:5173
```

### 3. Build & Launch
```bash
# Build and run containers in detached mode
docker compose up -d --build

# View container status
docker compose ps

# View real-time logs
docker compose logs -f backend
```

### 4. Seed Initial Data (Optional)
To populate demo college data, members, and jobs:
```bash
docker compose exec backend node seed.js
```

### 5. Access the Platform
- **Frontend & App**: `http://<your-server-ip>:5173`
- **Backend Health Check**: `http://<your-server-ip>:5000/health`

---

## ☁️ Option 2: Single-Service Cloud PaaS (Render, Railway, Fly.io)

For platforms where you want to deploy the complete application as a single service using `Dockerfile.fullstack`.

### Render
1. Create a **New Web Service** and connect your Git repository.
2. Select **Dockerfile** as the Environment.
3. In Advanced Settings, set **Dockerfile Path** to `Dockerfile.fullstack`.
4. Add the following Environment Variables in the Render dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/alumniconnect`
   - `JWT_SECRET` = `<your-random-secret>`
   - `CLIENT_URL` = `https://your-service-name.onrender.com`
   - `ALLOWED_ORIGIN` = `https://your-service-name.onrender.com`
5. Click **Create Web Service**.

### Railway
1. Click **New Project** → **Deploy from GitHub repo**.
2. Go to **Settings** → **Build** → set Dockerfile path to `Dockerfile.fullstack`.
3. Add a **MongoDB** plugin or attach your MongoDB Atlas connection string to `MONGODB_URI`.
4. Set required variables (`JWT_SECRET`, `NODE_ENV=production`). Railway automatically provides `PORT`.
5. Deploy.

---

## ⚡ Option 3: Decoupled Cloud (Frontend on Vercel + Backend on Render/Railway + Atlas)

For maximum scalability, host the static frontend on a CDN like Vercel or Netlify and run the backend on a container service.

### Step 1: Deploy MongoDB Atlas
1. Create a free/shared cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user and allow network access (`0.0.0.0/0` with strong password).
3. Copy your SRV connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/alumniconnect`.

### Step 2: Deploy Backend (Render / Railway / Fly.io)
1. Point build to `server/Dockerfile` with root repository context.
2. Configure environment variables:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secure_secret
   CLIENT_URL=https://your-projectalma.vercel.app
   ALLOWED_ORIGIN=https://your-projectalma.vercel.app
   ```
3. Copy the deployed backend URL (e.g. `https://projectalma-api.onrender.com`).

### Step 3: Deploy Frontend (Vercel / Netlify / Cloudflare Pages)
1. Import repository on Vercel.
2. Set Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = `https://projectalma-api.onrender.com`
   - `VITE_SOCKET_URL` = `https://projectalma-api.onrender.com`
6. Deploy.

---

## 🔒 Option 4: Linux VPS (Ubuntu / Debian) with Nginx & Let's Encrypt SSL

### 1. Install Docker & Nginx
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 certbot python3-certbot-nginx nginx
```

### 2. Configure Nginx Reverse Proxy
Create `/etc/nginx/sites-available/alumni.yourdomain.com`:
```nginx
server {
    server_name alumni.yourdomain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5173; # Nginx container or local frontend port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/alumni.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Issue Free SSL Certificate
```bash
sudo certbot --nginx -d alumni.yourdomain.com
```

---

## 🖼️ Media Files Management (Images, Videos & PDFs)

Project ALMA handles three categories of user uploads:
- **Images**: User avatars, blog featured photos, event banners, and document attachments (PNG, JPG, WEBP, GIF, SVG).
- **Videos**: Alumni recorded talks, webinars, and media blogs (MP4, WEBM, MOV).
- **PDFs**: Student resumes, placement brochures, official college circulars, and job role descriptions.

### 1. How Uploads Work
- Uploads are processed by `multer` via `POST /api/upload` with a limit of **100MB**.
- Files are saved to `server/uploads/` with unique cryptographically random suffixes (`media-<timestamp>-<hash>.<ext>`).
- Static files are served by Express at `/uploads/<filename>` with long-lived HTTP caching and streamable video playback (`preload="metadata"`).
- In decoupled deployments (Frontend on Vercel, Backend on Render), the frontend automatically resolves all media URLs to the backend domain via `getFileUrl()`.

### 2. File Persistence in Docker Compose (VPS / Self-Hosted)
In `docker-compose.yml`, a persistent Docker volume is automatically mounted:
```yaml
volumes:
  - backend_uploads:/app/server/uploads
```
All uploaded images, videos, and PDFs **persist across container updates, restarts, and image rebuilds**.

### 3. File Persistence in Cloud Hosting (Render / Railway / Heroku)
> [!NOTE]
> On free tiers of cloud platforms like Render or Railway, the local filesystem is **ephemeral** (files in `uploads/` will be wiped if the server goes to sleep or redeploys).

To keep files permanently in cloud deployments:
- **Option A: Attach a Persistent Disk (Easiest)**
  - In Render Web Service settings → **Disks** → Add a Disk: Mount path `/app/server/uploads`, size 1GB - 10GB.
- **Option B: Free Cloud Object Storage (Recommended for High Scale)**
  - Use a free **Cloudinary** account (25GB free image & video storage + CDN) or **Cloudflare R2** / **AWS S3** / **Supabase Storage**.
- **Option C: Automatic Base64 Fallback**
  - Project ALMA includes built-in fallback to Base64 Data URLs if static disk storage is temporarily unavailable.

---

## 🩺 Production Health & Monitoring

Project ALMA includes a built-in health monitoring endpoint:
```http
GET /health
```
Response:
```json
{
  "status": "OK",
  "database": "Connected",
  "realtime": "Active"
}
```

This endpoint is integrated into Docker container healthchecks and can be queried by external uptime monitors (e.g., UptimeRobot, BetterUptime, AWS Route 53).

---

## 🛡️ Security Best Practices Checklist

- [ ] Ensure `.env` is **never** committed to Git.
- [ ] Set `NODE_ENV=production` on all production instances.
- [ ] Generate a high-entropy `JWT_SECRET` using `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`.
- [ ] Configure `ALLOWED_ORIGIN` / `CLIENT_URL` to only permit your production domain.
- [ ] Ensure database access is restricted by IP whitelist or VPC peering.
- [ ] Set up daily automated backups for MongoDB.
- [ ] Use HTTPS / SSL for all public web and WebSocket traffic.
