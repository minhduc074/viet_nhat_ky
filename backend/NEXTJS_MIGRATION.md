# Next.js Backend Migration Guide

## ✅ Completed Migration

The backend has been successfully migrated from Express.js to **Next.js 15** with App Router.

## 🆕 What Changed

### Architecture
- **Before**: Express.js with traditional routes
- **After**: Next.js 15 App Router with TypeScript

### New Structure
```
backend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── change-password/route.ts
│   │   ├── entries/
│   │   │   ├── [id]/route.ts
│   │   │   ├── today/route.ts
│   │   │   ├── range/route.ts
│   │   │   └── route.ts
│   │   ├── stats/
│   │   │   ├── monthly/route.ts
│   │   │   ├── weekly/route.ts
│   │   │   ├── streak/route.ts
│   │   │   └── overview/route.ts
│   │   └── route.ts
│   ├── api-docs/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── apiUtils.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── next.config.js
├── tsconfig.json
└── package.json
```

### Benefits
✅ **TypeScript** - Full type safety
✅ **Modern Stack** - Latest Next.js 15
✅ **Auto CORS** - Configured in next.config.js
✅ **Serverless Ready** - Perfect for Vercel
✅ **Hot Reload** - Fast development
✅ **Built-in Optimization** - Image, fonts, etc.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment Variables
The `.env` file remains the same:
```env
DATABASE_URL="your_postgres_url"
PRISMA_ACCELERATE_URL="your_accelerate_url"
JWT_SECRET="your_secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

### 3. Run Development Server
```bash
npm run dev
```

Server runs on http://localhost:3000

### 4. Build for Production
```bash
npm run build
npm start
```

## 📡 API Endpoints (Unchanged)

All endpoints remain the same:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `PUT /api/auth/change-password`
- `GET /api/entries?year=2026&month=1`
- `POST /api/entries`
- `GET /api/entries/today`
- `GET /api/entries/range?startDate=...&endDate=...`
- `GET /api/entries/:id`
- `DELETE /api/entries/:id`
- `GET /api/stats/monthly?year=2026&month=1`
- `GET /api/stats/weekly`
- `GET /api/stats/streak`
- `GET /api/stats/overview`

## 📚 Documentation

- **Swagger UI**: http://localhost:3000/api-docs
- **API Info**: http://localhost:3000/api

## 🔧 Key Changes

### 1. Route Handlers
Express middleware converted to Next.js Route Handlers:
```typescript
// Before (Express)
router.post('/login', async (req, res) => { ... });

// After (Next.js)
export async function POST(request: Request) { ... }
```

### 2. Authentication
JWT auth now using request headers:
```typescript
const userId = await getUserFromRequest(request);
if (!userId) return errorResponse('Unauthorized', 401);
```

### 3. CORS
Configured globally in `next.config.js`:
```javascript
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      ...
    ],
  }];
}
```

## 📦 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy automatically

### Environment Variables in Vercel
Same as before:
- `DATABASE_URL`
- `PRISMA_ACCELERATE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV=production`

## 🗂️ Old Files

Old Express files are kept in `src/` folder for reference but not used. They can be deleted after testing.

## ⚠️ Breaking Changes

**None!** - All APIs are backward compatible. Mobile app needs no changes.

## 🧪 Testing

Test all endpoints work:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 📝 Notes

- Next.js auto-handles request/response
- TypeScript provides better type safety
- Development is faster with Hot Module Replacement
- Production builds are optimized automatically
- Serverless functions work perfectly on Vercel
