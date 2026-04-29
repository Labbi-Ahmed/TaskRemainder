# TaskReminder — Full Architecture & Codebase Review

**Reviewer:** Senior Software Engineer  
**Date:** 2026-04-29  
**Branch:** next-migration  
**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS · Firebase (stubbed)

---

## 1. Project Overview

TaskReminder is a "save now, act later" content reminder app. Users save tasks with
scheduling metadata, then get reminded when the time comes. The project currently
ships a **frontend-only MVP** — all data lives in browser localStorage and
authentication is fully mocked (no backend).

---

## 2. Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js (App Router) | 16.2.4 | File-based routing, route groups |
| UI Library | React | 19.2.5 | Client components, hooks |
| Language | TypeScript | 6.0.3 | `strict: false` — see §8 |
| Styling | Tailwind CSS | 3.4.19 | Utility-first, responsive |
| Persistence | Browser localStorage | — | No backend, no sync |
| Auth | Mock JWT (hardcoded) | — | `'mock-jwt-token'` literal |
| Push Notifications | Firebase FCM | 12.12.1 | Stubbed — all placeholders |
| Testing | React Testing Library | 16.3.2 | Only 2 test files exist |

---

## 3. Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing page (/)
│   │   ├── login/page.tsx              # /login
│   │   ├── register/page.tsx           # /register
│   │   └── (authenticated)/            # Protected route group
│   │       ├── layout.tsx              # Auth guard + Sidebar + FAB
│   │       ├── dashboard/page.tsx
│   │       ├── tasks/page.tsx
│   │       ├── schedule/page.tsx
│   │       ├── categories/page.tsx
│   │       └── settings/
│   │           ├── page.tsx
│   │           └── profile/page.tsx
│   ├── components/
│   │   ├── Auth/                       # LoginPage, RegistrationForm + tests
│   │   ├── Common/                     # Button, Input, Select, Calendar, Modal…
│   │   ├── Dashboard/                  # Dashboard, TaskList, TaskForm, Settings…
│   │   └── Layout/                     # Sidebar
│   ├── context/
│   │   └── TaskContext.tsx             # Single global provider (all state)
│   ├── utils/
│   │   ├── auth.ts                     # localStorage auth helpers
│   │   └── firebase.ts                 # FCM config (all placeholders)
│   └── types/
│       └── index.ts                    # All TypeScript interfaces
```

---

## 4. Data Models

Defined in `frontend/src/types/index.ts`:

```typescript
Task {
  id: number                        // Generated via Date.now() — collision risk
  title: string
  contentLink?: string              // URL to saved content
  description?: string
  notes?: string
  dueDate?: string                  // ISO string
  timeSlotId?: string               // Link to TimeSlot
  priority: 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'Completed' | 'Missed'
  category?: string                 // Category ID
  tags?: string[]                   // Tag IDs
  // MISSING: createdAt, updatedAt, userId
}

TimeSlot {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  hour: number; minute: number
  daysOfWeek?: number[]             // Weekly: 0-6
  weekOfMonth?: number              // Monthly: 1-4 or -1
  dayOfMonth?: number
  monthOfYear?: number
}

Category { id, name, color }
Tag { id, name, color, timeSlotId?, categoryId? }

User {
  firstName, lastName, email, profilePicture?
  settings: NotificationSettings
}

NotificationSettings {
  pushEnabled, emailEnabled, inAppEnabled, soundEnabled
  dailyDigest, leadTimeMinutes
  quietHoursStart?, quietHoursEnd?
}
```

---

## 5. State Management Architecture

Single `TaskContext` provider wraps the entire authenticated tree.

```
TaskProvider (context/TaskContext.tsx)
 ├── user: User
 ├── tasks: Task[]
 ├── categories: Category[]
 ├── tags: Tag[]
 ├── timeSlots: TimeSlot[]
 ├── isLoading / mounted
 ├── counts (useMemo) → { all, today, pending, completed, overdue }
 └── CRUD helpers for each entity
