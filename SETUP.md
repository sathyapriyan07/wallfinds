# WallFinds Setup Guide

## Step-by-Step Setup Instructions

### 1. Supabase Setup

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created

#### Setup Database
1. Go to SQL Editor in Supabase Dashboard
2. Click "New Query"
3. Copy entire contents of `supabase-schema.sql`
4. Paste and run the query
5. Verify all tables are created in Table Editor

#### Setup Storage
1. Go to Storage in Supabase Dashboard
2. Click "Create Bucket"
3. Name: `wallpapers`
4. Make it public
5. Click inside the bucket
6. Create two folders:
   - `full` (for full-resolution images)
   - `thumbnails` (for thumbnail images)

#### Get API Keys
1. Go to Project Settings > API
2. Copy `Project URL` (VITE_SUPABASE_URL)
3. Copy `anon public` key (VITE_SUPABASE_ANON_KEY)

### 2. TMDB API Setup

1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Create an account
3. Go to Settings > API
4. Request an API key
5. Fill in the application form
6. Copy your API Key (v3 auth)

### 3. Environment Configuration

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_TMDB_API_KEY=your-tmdb-api-key-here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Create Admin User

#### Option A: Through the App
1. Start the dev server: `npm run dev`
2. Go to `/signup`
3. Create an account
4. Go to Supabase Dashboard > Table Editor > users
5. Find your user and change `role` from `user` to `admin`

#### Option B: Direct SQL
```sql
-- First, sign up through the app, then run:
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 6. Add Sample Data (Optional)

#### Add Categories
```sql
INSERT INTO categories (name, slug, cover_image) VALUES
('Nature', 'nature', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'),
('Space', 'space', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a'),
('Gaming', 'gaming', 'https://images.unsplash.com/photo-1511512578047-dfb367046420'),
('Cars', 'cars', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7'),
('Abstract', 'abstract', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1');
```

### 7. Start Development

```bash
npm run dev
```

Visit `http://localhost:5173`

## Common Issues & Solutions

### Issue: "Invalid API key" error
**Solution:** Check that your `.env` file has correct keys and restart dev server

### Issue: "Permission denied" when uploading
**Solution:** Verify storage bucket is public and RLS policies are set correctly

### Issue: "Cannot read properties of undefined"
**Solution:** Ensure database schema is fully created and tables exist

### Issue: Admin routes redirect to home
**Solution:** Verify user role is set to 'admin' in users table

### Issue: TMDB search not working
**Solution:** Check TMDB API key is valid and has proper permissions

## Testing the Application

### Test User Features
1. Browse homepage
2. Search for wallpapers
3. Click on a wallpaper to view details
4. Download a wallpaper
5. Browse by category

### Test Admin Features
1. Login as admin
2. Add a new category
3. Upload a wallpaper
4. Search and import a movie from TMDB
5. Mark a wallpaper as featured

## Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify Deployment
1. Push code to GitHub
2. New site from Git
3. Add environment variables
4. Deploy

### Environment Variables for Production
```
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_TMDB_API_KEY=your_tmdb_key
```

## Performance Optimization

### Image Optimization
- Use WebP format when possible
- Compress images before upload
- Use appropriate thumbnail sizes

### Caching
- TanStack Query handles caching automatically
- Adjust staleTime in App.jsx if needed

### Database
- Indexes are already created in schema
- Monitor query performance in Supabase

## Security Checklist

- ✅ RLS policies enabled
- ✅ Admin routes protected
- ✅ Environment variables secured
- ✅ Storage bucket properly configured
- ✅ Auth tokens handled securely

## Next Steps

1. Customize the design
2. Add more categories
3. Import movies/series from TMDB
4. Upload wallpapers
5. Share with users!

## Support

For issues, check:
1. Browser console for errors
2. Supabase logs
3. Network tab for API calls
4. README.md for documentation

---

Happy building! 🚀
