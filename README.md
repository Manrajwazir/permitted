# Permitted

> Verified Rules & Decisions for International Students in Canada

A full-stack web application providing clear, verified, consequence-aware answers to high-risk questions international students face in Canada.

🔗 **Live Demo:** [http://16.52.175.199](http://16.52.175.199)

---

## 🎯 Project Purpose

This project was built as a **learning exercise** to gain hands-on experience with:

- **Linux server administration** (Ubuntu, SSH, file permissions)
- **AWS EC2 deployment** (instance setup, security groups, Nginx configuration)
- **Full-stack development workflow** (from local development to production)
- **Database management** (PostgreSQL, Prisma ORM, seeding)
- **Production security practices** (Helmet, CORS, rate limiting)

---

## ✨ Features

- **35+ Verified Questions** across Work Rules, Travel, Tax, Healthcare, Immigration, and more
- **Context-Aware Filtering** — Filter by stage (Pre-Arrival, Studying, Graduating), province, and program type
- **Consequence Warnings** — Each answer includes what happens if you break the rules
- **Official Sources** — Every answer links to IRCC, CRA, or government sources
- **Mobile-First Design** — Responsive UI with modern aesthetic
- **Production-Ready Security** — Rate limiting, CORS, security headers

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, React Router |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL 15, Prisma ORM |
| **Security** | Helmet, express-rate-limit, CORS |
| **Deployment** | AWS EC2, Nginx, PM2, Ubuntu 22.04 |

---

## 📁 Project Structure

```
permitted/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   └── services/       # API client
│   └── dist/               # Production build
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Error handling, etc.
│   │   ├── config/         # Environment validation
│   │   └── lib/            # Prisma client
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # 35 verified questions
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL 15+
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/Manrajwazir/permitted.git
cd permitted

# Install dependencies
npm install

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your database credentials

# Initialize database
cd server
npx prisma db push
npm run db:seed

# Start development servers
cd ..
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 🔒 Security Features

| Feature | Purpose |
|---------|---------|
| **Helmet** | Sets secure HTTP headers (XSS, clickjacking protection) |
| **CORS** | Restricts API access to allowed origins |
| **Rate Limiting** | 100 requests per 15 minutes per IP |
| **Input Validation** | Query parameters validated before processing |
| **Environment Validation** | App fails fast if required env vars are missing |

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/contexts` | Get filter options (stages, provinces, programs) |
| `GET` | `/api/questions` | List questions (supports filtering) |
| `GET` | `/api/questions/:slug` | Get question details with answer and sources |

---

## 🌐 Deployment

This app is deployed on **AWS EC2** with:

- **Ubuntu 22.04 LTS** as the operating system
- **Nginx** as reverse proxy (serves React build, proxies API)
- **PM2** for process management (keeps Node.js running)
- **PostgreSQL** for the database

### Deploy Updates

```bash
# SSH into server
ssh -i your-key.pem ubuntu@your-ec2-ip

# Pull latest changes
cd ~/permitted
git pull

# If frontend changed
cd client && npm run build

# If backend changed
cd ../server && npm run db:seed
pm2 restart permitted-api
```

---

## 📄 License

MIT

---

## 👤 Author

**Manraj Wazir**

Built as a learning project to understand full-stack development, Linux administration, and AWS deployment.
