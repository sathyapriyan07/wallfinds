# Deployment Guide

## Prerequisites

- GitHub account
- Supabase project (production)
- TMDB API key
- Hosting platform account (Vercel/Netlify)

## Production Checklist

### 1. Environment Setup

Create production environment variables:

```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_TMDB_API_KEY=your-tmdb-api-key
```

### 2. Database Setup

1. Create production Supabase project
2. Run `supabase-schema.sql` in SQL Editor
3. Create storage bucket `wallpapers` (public)
4. Create folders: `full` and `thumbnails`

### 3. Build Optimization

Update `vite.config.js` for production:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
```

### 4. Security Hardening

#### Supabase RLS
Verify all RLS policies are enabled:
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

#### Environment Variables
- Never commit `.env` files
- Use platform-specific secret management
- Rotate keys regularly

### 5. Performance Optimization

#### Image Optimization
- Compress images before upload
- Use WebP format
- Implement lazy loading (already done)

#### Caching Strategy
```javascript
// In App.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

## Deployment Platforms

### Vercel (Recommended)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/wallfinds.git
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Step 3: Add Environment Variables
In Vercel dashboard:
- Settings > Environment Variables
- Add all three variables
- Apply to Production, Preview, and Development

#### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete
- Visit your live site!

#### Custom Domain (Optional)
1. Go to Settings > Domains
2. Add your custom domain
3. Configure DNS records
4. Wait for SSL certificate

### Netlify

#### Step 1: Push to GitHub
(Same as Vercel)

#### Step 2: Import to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub
4. Select repository

#### Step 3: Configure Build
- Build command: `npm run build`
- Publish directory: `dist`

#### Step 4: Add Environment Variables
- Site settings > Environment variables
- Add all three variables

#### Step 5: Deploy
- Click "Deploy site"
- Wait for build
- Visit your site!

### Railway

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize
```bash
railway login
railway init
```

#### Step 3: Add Environment Variables
```bash
railway variables set VITE_SUPABASE_URL=your-url
railway variables set VITE_SUPABASE_ANON_KEY=your-key
railway variables set VITE_TMDB_API_KEY=your-key
```

#### Step 4: Deploy
```bash
railway up
```

## Post-Deployment

### 1. Create Admin User
```sql
-- In production Supabase
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin@example.com';
```

### 2. Add Initial Data

#### Categories
```sql
INSERT INTO categories (name, slug, cover_image) VALUES
('Nature', 'nature', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'),
('Space', 'space', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a'),
('Gaming', 'gaming', 'https://images.unsplash.com/photo-1511512578047-dfb367046420'),
('Cars', 'cars', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7'),
('Abstract', 'abstract', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1'),
('Anime', 'anime', 'https://images.unsplash.com/photo-1578632767115-351597cf2477'),
('Movies', 'movies', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba'),
('Minimalist', 'minimalist', 'https://images.unsplash.com/photo-1557682250-33bd709cbe85');
```

### 3. Test Production

Test checklist:
- [ ] Homepage loads
- [ ] Search works
- [ ] Categories work
- [ ] Wallpaper detail pages work
- [ ] Download works
- [ ] Admin login works
- [ ] Admin can upload wallpapers
- [ ] Admin can import from TMDB
- [ ] Images load correctly
- [ ] Mobile responsive

### 4. Monitoring

#### Vercel Analytics
- Enable in Vercel dashboard
- Monitor page views and performance

#### Supabase Monitoring
- Check database usage
- Monitor API requests
- Review error logs

#### Error Tracking (Optional)
Add Sentry:
```bash
npm install @sentry/react
```

```javascript
// In main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

## Continuous Deployment

### Automatic Deployments
Both Vercel and Netlify support automatic deployments:
- Push to `main` branch → Production deploy
- Push to other branches → Preview deploy

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Scaling Considerations

### Database
- Monitor query performance
- Add indexes as needed
- Consider read replicas for high traffic

### Storage
- Use CDN for images
- Implement image optimization service
- Consider separate storage for large files

### Caching
- Implement Redis for session storage
- Use CDN caching
- Enable browser caching

## Backup Strategy

### Database Backups
Supabase provides automatic backups:
- Daily backups (retained for 7 days)
- Point-in-time recovery

### Manual Backup
```bash
# Export database
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql

# Import database
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

### Storage Backups
- Download files periodically
- Use cloud backup service
- Implement versioning

## Rollback Plan

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Netlify
1. Go to Deploys
2. Find previous deploy
3. Click "Publish deploy"

### Database Rollback
```sql
-- Restore from backup
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

## Cost Optimization

### Supabase
- Free tier: 500MB database, 1GB storage
- Pro tier: $25/month for more resources

### Vercel/Netlify
- Free tier: Sufficient for small projects
- Pro tier: $20/month for more bandwidth

### TMDB API
- Free with rate limits
- No paid tiers needed

## Support & Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Monitor performance metrics
- [ ] Backup database weekly
- [ ] Review security updates

### Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npm install package@latest
```

## Troubleshooting

### Build Fails
- Check environment variables
- Verify all dependencies installed
- Review build logs

### Images Not Loading
- Check storage bucket is public
- Verify CORS settings
- Check file paths

### API Errors
- Verify API keys
- Check rate limits
- Review Supabase logs

---

## Quick Deploy Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

---

Your WallFinds app is now production-ready! 🚀