```

**Persistence pattern:** Every state change triggers a `useEffect` that writes to localStorage.

**Issues with this approach:**
- All state in one context = full re-render of every consumer on any change
- No middleware, no DevTools, no action log
- Will not scale beyond ~500 tasks before performance degrades

---

## 6. Authentication Flow

```
Login Page
  → email + password → client-side validation
  → await 1500ms (simulated API)
  → authUtils.setToken('mock-jwt-token')    ← HARDCODED
  → authUtils.setUser({id:1, email, name})
  → router.push('/dashboard')

Route Guard (app/(authenticated)/layout.tsx)
  → useEffect checks authUtils.isAuthenticated()
  → isAuthenticated() === !!localStorage.getItem('task_remainder_token')
  → if false → router.push('/login')
```

**localStorage keys used:**

| Key | Contents |
|-----|---------|
| `task_remainder_token` | JWT string (mock) |
| `task_remainder_user` | JSON user object |
| `task_remainder_view` | Last viewed section |
| `user_profile` | Full user profile JSON |
| `task_items` | Tasks array JSON |
| `task_categories` | Categories array JSON |
| `task_tags` | Tags array JSON |
| `task_time_slots` | TimeSlots array JSON |

---

## 7. Navigation Structure

```
/                    → Landing page (public)
/login               → Login form (public)
/register            → Registration form (public)
/dashboard           → Stats + recent tasks (protected)
/tasks               → Full task list + filters (protected)
/schedule            → Time slot CRUD (protected)
/categories          → Category & tag management (protected)
/settings            → Notification preferences (protected)
/settings/profile    → Profile editor (protected)
```

Sidebar: Dashboard · Task List · Schedule · Categories & Tags · Settings  
FAB: bottom-right, keyboard shortcut `N`, opens TaskForm globally.

---

## 8. Critical Issues (Blockers for Production)

### 8.1 CRITICAL — Mock Authentication
- **File:** `frontend/src/utils/auth.ts`, `frontend/src/components/Auth/LoginPage.tsx`
- Token is always the string `'mock-jwt-token'`
- Any email + password combination logs in successfully
- No password hashing, no JWT validation, no expiration
- **Fix:** Implement real backend auth endpoint with bcrypt + signed JWT

### 8.2 CRITICAL — Sensitive Data in localStorage
- **File:** `frontend/src/utils/auth.ts`
- JWT token stored in plain-text localStorage → vulnerable to XSS
- Complete user email and profile stored unencrypted
- localStorage is synchronous and accessible to any JS on the page
- **Fix:** Use HttpOnly cookies (requires backend); never store tokens in localStorage

### 8.3 CRITICAL — Credentials Logged to Console
- **File:** `frontend/src/components/Auth/LoginPage.tsx:34`
- `console.log('Attempting login with:', { email, password })`
- User passwords visible in browser DevTools in production
- **Fix:** Remove immediately

### 8.4 CRITICAL — Hardcoded Date Breaks "Today" Filtering
- **File:** `frontend/src/context/TaskContext.tsx:192`
- `const todayStr = new Date('2026-04-28').toISOString().split('T')[0]`
- All "today's tasks", overdue calculations, and dashboard stats are frozen to April 28, 2026
- **Fix:** Replace with `new Date()` — one-line fix

### 8.5 HIGH — No Backend / No Data Persistence
- All data lives only in browser localStorage
- Clearing browser storage or switching devices loses everything
- No multi-user support — `Task` has no `userId` field
- **Fix:** Spring Boot + PostgreSQL backend (per README intent)

### 8.6 HIGH — Firebase Config is All Placeholders
- **File:** `frontend/src/utils/firebase.ts:5-11`
- All values are `"YOUR_API_KEY"` / `"YOUR_PROJECT_ID"` strings
- Push notifications completely non-functional
- **Fix:** Real Firebase project + environment variables

---

## 9. High Priority Issues

### 9.1 — TypeScript `strict: false`
- **File:** `frontend/tsconfig.json:13`
- Disables `noImplicitAny`, `strictNullChecks`, and 5 other checks
- Found evidence of `any` types: `TaskForm.tsx:12` — `onSubmit: (taskData: any) => void`
- **Fix:** Enable `"strict": true` and resolve resulting type errors

### 9.2 — Task ID Collision Risk
- **File:** `frontend/src/context/TaskContext.tsx:96`, `Dashboard.tsx:94`
- IDs generated as `Date.now()` (millisecond timestamp)
- If two tasks are created in the same millisecond, they share an ID
- **Fix:** Use `crypto.randomUUID()` client-side, or backend-assigned UUIDs

### 9.3 — No Error Boundaries
- A single uncaught render error in any component unmounts the entire app
- No `<ErrorBoundary>` wrapping exists anywhere
- **Fix:** Add React ErrorBoundary around each page route

### 9.4 — No Environment Variable Configuration
- No `.env` or `.env.example` files exist
- Firebase config is inline strings, not `process.env.NEXT_PUBLIC_*`
- **Fix:** Create `.env.local` + `.env.example`; move all config to env vars

### 9.5 — Race Condition in Auth Guard
- **File:** `frontend/src/app/(authenticated)/layout.tsx:18-22`
- Auth check runs in `useEffect` — component renders once before the redirect
- Brief flash of protected content is possible
- **Fix:** Use Next.js middleware (`middleware.ts`) for server-side route protection

### 9.6 — No `createdAt` / `updatedAt` on Tasks
- Impossible to sort by creation date, show "last modified", or implement sync
- **Fix:** Add timestamp fields to `Task` interface and populate on create/update

---

## 10. Medium Priority Issues

| # | Issue | File | Fix |
|---|-------|------|-----|
| 10.1 | Simulated API delays everywhere | Dashboard.tsx:58, TaskForm.tsx:128, LoginPage.tsx:36 | Remove fake `setTimeout`; call real API |
| 10.2 | Default hardcoded sample data | TaskContext.tsx (default tasks/categories/tags) | Load defaults from API on first login |
| 10.3 | `alert()` used for FCM feedback | Settings.tsx:44 | Replace with toast notification |
| 10.4 | TaskList prop count too high | TaskList.tsx | Refactor: read from context directly |
| 10.5 | No pagination via API | ITEMS_PER_PAGE hardcoded to 5 | Implement server-side pagination |
| 10.6 | Notification settings collected but never sent | Settings.tsx | Wire to backend notification service |
| 10.7 | Image stored as base64 in localStorage | Profile.tsx (FileReader) | Upload to S3/CDN; store URL only |
| 10.8 | No confirmation on bulk actions | — | Add modal for destructive operations |

---

## 11. Code Quality Observations

### Strengths
- Clean, well-organized component hierarchy
- Consistent Tailwind usage; responsive design throughout
- Good separation: `components/`, `context/`, `utils/`, `types/`
- `useTaskContext()` guard throws if used outside provider
- `useMemo` for counts calculation avoids unnecessary recalculation
- Reusable common components: Button, Input, Select, Calendar, Modal
- `ConfirmationModal` used consistently for deletes

### Weaknesses
- Zero `useCallback` usage — all handlers recreated on every render
- Context causes full-tree re-renders on any state change
- Multiple `"use client"` components that could be server components
- `mounted` state pattern used to avoid hydration mismatch — correct but verbose
- 9 `console.log/error` calls left in production code (including credentials)
- `any` types in TaskForm, Settings handlers

---

## 12. Test Coverage

| Area | Status |
|------|--------|
| LoginPage | ✅ Tested (`LoginPage.test.tsx`) |
| RegistrationForm | ✅ Tested (`RegistrationForm.test.tsx`) |
| TaskContext | ❌ Not tested |
| Task CRUD | ❌ Not tested |
| Dashboard calculations | ❌ Not tested |
| Route guards | ❌ Not tested |
| Utilities (auth.ts, firebase.ts) | ❌ Not tested |
| Schedule logic | ❌ Not tested |

**Estimated coverage: < 5%**

---

## 13. Security Audit Summary

| Severity | Issue |
|----------|-------|
| 🔴 CRITICAL | JWT stored in localStorage (XSS risk) |
| 🔴 CRITICAL | Credentials logged to browser console |
| 🔴 CRITICAL | Mock authentication — anyone can log in |
| 🔴 CRITICAL | Hardcoded date freezes all time-based logic |
| 🟠 HIGH | User PII stored unencrypted in localStorage |
| 🟠 HIGH | Firebase API keys not configured via env vars |
| 🟠 HIGH | No server-side session validation |
| 🟡 MEDIUM | TypeScript `strict: false` allows implicit `any` |
| 🟡 MEDIUM | Auth guard race condition (brief content flash) |
| 🟡 MEDIUM | Base64 profile image in localStorage (size + privacy) |

---

## 14. Backend Readiness Assessment

The README references a Spring Boot + PostgreSQL backend as "coming soon." Minimum API surface to replace localStorage:

```
Auth
  POST /api/auth/register
  POST /api/auth/login       → returns HttpOnly cookie with JWT
  POST /api/auth/logout
  GET  /api/auth/me

