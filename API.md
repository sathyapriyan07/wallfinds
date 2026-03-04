# API Documentation

## Supabase Database API

### Wallpapers

#### Get All Wallpapers
```javascript
const { data, error } = await supabase
  .from('wallpapers')
  .select('*, categories(name, slug)')
  .order('created_at', { ascending: false });
```

#### Get Wallpaper by ID
```javascript
const { data, error } = await supabase
  .from('wallpapers')
  .select('*, categories(name, slug)')
  .eq('id', wallpaperId)
  .single();
```

#### Get Wallpapers by Category
```javascript
const { data, error } = await supabase
  .from('wallpapers')
  .select('*, categories(name, slug)')
  .eq('category_id', categoryId);
```

#### Search Wallpapers
```javascript
const { data, error } = await supabase
  .from('wallpapers')
  .select('*, categories(name, slug)')
  .or(`title.ilike.%${query}%,tags.cs.{${query}}`);
```

#### Create Wallpaper (Admin)
```javascript
const { data, error } = await supabase
  .from('wallpapers')
  .insert({
    title: 'Wallpaper Title',
    image_url: 'https://...',
    thumbnail_url: 'https://...',
    category_id: 'uuid',
    tags: ['tag1', 'tag2'],
    resolution: '1920x1080',
    featured: false
  })
  .select()
  .single();
```

#### Update Wallpaper (Admin)
```javascript
const { data, error } = await supabase
  .from('wallpapers')
  .update({ title: 'New Title' })
  .eq('id', wallpaperId)
  .select()
  .single();
```

#### Delete Wallpaper (Admin)
```javascript
const { error } = await supabase
  .from('wallpapers')
  .delete()
  .eq('id', wallpaperId);
```

#### Increment Downloads
```javascript
const { error } = await supabase
  .rpc('increment_downloads', { wallpaper_id: wallpaperId });
```

### Categories

#### Get All Categories
```javascript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .order('name');
```

#### Get Category by Slug
```javascript
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .eq('slug', slug)
  .single();
```

#### Create Category (Admin)
```javascript
const { data, error } = await supabase
  .from('categories')
  .insert({
    name: 'Category Name',
    slug: 'category-slug',
    cover_image: 'https://...'
  })
  .select()
  .single();
```

### Media (Movies/Series)

#### Get All Media
```javascript
const { data, error } = await supabase
  .from('media')
  .select('*, title_logos(*)')
  .order('created_at', { ascending: false });
```

#### Get Media by ID
```javascript
const { data, error } = await supabase
  .from('media')
  .select('*, title_logos(*)')
  .eq('id', mediaId)
  .single();
```

#### Get Wallpapers by Media
```javascript
const { data, error } = await supabase
  .from('wallpapers')
  .select('*, categories(name, slug)')
  .eq('media_id', mediaId);
```

#### Create Media (Admin)
```javascript
const { data, error } = await supabase
  .from('media')
  .insert({
    tmdb_id: 12345,
    title: 'Movie Title',
    type: 'movie', // or 'tv'
    poster: 'https://...',
    backdrop: 'https://...'
  })
  .select()
  .single();
```

#### Create Title Logo (Admin)
```javascript
const { data, error } = await supabase
  .from('title_logos')
  .insert({
    media_id: 'uuid',
    logo_url: 'https://...',
    language: 'en',
    width: 500,
    height: 200
  })
  .select()
  .single();
```

### Authentication

#### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign Out
```javascript
const { error } = await supabase.auth.signOut();
```

#### Get Current User
```javascript
const { data: { user } } = await supabase.auth.getUser();
```

### Storage

#### Upload File
```javascript
const { data, error } = await supabase.storage
  .from('wallpapers')
  .upload('full/filename.jpg', file);
```

#### Get Public URL
```javascript
const { data } = supabase.storage
  .from('wallpapers')
  .getPublicUrl('full/filename.jpg');

const publicUrl = data.publicUrl;
```

#### Delete File
```javascript
const { error } = await supabase.storage
  .from('wallpapers')
  .remove(['full/filename.jpg']);
```

## TMDB API

### Search Movies
```javascript
import { searchMovies } from './services/tmdbApi';

const results = await searchMovies('Interstellar');
```

### Search TV Shows
```javascript
import { searchTVShows } from './services/tmdbApi';

const results = await searchTVShows('Breaking Bad');
```

