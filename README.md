# Zabe Hostel Management System — Frontend

React + Vite client for **Zabe Hostel Management System**.

**Live app:** deploy from this repo on Vercel (or any static host).  
**API:** `https://hostel-management-system-back-end-1.onrender.com`

---

## Stack

- React 19 + Vite
- React Router
- Axios
- Recharts
- Progressive Web App (installable on Windows, macOS, Android, iPhone)

---

## Features

### Public site
| Page | Path |
|------|------|
| Home | `/` |
| About | `/about` |
| FAQs | `/faqs` |
| Login | `/login` |
| Register | `/register` |

- Top bar: logo, Home / About / FAQs, **Login** + **Register** (right)
- Floating **WhatsApp** button (bottom left) → `0700 532 298`

### Authenticated app
| Area | Path | Roles |
|------|------|--------|
| Dashboard | `/dashboard` | all |
| Book a Room | `/book-room` | student |
| Room Allocation | `/room-allocation` | admin, warden, student |
| Maintenance | `/maintenance` | admin, warden, student |
| Payments | `/payments` | admin, finance |
| Hostel Fees | `/hostel-fees` | admin, finance |
| Fee Tracking | `/fee-tracking` | admin, finance, warden |
| My Fees | `/student-fee-tracking` | student |
| Settings | `/settings` | all |

Settings includes **change password** (current + new + confirm).

Students can book rooms from the dashboard / Book a Room page when capacity is free.

---

## Local setup

```bash
cd Hostel_Management_System_Front_End
npm install
npm run dev
```

Optional `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

If unset, the app uses the production Render API:

```text
https://hostel-management-system-back-end-1.onrender.com/api
```

---

## Build & deploy

```bash
npm run build
```

**Vercel**
- Framework: Vite
- Build: `npm run build`
- Output: `dist`
- SPA fallback is configured in `vercel.json` so routes like `/settings` do not 404 on refresh

Also includes `public/_redirects` for Netlify-style hosts.

---

## PWA (install as an app)

The app is a Progressive Web App:

| Platform | Install |
|----------|---------|
| Android | Chrome → Install app / Add to Home screen |
| iPhone | Safari → Share → Add to Home Screen |
| Windows / macOS | Chrome or Edge → Install from the address bar |

Files: `public/manifest.webmanifest`, `public/sw.js`, app icons.

---

## Auth behaviour

- JWT stored in `sessionStorage` (or `localStorage` if “Remember me”)
- Protected routes verify the session with `GET /api/auth/me`
- Invalid sessions are cleared and redirected to `/login`
- After login, users land on `/dashboard`

---

## Mobile layout

- Below 768px width, the sidebar becomes a **slide-out drawer**
- Hamburger control in the top bar
- Full-width content, stacked cards, horizontally scrollable tables

---

## Project layout

```
src/
  api.js                 # Axios client + endpoints
  App.jsx                # Routes
  App.css                # Global + public + app styles
  main.jsx               # Entry + service worker registration
  components/
    PublicLayout.jsx     # Marketing shell
    Home.jsx / About.jsx / Faqs.jsx
    Layout.jsx / Sidebar.jsx / Topbar.jsx
    Dashboard.jsx, BookRoom.jsx, Settings.jsx, ...
    ProtectedRoute.jsx / RoleRoute.jsx
  utils/auth.js
  utils/keepAlive.js     # Pings API /health every 30s while open
public/
  logo-*.jpg, icons, manifest, sw.js
vercel.json
```

---

## Keep-alive

While a browser tab is open, the client pings:

```text
GET {API origin}/api/health
```

every 30 seconds to reduce Render free-tier sleep during active use.

---

## Related repo

Backend: `Hostel_Management_System_Back_End` (Flask + PostgreSQL).
