import { useParams } from 'react-router-dom';
import { useMediaById, useMediaWallpapers } from '../hooks/useMedia';
import WallpaperCard from '../components/WallpaperCard';
import TitleLogoCard from '../components/TitleLogoCard';

const MoviePage = () => {
  const { id } = useParams();
  const { data: media, isLoading } = useMediaById(id);
  const { data: wallpapers } = useMediaWallpapers(id);

  if (isLoading) {
    return <div className="section-wrap px-4 py-8">Loading...</div>;
  }

  if (!media) {
    return <div className="section-wrap px-4 py-8">Media not found</div>;
  }

  return (
    <div className="section-wrap px-4 py-8">
      <div className="mb-8">
        {media.backdrop && (
          <div className="relative h-96 rounded-2xl overflow-hidden mb-6 border border-white/10">
            <img
              src={media.backdrop}
              alt={media.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          </div>
        )}
        
        <div className="flex items-start gap-6">
          {media.poster && (
            <img
              src={media.poster}
              alt={media.title}
              loading="lazy"
              className="w-32 h-48 object-cover rounded-xl border border-white/10"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{media.title}</h1>
            <p className="muted capitalize mb-4">{media.type}</p>

            {media.title_logos && media.title_logos.length > 0 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {media.title_logos.map((logo) => (
                  <TitleLogoCard key={logo.id} media={media} logo={logo} showDownload />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Wallpapers</h2>
        {wallpapers && wallpapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wallpapers.map((wallpaper) => (
              <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No wallpapers available for this {media.type}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