Tasks
  GET    /api/tasks           → paginated, filterable
  POST   /api/tasks
  PUT    /api/tasks/:id
  DELETE /api/tasks/:id

Categories / Tags / Time Slots
  GET/POST/PUT/DELETE /api/categories/:id
  GET/POST/PUT/DELETE /api/tags/:id
  GET/POST/PUT/DELETE /api/time-slots/:id

Users
  GET  /api/users/profile
  PUT  /api/users/profile
  PUT  /api/users/settings
```

**PostgreSQL schema additions needed:**
- `users` table with hashed password, timestamps
- All entities need `user_id FK`, `created_at`, `updated_at`
- `tasks.id` → `UUID` (not integer)

---

## 15. Prioritized Roadmap

### Phase 1 — Immediate Fixes (1-2 days, no backend needed)
- [ ] Fix hardcoded date → `new Date()` (`TaskContext.tsx:192`)
- [ ] Remove credentials from console.log (`LoginPage.tsx:34`)
- [ ] Enable `"strict": true` in tsconfig + fix type errors
- [ ] Replace `Date.now()` IDs with `crypto.randomUUID()`
- [ ] Add `.env.example` with Firebase key placeholders
- [ ] Add React ErrorBoundary to authenticated layout
- [ ] Remove all `setTimeout` fake API delays

### Phase 2 — Backend Foundation (1-2 weeks)
- [ ] Spring Boot project setup with PostgreSQL
- [ ] Users table + bcrypt password hashing
- [ ] JWT auth with refresh tokens (HttpOnly cookie)
- [ ] Tasks / Categories / Tags / TimeSlots REST endpoints
- [ ] Replace localStorage CRUD with `fetch`/axios calls
- [ ] Remove mock auth from frontend entirely

### Phase 3 — Security Hardening (1 week)
- [ ] Move to HttpOnly cookies for token storage
- [ ] Add CORS + CSRF protection on backend
- [ ] Next.js middleware (`middleware.ts`) for server-side route guards
- [ ] Input sanitization on all API endpoints
- [ ] Rate limiting on auth endpoints
- [ ] Configure Firebase with real project + env vars

### Phase 4 — Quality & Scale (ongoing)
- [ ] Expand test coverage to 80%+ (TaskContext, CRUD, routes)
- [ ] Add React Query for data fetching + caching
- [ ] Server-side pagination for task list
- [ ] Replace profile image FileReader with S3/CDN upload
- [ ] Add Sentry for error tracking
- [ ] CI/CD pipeline with lint + test gates
- [ ] WCAG 2.1 AA accessibility audit

---

## 16. Overall Maturity Score

| Category | Score | Notes |
|----------|-------|-------|
| UI/UX Design | 8/10 | Polished, responsive, consistent |
| Code Organization | 8/10 | Clean structure, good separation |
| Type Safety | 5/10 | TypeScript present but `strict: false`, `any` usage |
| Data Persistence | 2/10 | localStorage only, no backend |
| Authentication | 1/10 | Fully mocked, zero real security |
| Test Coverage | 1/10 | < 5% coverage |
| Error Handling | 3/10 | Basic try-catch, no boundaries |
| Production Readiness | 2/10 | Multiple blockers before safe to ship |

**Summary:** Solid frontend foundation. The UI is well-built and the architecture is
clean enough to add a backend to. The critical blockers are all in the data and auth
layers — none of which require major frontend rewrites. Fix the hardcoded date first
(one line), then build the backend.
