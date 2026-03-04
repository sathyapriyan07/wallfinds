# Quick Reference Guide

## 🚀 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Dependencies
npm install             # Install all dependencies
npm update              # Update dependencies
npm outdated            # Check for outdated packages
```

## 🔧 Environment Variables

```env
# Required for the app to work
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_TMDB_API_KEY=your-tmdb-key
```

## 📊 Database Quick Commands

### Create Admin User
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### Add Sample Categories
```sql
INSERT INTO categories (name, slug, cover_image) VALUES
('Nature', 'nature', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'),
('Space', 'space', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a');
```

### Check Wallpaper Count
```sql
SELECT COUNT(*) FROM wallpapers;
```

### Most Downloaded Wallpapers
```sql
SELECT title, downloads FROM wallpapers ORDER BY downloads DESC LIMIT 10;
```

### Reset Downloads
```sql
UPDATE wallpapers SET downloads = 0;
```

## 🎨 Component Usage

### WallpaperCard
```jsx
import WallpaperCard from './components/WallpaperCard';

<WallpaperCard wallpaper={wallpaperObject} />
```

### CategoryCard
```jsx
import CategoryCard from './components/CategoryCard';

<CategoryCard category={categoryObject} />
```

### TitleLogoCard
```jsx
import TitleLogoCard from './components/TitleLogoCard';

<TitleLogoCard media={mediaObject} />
```

## 🪝 Hook Usage

### Fetch Wallpapers
```jsx
import { useWallpapers } from './hooks/useWallpapers';

const { data, isLoading, error } = useWallpapers();
```

### Fetch with Filters
```jsx
const { data } = useWallpapers({ 
  category: categoryId,
  search: 'nature',
  featured: true,
  limit: 10
});
```

### Create Wallpaper
```jsx
import { useCreateWallpaper } from './hooks/useWallpapers';

const createWallpaper = useCreateWallpaper();

await createWallpaper.mutateAsync({
  title: 'My Wallpaper',
  image_url: 'https://...',
  thumbnail_url: 'https://...',
  category_id: 'uuid',
  tags: ['nature', 'landscape'],
  resolution: '1920x1080'
});
```

## 🔐 Authentication

### Check if User is Logged In
```jsx
import { useAuth } from './hooks/useAuth';

const { user, loading } = useAuth();

if (user) {
  // User is logged in
}
```

### Check if User is Admin
```jsx
import { useIsAdmin } from './hooks/useAuth';

const { isAdmin, loading } = useIsAdmin();

if (isAdmin) {
  // User is admin
}
```

## 📁 File Upload

### Upload to Supabase Storage
```jsx
import { uploadWallpaper, getPublicUrl } from './services/supabaseClient';

const file = event.target.files[0];
const path = `full/${Date.now()}-${file.name}`;

const { error } = await uploadWallpaper(file, path);
const url = getPublicUrl('wallpapers', path);
```

## 🎬 TMDB Integration

### Search Movies
```jsx
import { searchMovies } from './services/tmdbApi';

const results = await searchMovies('Interstellar');
```

### Get Movie Logos
```jsx
import { getMovieLogos } from './services/tmdbApi';

const logos = await getMovieLogos(movieId);
```

## 🎯 Common Tasks

### Add a New Wallpaper (Admin)
1. Login as admin
2. Go to `/admin/wallpapers`
3. Click "Add Wallpaper"
4. Fill form and upload images
5. Submit

### Add a New Category (Admin)
1. Go to `/admin/categories`
2. Click "Add Category"
3. Enter name (slug auto-generates)
4. Add cover image URL
5. Submit

### Import Movie from TMDB (Admin)
1. Go to `/admin/media`
2. Select "Movie" or "TV Series"
3. Search for title
4. Click on result
5. Select a logo
6. Click to import

### Make User an Admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

## 🐛 Troubleshooting

### App Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Images Not Loading
- Check Supabase storage bucket is public
- Verify file paths are correct
- Check browser console for errors

### Database Errors
- Verify schema is created
- Check RLS policies
- Review Supabase logs

### TMDB Not Working
- Verify API key is correct
- Check rate limits (40 req/10s)
- Test API key at themoviedb.org

## 📱 URLs

### Public Routes
```
/                          # Homepage
/wallpaper/:id            # Wallpaper detail
/category/:slug           # Category page
/search?q=query           # Search results
/movie/:id                # Movie wallpapers
/tv/:id                   # TV wallpapers
/login                    # Login page
/signup                   # Signup page
```

### Admin Routes
```
/admin                    # Dashboard
/admin/wallpapers         # Manage wallpapers
/admin/categories         # Manage categories
/admin/media              # Import from TMDB
```

## 🎨 Tailwind Classes

### Glassmorphism
```jsx
className="glass"  // Pre-defined in index.css
```

### Hide Scrollbar
```jsx
className="scrollbar-hide"  // Pre-defined in index.css
```

### Common Patterns
```jsx
// Card
className="glass p-6 rounded-lg"

// Button
className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"

// Input
className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg"

// Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
```

## 🔄 Data Flow

### Fetching Data
```
Component → Hook → Supabase → Database → Hook → Component
```

### Creating Data
```
Component → Mutation → Supabase → Database → Invalidate Cache → Refetch
```

## 📦 Project Structure Quick Reference

```
src/
├── components/       # Reusable UI components
├── pages/           # Route pages
├── admin/           # Admin pages
├── services/        # API services
├── hooks/           # Custom hooks
├── App.jsx          # Main app
└── main.jsx         # Entry point
```

## 🚀 Deployment Quick Steps

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 📊 Useful SQL Queries

### Get Category Stats
```sql
SELECT 
  c.name,
  COUNT(w.id) as wallpaper_count
FROM categories c
LEFT JOIN wallpapers w ON c.id = w.category_id
GROUP BY c.id, c.name
ORDER BY wallpaper_count DESC;
```

### Get Popular Wallpapers
```sql
SELECT title, downloads, resolution
FROM wallpapers
WHERE downloads > 0
ORDER BY downloads DESC
LIMIT 20;
```

### Get Recent Uploads
```sql
SELECT title, created_at
FROM wallpapers
ORDER BY created_at DESC
LIMIT 10;
```

## 🎯 Performance Tips

1. **Use thumbnails** for grid views
2. **Lazy load** images
3. **Cache queries** with TanStack Query
4. **Optimize images** before upload
5. **Use indexes** for database queries

## 🔐 Security Checklist

- [ ] Environment variables set
- [ ] RLS policies enabled
- [ ] Admin routes protected
- [ ] Storage bucket configured
- [ ] API keys secured

## 📝 Quick Notes

- Default port: `5173`
- Database: PostgreSQL (Supabase)
- Storage: Supabase Storage
- Auth: Supabase Auth
- External API: TMDB

## 🆘 Emergency Commands

### Reset Database
```sql
-- WARNING: This deletes all data!
TRUNCATE wallpapers, categories, media, title_logos, favorites CASCADE;
```

### Backup Database
```bash
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

### Restore Database
```bash
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

---

## 📚 More Information

- Full documentation: `README.md`
- Setup guide: `SETUP.md`
- API reference: `API.md`
- Deployment: `DEPLOYMENT.md`
- Features: `FEATURES.md`

---

**Keep this guide handy for quick reference! 📌**
