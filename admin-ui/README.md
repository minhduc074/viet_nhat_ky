# Viet Nhat Ky - Admin Panel

Angular-based admin dashboard for managing users and monitoring AI API usage.

## Features

### 📊 Dashboard
- Overview statistics (users, entries, insights, AI calls)
- AI usage summary for last 30 days
- Success rates and performance metrics
- Recent users and AI requests

### 👥 User Management
- List all users with search and pagination
- Create new users
- Edit user details (name, role, status)
- Delete users
- View user statistics (entries, insights, AI usage)

### 🤖 AI Usage Monitoring
- Real-time AI API call logging
- Filter by provider (ChatGPT/Gemini), date range
- Token usage tracking
- Response time metrics
- Error tracking and monitoring
- Success rate analytics

## Setup

### Prerequisites
- Node.js 18+ and npm
- Backend server running (see backend folder)

### Installation

1. Install dependencies:
```bash
cd admin-ui
npm install
```

2. Configure backend API URL:
Edit `src/app/services/admin.service.ts` and update the `baseUrl`:
```typescript
private baseUrl = 'http://localhost:3000/api/admin'; // Update with your backend URL
```

3. Set up authentication token:
The admin panel requires an admin JWT token. See `ADMIN_SETUP.md` in the root directory for detailed setup instructions.

## Development server

To start a local development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/`

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Project Structure

```
src/app/
├── components/
│   ├── dashboard/       # Main dashboard with statistics
│   ├── users/          # User management CRUD
│   └── ai-usage/       # AI usage monitoring
├── services/
│   └── admin.service.ts # API service for backend communication
├── interceptors/
│   └── auth.interceptor.ts # JWT token interceptor
├── models/
│   └── admin.models.ts  # TypeScript interfaces
└── app.routes.ts       # Application routing
```

## Additional Resources

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

For detailed setup instructions, see `ADMIN_SETUP.md` in the project root.

