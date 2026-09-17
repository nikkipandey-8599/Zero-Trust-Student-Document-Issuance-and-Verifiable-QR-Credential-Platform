# VerifyID — Frontend

React frontend for the **Zero-Trust Student Document Issuance and Verifiable QR Credential Platform** (BIT-09 Capstone Project).

---

## What it does

- Students log in and request official college documents (bonafide, transcript, migration cert, etc.)
- Staff approve or reject requests through a dashboard
- Approved requests trigger the backend to generate a digitally signed PDF with an embedded QR code
- Anyone can scan the QR to verify the document on a public verification page

---

## Tech stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework and dev server |
| Tailwind CSS | Styling — all inline, no separate CSS files |
| React Router v6 | Client-side routing |
| React Query v3 | Server state, caching, data fetching |
| Axios | HTTP client for backend API calls |
| Supabase JS | Authentication (login, session, JWT) |
| Lucide React | Icons |

---

## Project structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── DocumentCard.jsx      # Catalog card for each doc type
│   │   ├── Navbar.jsx            # Top bar for dashboard pages
│   │   ├── PDFViewer.jsx         # Embeds signed PDF with download fallback
│   │   ├── ProtectedRoute.jsx    # Role-based route guard
│   │   ├── RequestTable.jsx      # Reusable request list table
│   │   ├── Sidebar.jsx           # Left nav for student portal
│   │   └── StatusBadge.jsx       # Coloured status pill (pending/approved/etc.)
│   ├── context/
│   │   └── AuthContext.jsx       # Supabase auth provider + role extraction
│   ├── data/
│   │   └── documentCatalog.js    # All 16 document types with metadata
│   ├── hooks/
│   │   ├── useAuth.js            # Reads from AuthContext
│   │   ├── useDocuments.js       # Fetches student's issued documents
│   │   └── useRequests.js        # Fetches + submits document requests
│   ├── pages/
│   │   ├── AdminPanel.jsx        # Admin stats + audit log view
│   │   ├── Login.jsx             # Dark left / light right login page
│   │   ├── MyDocuments.jsx       # Issued documents with download + share
│   │   ├── RequestDocument.jsx   # 3-step document request flow
│   │   ├── ReviewRequest.jsx     # Staff approve / reject a request
│   │   ├── StaffDashboard.jsx    # Staff view of all requests
│   │   ├── StudentDashboard.jsx  # Student home with stats + quick actions
│   │   ├── TrackRequest.jsx      # Live status timeline for each request
│   │   └── VerifyDocument.jsx    # Public QR verification page (no login)
│   ├── services/
│   │   ├── api.js                # Axios instance with JWT interceptor
│   │   ├── auth.js               # Supabase client
│   │   ├── documents.js          # Document API calls
│   │   └── requests.js           # Request API calls
│   ├── App.jsx                   # Route definitions
│   ├── index.css                 # Tailwind directives + global reset
│   └── main.jsx                  # React entry point + QueryClient setup
├── .env                          # Environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/zero-trust-platform.git
cd zero-trust-platform/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `frontend/` folder:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:8080/api
```

Get these values from your teammate who set up the Supabase project:
- **VITE_SUPABASE_URL** — Supabase project URL
- **VITE_SUPABASE_ANON_KEY** — Supabase anon/public key (Settings → API)

### 4. Run the dev server

```bash
npm run dev
```

App runs at **http://localhost:3000**

---

## Pages and routes

| Route | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/verify/:id` | Verify Document | Public |
| `/dashboard` | Student Dashboard | Student only |
| `/request` | Request Document | Student only |
| `/track` | Track Requests | Student only |
| `/my-documents` | My Documents | Student only |
| `/staff` | Staff Dashboard | Staff + Admin |
| `/staff/review/:id` | Review Request | Staff + Admin |
| `/admin` | Admin Panel | Admin only |

---

## Roles

Roles are stored in Supabase user metadata under the `role` field.

| Role | Set in Supabase metadata as |
|---|---|
| Student | `"role": "student"` |
| Staff | `"role": "staff"` |
| Admin | `"role": "admin"` |

If no role is set, the app defaults to `student`.

---

## Key conventions

- All styling uses **Tailwind CSS inline** — no separate `.css` files per component
- `StrictMode` is **disabled** in `main.jsx` — required for React Query v3 + React 18 compatibility
- Every API call in `api.js` automatically attaches the Supabase JWT via an Axios interceptor
- The `/verify` route requires **no login** — it is fully public for QR scanning

---

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel by connecting your GitHub repo — Vercel auto-detects Vite.

---

## Environment variables on Vercel

Add these in **Vercel → Project → Settings → Environment Variables**:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_BASE_URL    ← your Railway backend URL
```

---

## Team

| Name | Role |
|---|---|
| Nikki | Frontend — React, UI, Supabase Auth |
| Teammate | Backend — Spring Boot, PDF generation, Zero-Trust API |

---

*BIT-09 · BSc Information Technology · KES' Shroff College · University of Mumbai · 2026–27*