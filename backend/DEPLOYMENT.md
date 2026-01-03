# Deployment Guide - Vercel

## Prerequisites
- Vercel account
- PostgreSQL database (Prisma Accelerate or any PostgreSQL provider)

## Environment Variables Setup

Add these environment variables in Vercel Dashboard (Settings → Environment Variables):

```bash
DATABASE_URL="your_postgres_connection_string"
PRISMA_ACCELERATE_URL="your_prisma_accelerate_url"  # Optional if using Prisma Accelerate
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
```

## Vercel Configuration

### Project Settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate`
- **Install Command**: `npm install`
- **Output Directory**: (leave empty - handled by vercel.json)

### Database Migration

Since Vercel deployments are serverless, run migrations locally or use Prisma Data Platform:

```bash
# Local migration (make sure DATABASE_URL points to production DB)
cd backend
npx prisma migrate deploy
```

## Deploy

### Option 1: Via Vercel Dashboard
1. Import your GitHub repository
2. Set Root Directory to `backend`
3. Configure environment variables
4. Deploy

### Option 2: Via Vercel CLI
```bash
cd backend
vercel --prod
```

## Important Notes

⚠️ **Security:**
- Never commit `.env` file
- Use Vercel environment variables for secrets
- Rotate JWT_SECRET regularly

⚠️ **Database:**
- Use connection pooling (Prisma Accelerate recommended)
- Ensure DATABASE_URL has proper SSL settings
- For migrations, use DIRECT_URL if needed

⚠️ **CORS:**
- Update CORS settings if you need to restrict origins
- Current setup allows all origins (development mode)

## Testing Deployment

After deployment, test the API:

```bash
# Check API is running
curl https://your-app.vercel.app/

# Test login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### "Cannot find module" errors
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Database connection errors
- Check DATABASE_URL is correct in Vercel environment variables
- Verify database allows connections from Vercel IPs
- Use Prisma Accelerate for better connection pooling

### Timeout errors
- Vercel free tier has 10s function timeout
- Consider upgrading or optimizing slow queries
- Use Prisma Accelerate for query caching