### Get Movie Details
```javascript
import { getMovieDetails } from './services/tmdbApi';

const movie = await getMovieDetails(157336); // Interstellar
```

### Get TV Details
```javascript
import { getTVDetails } from './services/tmdbApi';

const show = await getTVDetails(1396); // Breaking Bad
```

### Get Movie Logos
```javascript
import { getMovieLogos } from './services/tmdbApi';

const logos = await getMovieLogos(157336);
```

### Get TV Logos
```javascript
import { getTVLogos } from './services/tmdbApi';

const logos = await getTVLogos(1396);
```

### Get Trending Movies
```javascript
import { getTrendingMovies } from './services/tmdbApi';

const trending = await getTrendingMovies();
```

### Get Trending TV
```javascript
import { getTrendingTV } from './services/tmdbApi';

const trending = await getTrendingTV();
```

### Get Image URL
```javascript
import { getImageUrl } from './services/tmdbApi';

const url = getImageUrl('/path/to/image.jpg', 'w500');
// Available sizes: w300, w500, w780, original
```

## Custom Hooks

### useWallpapers
```javascript
import { useWallpapers } from './hooks/useWallpapers';

// Get all wallpapers
const { data, isLoading, error } = useWallpapers();

// With filters
const { data } = useWallpapers({ 
  category: categoryId,
  search: 'nature',
  featured: true,
  limit: 10
});
```

### useWallpaper
```javascript
import { useWallpaper } from './hooks/useWallpapers';

const { data: wallpaper, isLoading } = useWallpaper(wallpaperId);
```

### useCategories
```javascript
import { useCategories } from './hooks/useCategories';

const { data: categories, isLoading } = useCategories();
```

### useCategory
```javascript
import { useCategory } from './hooks/useCategories';

const { data: category } = useCategory('nature');
```

### useMedia
```javascript
import { useMedia } from './hooks/useMedia';

const { data: media, isLoading } = useMedia();
```

### useMediaById
```javascript
import { useMediaById } from './hooks/useMedia';

const { data: media } = useMediaById(mediaId);
```

### useMediaWallpapers
```javascript
import { useMediaWallpapers } from './hooks/useMedia';

const { data: wallpapers } = useMediaWallpapers(mediaId);
```

### useAuth
```javascript
import { useAuth } from './hooks/useAuth';

const { user, loading } = useAuth();
```

### useIsAdmin
```javascript
import { useIsAdmin } from './hooks/useAuth';

const { isAdmin, loading } = useIsAdmin();
```

## Mutations

### Create Wallpaper
```javascript
import { useCreateWallpaper } from './hooks/useWallpapers';

const createWallpaper = useCreateWallpaper();

await createWallpaper.mutateAsync({
  title: 'New Wallpaper',
  image_url: 'https://...',
  thumbnail_url: 'https://...',
  category_id: 'uuid',
  tags: ['tag1', 'tag2'],
  resolution: '1920x1080'
});
```

### Update Wallpaper
```javascript
import { useUpdateWallpaper } from './hooks/useWallpapers';

const updateWallpaper = useUpdateWallpaper();

await updateWallpaper.mutateAsync({
  id: wallpaperId,
  updates: { title: 'Updated Title' }
});
```

### Delete Wallpaper
```javascript
import { useDeleteWallpaper } from './hooks/useWallpapers';

const deleteWallpaper = useDeleteWallpaper();

await deleteWallpaper.mutateAsync(wallpaperId);
```

### Increment Download
```javascript
import { useIncrementDownload } from './hooks/useWallpapers';

const incrementDownload = useIncrementDownload();

await incrementDownload.mutateAsync(wallpaperId);
```

## Error Handling

All queries and mutations return error objects:

```javascript
const { data, error, isLoading } = useWallpapers();

if (error) {
  console.error('Error:', error.message);
}
```

For mutations:

```javascript
try {
  await createWallpaper.mutateAsync(data);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Rate Limits

- **Supabase**: Based on your plan
- **TMDB API**: 40 requests per 10 seconds

## Best Practices

1. Use TanStack Query for caching
2. Handle loading and error states
3. Implement optimistic updates for better UX
4. Use proper TypeScript types (if using TS)
5. Validate data before mutations
6. Handle file uploads with progress indicators
7. Implement proper error boundaries
