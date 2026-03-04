import { useParams } from 'react-router-dom';
import { useCategory } from '../hooks/useCategories';
import { useWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/WallpaperCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const { data: category } = useCategory(slug);
  const { data: wallpapers, isLoading } = useWallpapers({ 
    category: category?.id 
  });

  if (isLoading) {
    return <div className="section-wrap py-8">Loading...</div>;
  }

  return (
    <div className="section-wrap py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category?.name}</h1>
        <p className="muted">{wallpapers?.length || 0} wallpapers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {wallpapers?.map((wallpaper) => (
          <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
        ))}
      </div>

      {wallpapers?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No wallpapers found in this category
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
