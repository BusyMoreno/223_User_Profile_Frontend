# User Profile Frontend (UK223)

A React TypeScript application for user/role/authority management with secure authentication, protected routes, and Material-UI interface.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Testing](#testing)
- [Security](#security)
- [Project Structure](#project-structure)

## Quick Start

The application runs on `http://localhost:5173` after `yarn dev`.

**Routes:**
- `/` - Home (authenticated vs. non-authenticated)
- `/login` - Authentication
- `/admin` - Admin panel (ADMIN role required)
- `/user` - User management table
- `/user/edit` - Create/edit users

**Default Login:**
- Email: admin@example.com
- Password: 1234

## Prerequisites

- Node.js 16+
- Yarn

## Installation

```bash
git clone <repository-url>
cd 223_User_Profile_Frontend
yarn install
yarn dev
```

**Available Scripts:**
```bash
yarn dev         # Start development server
yarn build       # Production build
yarn test        # Unit tests (Vitest)
yarn cypress:open # Cypress GUI
yarn cypress:run  # Cypress headless
```

## Testing

**Unit Testing:** Vitest + React Testing Library
**E2E Testing:** Cypress with comprehensive workflows

**Test Coverage:**
- Authentication flows
- User CRUD operations
- Filtering and search
- Form validation

**Test Files:**
- `cypress/e2e/test1.cy.ts` - Basic auth & search
- `cypress/e2e/UC2.cy.ts` - User editing workflow
- `cypress/e2e/UC5.cy.ts` - Filtering & deletion

**Run Tests:**
```bash
yarn test                    # Unit tests
yarn cypress:open           # GUI mode
yarn cypress:run            # Headless mode
```

## Security

**JWT Authentication:**
- Tokens stored in localStorage
- Automatic expiration handling
- Axios interceptors for API requests

**Role-Based Access Control:**
- Roles: `DEFAULT`, `ADMIN`, `USER`
- Authority system for granular permissions
- Component-level protection

**Security Features:**
- Route protection with redirects
- Admin-only UI elements
- Secure API endpoints

## Project Structure

```
src/
├── components/pages/        # Page components
├── Contexts/               # React contexts (auth, user)
├── Router/                 # Route definitions & guards
├── Services/              # API services & business logic
├── config/                # App configuration
├── types/                 # TypeScript definitions
└── cypress/e2e/           # E2E test files
```

## Key Technologies

- **Frontend:** React 18, TypeScript, Vite
- **UI:** Material-UI (MUI) with Emotion
- **Routing:** React Router v7
- **Forms:** Formik + Yup validation
- **HTTP:** Axios with interceptors
- **Testing:** Vitest, React Testing Library, Cypress
- **Build:** Vite

## Troubleshooting

**Common Issues:**
- Check backend connectivity for API calls
- Verify JWT token hasn't expired
- Clear node_modules if installation fails

**Development:**
- Use browser dev tools for debugging
- Check console logs for API errors
- Run tests to validate functionality

---

This application provides a complete user management system with modern React practices, comprehensive security, and thorough testing coverage.