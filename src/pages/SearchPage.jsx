import { Link, useSearchParams } from 'react-router-dom';
import { useWallpapers } from '../hooks/useWallpapers';
import { useSearchMedia } from '../hooks/useMedia';
import WallpaperCard from '../components/WallpaperCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: wallpapers = [], isLoading: loadingWallpapers } = useWallpapers({ search: query });
  const { data: media = [], isLoading: loadingMedia } = useSearchMedia(query);

  const isLoading = loadingWallpapers || loadingMedia;
  const totalResults = wallpapers.length + media.length;

  return (
    <div className="section-wrap py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search Results</h1>
        <p className="muted">
          {query ? `Showing results for "${query}"` : 'Type to search'}
          {query && ` - ${media.length} movies/series, ${wallpapers.length} wallpapers`}
        </p>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {media.length > 0 && (
            <section className="mb-10">
              <h2 className="surface-title">Movies & Series</h2>
              <div className="row-scroll scrollbar-hide">
                {media.map((item) => (
                  <Link key={item.id} to={`/${item.type}/${item.id}`} className="group block snap-card flex-shrink-0 w-[70%] sm:w-[48%] md:w-[34%] lg:w-[26%] xl:w-[21%]">
                    <article className="media-card">
                      <div className="aspect-[2/3] overflow-hidden relative">
                        <img
                          src={item.poster || item.backdrop}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        <p className="text-sm text-slate-300 capitalize mt-1">{item.type === 'tv' ? 'Series' : 'Movie'}</p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {wallpapers.length > 0 && (
            <section>
              <h2 className="surface-title">Wallpapers</h2>
              <div className="grid grid-cols-2 max-[380px]:grid-cols-1 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
                {wallpapers.map((wallpaper) => (
                  <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {!isLoading && totalResults === 0 && (
        <div className="text-center py-12 text-gray-400">
          No movies, series, or wallpapers found for your search
        </div>
      )}
    </div>
  );
};

export default SearchPage;
