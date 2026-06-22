<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366f1,100:8b5cf6&height=220&section=header&text=Inventory%20Hub&fontSize=80&fontColor=ffffff&fontAlignY=40&desc=React%2019%20%7C%20Vite%208%20%7C%20TanStack%20Query%20%7C%20Tailwind%20CSS%20%7C%20shadcn%2Fui&descAlignY=60&descSize=17&descColor=ede9fe&animation=fadeIn" width="100%"/>

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
[![Code Style](https://img.shields.io/badge/Code_Style-Airbnb-red?style=for-the-badge)](https://github.com/airbnb/javascript)
[![Status](https://img.shields.io/badge/Status-Active-8b5cf6?style=for-the-badge)]()

<br/>

[![Quick Start](https://img.shields.io/badge/⚡_Quick_Start-Get_Running-6366f1?style=for-the-badge)](#-quick-start)
[![Architecture](https://img.shields.io/badge/🏛️_Architecture-Deep_Dive-8b5cf6?style=for-the-badge)](#️-architecture-deep-dive)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-Open_Issue-red?style=for-the-badge)](https://github.com/sridhar-mahalingam/inventory-hub/issues)

</div>

---

## 📋 Table of Contents

- [📖 About](#-about)
- [✨ Features](#-features)
- [📸 Pages & Screenshots](#-pages--screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🗂️ Project Structure](#️-project-structure)
- [⚡ Quick Start](#-quick-start)
- [🔑 Environment Variables](#-environment-variables)
- [🏛️ Architecture Deep Dive](#️-architecture-deep-dive)
- [📜 Available Scripts](#-available-scripts)
- [🧩 Key Components & Patterns](#-key-components--patterns)
- [🎨 Theming & Styling](#-theming--styling)
- [🔧 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)
- [📜 License](#-license)

---

## 📖 About

**Inventory Hub** is a modern, reactive frontend for a full-stack inventory management system. Built with **React 19** and **Vite 8**, it gives business owners a beautiful, responsive dashboard to manage their entire inventory ecosystem — from products and suppliers to sales orders and analytics — all in a snappy single-page app with no full page reloads.

> 💡 The frontend is powered by **TanStack Query v5** for intelligent server-state caching, **React Router v7** for client-side navigation with declarative route guards, and **shadcn/ui** for an accessible, customizable component system — all wired together by a clean Axios API layer with global request/response interceptors.

### Why Inventory Hub Frontend?

| 🚩 User Need | ✅ How We Deliver It |
|---|---|
| ⚡ Fast, instant navigation | Client-side routing — no full page reloads |
| 📊 Always-fresh inventory data | TanStack Query smart caching with 30-second stale window |
| 📱 Works beautifully on every screen | Tailwind CSS responsive utility classes throughout |
| 🎨 Professional, polished UI | shadcn/ui primitives + CSS variable theming system |
| 📥 Bulk data operations | CSV import via PapaParse + Excel export via SheetJS |
| 🔒 Secure, guarded navigation | `ProtectedRoute` / `PublicRoute` pattern with auth context |
| 🐛 Early problem detection | `React.StrictMode` wraps the entire tree |

---

## ✨ Features

<table>
<tr>
<td valign="top">

### 🛡️ Auth & Security
- Token-based login with persistent sessions
- `ProtectedRoute` — unauthenticated users redirected to `/login`
- `PublicRoute` — logged-in users redirected away from `/login`
- Token + user object stored in `localStorage`
- Auth state via React Context API (`useAuth` hook)
- Global 401 interceptor auto-clears session and redirects

</td>
<td valign="top">

### 📦 Product Management
- Full CRUD interface with image upload preview
- Real-time search across name, SKU, and category
- CSV bulk import via PapaParse (client-side parsing)
- Excel export via SheetJS (xlsx)
- Color-coded stock badges with low-stock warnings
- Product status badges (active / inactive / discontinued)

</td>
</tr>
<tr>
<td valign="top">

### 📊 Analytics Dashboard
- Animated KPI cards (revenue, orders, products, low-stock count)
- Revenue trend line chart (Recharts)
- Top-selling products bar chart
- Category distribution pie chart
- Stock level overview across all products
- All charts responsive and SVG-based

</td>
<td valign="top">

### 🛒 Sales & Stock
- Sale order creation with multi-line item support
- Payment status tracking and display
- Stock movement log with type, reason, and reference
- Color-coded movement types (in = green, out = red, adjustment = blue)
- Supplier directory with full contact information
- User business profile self-management

</td>
</tr>
</table>

---

## 📸 Pages & Screenshots

| # | Page | Route | What You'll Find |
|---|------|-------|-----------------|
| 🏠 | **Dashboard** | `/` | KPI cards, revenue chart, recent orders, stock overview |
| 📦 | **Products** | `/products` | Full product catalog with search, CRUD, CSV import, Excel export |
| 📂 | **Categories** | `/categories` | Color-coded category cards with description |
| 🏭 | **Suppliers** | `/suppliers` | Supplier directory with contact details |
| 🛒 | **Sales** | `/sales` | Sale order list, order creation with line items |
| 📊 | **Analytics** | `/analytics` | Revenue trends, top sellers, category breakdown |
| 📋 | **Stock Movements** | `/stockmovements` | Full audit trail with type, qty, before/after |
| ⚙️ | **Settings** | `/settings` | Business profile, tax rate, currency, personal info |
| 🔐 | **Login** | `/login` | Token-based authentication (public route) |

---

## 🛠️ Tech Stack

| Category | Library | Version | Role |
|----------|---------|---------|------|
| **UI Library** | React | 19 | Component-based reactive UI |
| **Build Tool** | Vite | 8 (beta) | Lightning-fast dev server with HMR |
| **Routing** | React Router DOM | v7 | Client-side navigation + protected routes |
| **Server State** | TanStack Query | v5 | Caching, background sync, query invalidation |
| **HTTP Client** | Axios | Latest | API calls with interceptors |
| **Styling** | Tailwind CSS | v3 | Utility-first responsive design |
| **Components** | shadcn/ui (Radix UI) | Latest | Accessible, unstyled primitive components |
| **Charts** | Recharts | Latest | Responsive SVG-based data visualization |
| **Icons** | Lucide React | Latest | Consistent, tree-shakable SVG icon set |
| **CSV Import** | PapaParse | Latest | Browser-side CSV → JSON parsing |
| **Excel Export** | SheetJS (xlsx) | Latest | Client-side Excel file generation |
| **Date Formatting** | date-fns | Latest | Lightweight date utility functions |
| **Notifications** | shadcn/ui Toaster | Latest | Toast notification feedback system |

---

## 🗂️ Project Structure

```
Inventory-Frontend/
│
├── 📄 index.html                   # Vite entry HTML
├── 📄 package.json                 # Dependencies and scripts
├── 📄 vite.config.js               # @ alias → ./src, Vite plugins
├── 📄 tailwind.config.js           # Dark mode, CSS variables, sidebar palette
├── 📄 .env                         # 🔒 Environment variables — never commit!
├── 📄 .env.example                 # Template — copy to .env
│
└── 📁 src/
    │
    ├── 📄 main.jsx                 # App entry — ReactDOM.createRoot
    │                               # + React.StrictMode wrapper
    │
    ├── 📄 App.jsx                  # QueryClient config, AuthProvider,
    │                               # BrowserRouter, Routes, ProtectedRoute,
    │                               # PublicRoute, Toaster
    │
    ├── 📄 Layout.jsx               # Persistent shell — sidebar + top header
    │
    ├── 📄 index.css                # Tailwind @base/@components/@utilities
    │                               # + CSS custom properties (color tokens)
    │
    ├── 📁 context/
    │   └── 📄 AuthContext.jsx      # AuthProvider — isAuthenticated, user,
    │                               # login(), logout(), loading
    │
    ├── 📁 lib/
    │   └── 📄 AuthContext.jsx      # Legacy re-export → @/context/AuthContext
    │                               # (backward compat; safe to keep)
    │
    ├── 📁 services/
    │   └── 📄 api.js               # Axios instance + interceptors
    │                               # + createApiService(endpoint) factory
    │
    ├── 📁 pages/
    │   ├── 📄 Dashboard.jsx        # KPI cards + Recharts visualizations
    │   ├── 📄 Products.jsx         # CRUD, search, CSV import, Excel export
    │   ├── 📄 Categories.jsx       # Category management with color picker
    │   ├── 📄 Suppliers.jsx        # Supplier directory + CRUD
    │   ├── 📄 Sales.jsx            # Order list + creation with line items
    │   ├── 📄 Analytics.jsx        # Charts, trends, and sales reports
    │   ├── 📄 StockMovements.jsx   # Movement history with type badges
    │   ├── 📄 Settings.jsx         # Business profile + user info
    │   ├── 📄 Login.jsx            # Public login form
    │   └── 📄 PageNotFound.jsx     # 404 fallback page
    │
    └── 📁 components/
        └── 📁 ui/                  # shadcn/ui generated components
            ├── 📄 button.jsx       # Button with variants
            ├── 📄 card.jsx         # Card, CardHeader, CardContent...
            ├── 📄 dialog.jsx       # Modal dialog
            ├── 📄 input.jsx        # Form input
            ├── 📄 label.jsx        # Accessible label
            ├── 📄 select.jsx       # Dropdown select
            ├── 📄 badge.jsx        # Status badges
            ├── 📄 table.jsx        # Data table primitives
            ├── 📄 toaster.jsx      # Toast notification container
            └── 📄 toast.jsx        # Individual toast component
```

---

## ⚡ Quick Start

### Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white&style=flat-square) | Node 18+ |
| ![npm](https://img.shields.io/badge/npm-9+-CB3837?logo=npm&logoColor=white&style=flat-square) | npm 9+ (or pnpm / yarn) |
| 🔌 **Backend running** | Inventory Hub API at `http://127.0.0.1:8000` |

### 1️⃣ Navigate to the Frontend Directory

```bash
cd Inventory-Frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

```bash
cp .env.example .env
```

Open `.env` and set the API base URL:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### 4️⃣ Start the Development Server

```bash
npm run dev
```

> ✅ App running at **`http://localhost:5173`**

### 5️⃣ Login

Use the superuser credentials created during backend setup. The login page is at `/login` and will redirect you to the Dashboard on success.

---

## 🔑 Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | Base URL for the Django REST API — no trailing slash |

> ⚠️ All `VITE_` variables are **inlined at build time** by Vite and are visible in the browser bundle. Never store secrets or tokens here.

---

## 🏛️ Architecture Deep Dive

### 🔐 Authentication Flow

```
User visits app
      │
      ▼
AuthProvider (React Context)
┌──────────────────────────────────────────────────────┐
│  On mount:                                           │
│    reads token + user from localStorage              │
│    sets: isAuthenticated, user, loading = false      │
└────────┬─────────────────────────────────────────────┘
         │
   ┌─────▼──────┐                ┌─────────────────────┐
   │ Protected  │─ not authed ──▶│  Navigate("/login")  │
   │   Route    │                └─────────────────────┘
   └─────┬──────┘
         │ authed
         ▼
    Render page
    inside <Layout>

Login flow:
  POST /api/auth/login/ → { token, user, ... }
  AuthContext.login() → stores to localStorage
  Navigate("/")

Logout flow:
  POST /api/auth/logout/ → 200 OK
  AuthContext.logout() → clears localStorage
  Navigate("/login")

Global 401 (any API call):
  Axios response interceptor detects 401
  → clears localStorage
  → redirects to /login
```

---

### 🌐 API Service Layer

```
src/services/api.js
──────────────────────────────────────────────────────────────
  axios.create({ baseURL: import.meta.env.VITE_API_URL })

  ┌── Request Interceptor ────────────────────────────────┐
  │  Reads token from localStorage                        │
  │  Injects: Authorization: Token <token>                │
  └───────────────────────────────────────────────────────┘

  ┌── Response Interceptor ───────────────────────────────┐
  │  On success: returns response.data (unwraps Axios)    │
  │  On 401:     clears localStorage → window.location   │
  │              redirects to /login                      │
  └───────────────────────────────────────────────────────┘

  createApiService(endpoint) factory:
  ┌──────────────────────────────────────────────────────┐
  │  .list()           → GET    /endpoint/               │
  │  .get(id)          → GET    /endpoint/:id/           │
  │  .create(data)     → POST   /endpoint/               │
  │  .update(id, data) → PUT    /endpoint/:id/           │
  │  .patch(id, data)  → PATCH  /endpoint/:id/           │
  │  .delete(id)       → DELETE /endpoint/:id/           │
  └──────────────────────────────────────────────────────┘
```

---

### 🔄 Server State with TanStack Query

```jsx
// Configured globally in App.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // no surprise refetch on tab switch
      retry: 1,                    // one automatic retry on network failure
      staleTime: 30_000,           // cache served as-is for 30 seconds
    },
  },
});

// Usage pattern in any page component
const { data: products, isLoading, isError } = useQuery({
  queryKey: ['products'],
  queryFn: () => productService.list(),
});

const createMutation = useMutation({
  mutationFn: (data) => productService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    toast({ title: 'Product created!' });
  },
});
```

---

### 🛣️ Routing Architecture

```jsx
// App.jsx — route structure
<Router>
  <Routes>
    {/* Public */}
    <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />

    {/* Protected — all wrapped in Layout (sidebar + header) */}
    <Route path="/"               element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
    <Route path="/products"       element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
    <Route path="/categories"     element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
    <Route path="/suppliers"      element={<ProtectedRoute><Layout><Suppliers /></Layout></ProtectedRoute>} />
    <Route path="/sales"          element={<ProtectedRoute><Layout><Sales /></Layout></ProtectedRoute>} />
    <Route path="/analytics"      element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
    <Route path="/stockmovements" element={<ProtectedRoute><Layout><StockMovements /></Layout></ProtectedRoute>} />
    <Route path="/settings"       element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />

    {/* Catch-all */}
    <Route path="*" element={<PageNotFound />} />
  </Routes>
</Router>
```

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev server** | `npm run dev` | Starts Vite dev server with HMR at `localhost:5173` |
| **Build** | `npm run build` | Compiles production bundle to `dist/` |
| **Preview** | `npm run preview` | Serves the production `dist/` build locally |
| **Lint** | `npm run lint` | Runs ESLint across all source files |

---

## 🧩 Key Components & Patterns

### `AuthContext` (`src/context/AuthContext.jsx`)
The single source of truth for authentication state. Provides `isAuthenticated`, `user`, `login(token, user)`, `logout()`, and `loading`. Reads from `localStorage` on mount so sessions survive page refreshes.

### `ProtectedRoute` / `PublicRoute` (`src/App.jsx`)
Declarative route guards built as thin wrappers:
- **`ProtectedRoute`** — renders a spinner while `loading`, then redirects to `/login` if unauthenticated, else renders children.
- **`PublicRoute`** — redirects authenticated users to `/` so they can't re-visit the login page.

### `createApiService` (`src/services/api.js`)
A factory function that generates a full CRUD service object for any backend endpoint. The response interceptor automatically unwraps `response.data` and handles 401 redirects globally — pages never need to handle auth failures themselves.

### `QueryClient` (`src/App.jsx`)
Configured with three sensible defaults:
- `refetchOnWindowFocus: false` — prevents surprise refetches when the user alt-tabs back
- `retry: 1` — one automatic retry on transient network errors
- `staleTime: 30_000` — data is served from cache for 30 seconds before a background refetch

### `Layout` (`src/Layout.jsx`)
The persistent shell wrapping all protected pages. Renders the sidebar navigation (links to all 8 pages) and the top header. This component is mounted once and stays alive as the user navigates.

### `Toaster` (`src/App.jsx`)
The shadcn/ui `<Toaster />` is mounted at the app level so any component can trigger toasts via the `useToast()` hook without prop drilling.

---

## 🎨 Theming & Styling

The design system is built on **CSS custom properties** defined in `src/index.css` and consumed by Tailwind via `tailwind.config.js`.

Key design tokens:

| Token | Purpose |
|-------|---------|
| `--primary` / `--primary-foreground` | Brand indigo — buttons, links, active states |
| `--background` / `--foreground` | Page background and default text |
| `--card` / `--card-foreground` | Card surfaces |
| `--muted` / `--muted-foreground` | Subtle backgrounds and secondary text |
| `--sidebar-*` | Dedicated sidebar palette tokens |
| `--radius` | Global border-radius control |

**Dark mode** is supported via the `class` strategy in `tailwind.config.js`. Applying the `dark` class to the `<html>` element switches the entire palette — the CSS variables simply resolve to different values.

---

## 🔧 Roadmap

| Area | Current Status | Planned Improvement |
|------|---------------|-------------------|
| **TypeScript** | JSX only | Migrate to TypeScript for compile-time type safety |
| **Tests** | None | Add Vitest + React Testing Library |
| **Error Boundaries** | None | Wrap each page with a React error boundary |
| **Dark Mode Toggle** | CSS vars ready | Wire a theme toggle control into the header |
| **PWA** | None | Add Vite PWA plugin + service worker |
| **Pagination UI** | Full list load | Add cursor/page controls on all list pages |
| **Real-time updates** | Manual refetch | Explore WebSocket / SSE for live stock push |
| **Storybook** | None | Add component stories for the shadcn/ui components |

---

## 🤝 Contributing

Contributions are welcome!

1. 🍴 **Fork** the repository
2. 🌿 **Create** your feature branch: `git checkout -b feature/your-feature-name`
3. ✍️ **Write** your code following the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
4. ✅ **Verify** linting passes: `npm run lint`
5. 💾 **Commit** with a descriptive message: `git commit -m 'feat: add amazing feature'`
6. 📤 **Push**: `git push origin feature/your-feature-name`
7. 🔁 **Open** a Pull Request with a clear description of the change

---

## 👨‍💻 Author

<div align="center">

**Sridhar**

[![Email](https://img.shields.io/badge/Email-sridharansridhar22%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sridharansridhar22@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sridhar-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sridhar-mahalingam-6b8357245)
[![Portfolio](https://img.shields.io/badge/Portfolio-sridharportfolio1.netlify.app-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://sridharportfolio1.netlify.app/)

</div>

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,100:6366f1&height=130&section=footer&text=Built%20with%20%E2%9D%A4%EF%B8%8F%20by%20Sridhar%20Mahalingam&fontSize=22&fontColor=ffffff&fontAlignY=65&animation=fadeIn" width="100%"/>

⭐ **Found this useful? Drop a star on the repo!** ⭐

</div>
