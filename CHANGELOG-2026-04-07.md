# 🏠 DreamHome Frontend — Changes Summary

**Date:** April 7, 2026  
**Scope:** Branch Management Module — Security, Scalability & Maintainability Improvements  
**Affected Area:** `src/app/Pages/Admin/Branches/` and shared libraries

---

## 🔍 Overview

Refactored the Branch Management module to follow best practices in **security**, **scalability**, and **maintainability**. The work introduced a centralized API client, reusable form utilities, client-side validation, automatic JWT token refresh, and two new CRUD modals (Edit & Delete).

---

## 📦 New Files

| File | Description |
|------|-------------|
| `src/lib/apiClient.js` | Centralized API client — handles auth headers, error formatting, 204 responses, and **automatic JWT token refresh** on 401 |
| `src/lib/hooks/useForm.js` | Reusable form hook — manages form state, validation, submission, loading state, and reset logic |
| `src/app/.../Branches/components/validator.js` | Validation rules for branch forms (Philippine postal code format, phone regex, max lengths) |
| `src/app/.../Branches/components/EditBranchModal.js` | Edit Branch modal — pre-populates from selected branch data, sends `PUT` request |
| `src/app/.../Branches/components/DeleteBranchModal.js` | Delete Branch confirmation modal — shows branch summary, warning message, sends `DELETE` request |

---

## ✏️ Modified Files

### `jsconfig.json`
- Added `@components/*` path alias pointing to `./global-components/*`
- This eliminates deep relative imports like `../../../../../../global-components/ui/Button`

### `src/app/Pages/Admin/Branches/components/AddBranchModal.js`
- **Replaced** inline `fetch` calls with `apiClient`
- **Replaced** manual `useState` + `handleInputChange` + `handleSubmit` with the `useForm` hook
- **Added** inline validation error messages beneath each field (red border + error text)
- **Added** API error banner at top of form (replaces `alert()`)
- **Removed** `localStorage.getItem('adminAccessToken')` (now handled by `apiClient`)
- **Removed** debug `console.log` that leaked API URL structure
- **Updated** import paths to use `@components/` alias

### `src/app/Pages/Admin/Branches/page.js`
- **Replaced** inline `fetch` calls with `apiClient`
- **Added** "Actions" column to the branch table with Edit (✏️) and Delete (🗑️) icon buttons
- **Added** state management for Edit/Delete modals and selected branch
- **Mounted** `EditBranchModal` and `DeleteBranchModal` components
- **Updated** import paths to use `@components/` alias
- **Updated** column header from "Postcode" → "Postal Code"

### `src/app/Pages/Admin/components/ui/Navbar.js`
- **Replaced** inline `fetch` + manual auth headers with `apiClient`

---

## 🔐 Security Improvements

| Before | After |
|--------|-------|
| `localStorage.getItem('adminAccessToken')` scattered across 4 files | Token access centralized in `apiClient.js` — single point to audit |
| No input validation — raw form data sent directly to API | Client-side validation with regex patterns, max lengths, required field checks |
| `alert(error.message)` could expose internal server errors to users | Formatted error banner with user-friendly messages |
| Debug `console.log` leaking API URL in production | Removed |
| No token expiry handling — requests fail silently | Automatic token refresh on 401 → retry → force logout if refresh also expired |

---

## 📈 Scalability Improvements

| Before | After |
|--------|-------|
| `API_URL` + auth headers duplicated in every component | Single `apiClient.js` — add a header or change base URL in one place |
| Form state logic (useState, onChange, submit, reset) copy-pasted per modal | `useForm` hook — any new modal (Edit Staff, Add Task, etc.) reuses this |
| Validation rules inline per component | Shared `validateForm()` function + per-entity validator configs |
| Initial form data defined twice (init + reset) | `INITIAL_BRANCH_DATA` constant defined once |

---

## 🔧 Maintainability Improvements

| Before | After |
|--------|-------|
| `import Button from '../../../../../../global-components/ui/Button'` | `import Button from '@components/ui/Button'` |
| Inconsistent indentation in `handleSubmit` | Consistent formatting throughout |
| `alert()` for error feedback | Inline error banners + per-field error messages |
| Business logic mixed into UI components | API calls via `apiClient`, form logic via `useForm`, validation via `validator.js` |

---

## 🔄 API Client — Token Refresh Flow

```
User makes API call
        ↓
    apiClient sends request with Bearer token
        ↓
    Response is 401 (token expired)?
        ├── YES → POST /api/token/refresh/ with refresh token
        │         ├── Success → Save new access token → Retry original request
        │         └── Fail → Clear tokens → Redirect to login page
        └── NO → Return data / throw formatted error
```

**Concurrency safe:** If multiple API calls get 401 simultaneously, only one refresh request is made. Others wait for it.

---

## 🗂️ File Structure After Changes

```
src/
├── lib/
│   ├── apiClient.js          ← NEW: Centralized API client
│   └── authService.js        ← Existing (login/logout)
├── hooks/
│   └── useForm.js            ← NEW: Reusable form hook
└── app/
    └── Pages/Admin/Branches/
        ├── page.js            ← MODIFIED: Added Actions column + Edit/Delete modals
        └── components/
            ├── AddBranchModal.js    ← MODIFIED: Uses useForm + apiClient
            ├── EditBranchModal.js   ← NEW: Edit modal with pre-populated form
            ├── DeleteBranchModal.js ← NEW: Delete confirmation modal
            └── validator.js         ← NEW: Branch validation rules

jsconfig.json                  ← MODIFIED: Added @components/* alias
```

---

## ✅ How To Test

1. **Add Branch** — Click "+ Add Branch", submit empty → validation errors should appear inline
2. **Add Branch** — Fill valid data (4-digit postal code like `1000`) → branch should appear in table
3. **Edit Branch** — Click ✏️ icon on any row → modal opens pre-filled → update and save
4. **Delete Branch** — Click 🗑️ icon on any row → confirmation modal → delete
5. **Token Refresh** — Wait for token to expire → any API call should silently refresh and succeed
6. **Session Expiry** — If refresh token also expires → user is redirected to login

---

## 📋 Next Steps / Recommendations

- [ ] Apply same `apiClient` + `useForm` pattern to **Staff** and **Tasks** modules
- [ ] Add a **Toast notification system** to replace remaining `alert()` calls elsewhere
- [ ] Add **PropTypes or TypeScript** for component prop validation
- [ ] Consider moving `validator.js` to `src/lib/validators/` if shared across modules
- [ ] Add **loading skeletons** to the branch table for better perceived performance
