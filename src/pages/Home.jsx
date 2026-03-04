import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useWallpapers } from '../hooks/useWallpapers';
import { useCategories } from '../hooks/useCategories';
import { useMedia } from '../hooks/useMedia';
import WallpaperCard from '../components/WallpaperCard';
import CategoryCard from '../components/CategoryCard';
import TitleLogoCard from '../components/TitleLogoCard';

const Home = () => {
  const { data: latestWallpapers = [] } = useWallpapers({ limit: 12 });
  const { data: allWallpapers = [] } = useWallpapers();
  const { data: categories = [] } = useCategories();
  const { data: media = [] } = useMedia();

  const trendingWallpapers = useMemo(() => {
    return [...allWallpapers]
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, 12);
  }, [allWallpapers]);

  const heroWallpaper = latestWallpapers[0] || allWallpapers[0];

  return (
    <div className="section-wrap px-4 py-8 space-y-12">
      {heroWallpaper && (
        <section className="relative h-[58vh] min-h-[360px] rounded-3xl overflow-hidden border border-white/10">
          <img
            src={heroWallpaper.image_url}
            alt={heroWallpaper.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060d] via-transparent to-transparent" />

          <div className="relative h-full max-w-2xl px-8 md:px-12 flex flex-col justify-end pb-12">
            <p className="small-label uppercase tracking-[0.2em] text-indigo-200/90 mb-2">Featured Wallpaper</p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-4">{heroWallpaper.title}</h1>
            <p className="muted mb-6 max-w-xl">
              Explore cinematic wallpapers, title logos, and category collections crafted in a premium streaming style.
            </p>
            <div className="flex gap-3">
              <Link to={`/wallpaper/${heroWallpaper.id}`} className="btn-primary">
                View Wallpaper
              </Link>
              <Link to="/search" className="btn-soft">
                Explore Library
              </Link>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="surface-title">Latest Wallpapers</h2>
        <div className="row-scroll scrollbar-hide">
          {latestWallpapers.map((wallpaper) => (
            <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="surface-title">Trending Wallpapers</h2>
        <div className="row-scroll scrollbar-hide">
          {trendingWallpapers.map((wallpaper) => (
            <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
          ))}
        </div>
      </section>

      {media.length > 0 && (
        <section>
          <h2 className="surface-title">Movie & Series Logos</h2>
          <div className="row-scroll scrollbar-hide">
            {media.map((item) => (
              <TitleLogoCard key={item.id} media={item} showPoster />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="surface-title">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
