import { useParams } from 'react-router-dom';
import { useMediaById, useMediaWallpapers } from '../hooks/useMedia';
import WallpaperCard from '../components/WallpaperCard';
import TitleLogoCard from '../components/TitleLogoCard';

const MoviePage = () => {
  const { id } = useParams();
  const { data: media, isLoading } = useMediaById(id);
  const { data: wallpapers } = useMediaWallpapers(id);

  if (isLoading) {
    return <div className="section-wrap py-8">Loading...</div>;
  }

  if (!media) {
    return <div className="section-wrap py-8">Media not found</div>;
  }

  return (
    <div className="section-wrap py-8">
      <div className="mb-8">
        {media.backdrop && (
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-6 border border-white/10">
            <img
              src={media.backdrop}
              alt={media.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-start gap-6">
          {media.poster && (
            <img
              src={media.poster}
              alt={media.title}
              loading="lazy"
              className="w-32 h-48 sm:w-40 sm:h-56 object-cover rounded-xl border border-white/10 mx-auto md:mx-0"
            />
          )}
          <div className="flex-1 w-full">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{media.title}</h1>
            <p className="muted capitalize mb-4">{media.type}</p>

            {media.title_logos && media.title_logos.length > 0 && (
              <div className="row-scroll scrollbar-hide">
                {media.title_logos.map((logo) => (
                  <div key={logo.id} className="flex-shrink-0 w-[90%] sm:w-[62%] md:w-[48%] lg:w-[40%] xl:w-[32%]">
                    <TitleLogoCard media={media} logo={logo} showDownload />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Wallpapers</h2>
        {wallpapers && wallpapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
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
