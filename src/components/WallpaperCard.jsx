import { Link } from 'react-router-dom';

const WallpaperCard = ({ wallpaper }) => {
  return (
    <Link to={`/wallpaper/${wallpaper.id}`} className="group block snap-card w-full">
      <article className="media-card relative">
        <div className="relative aspect-[3/4] sm:aspect-video overflow-hidden">
          <img
            src={wallpaper.thumbnail_url}
            alt={wallpaper.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm truncate">{wallpaper.title}</h3>
          {wallpaper.resolution && <p className="text-xs text-slate-300 mt-1">{wallpaper.resolution}</p>}
        </div>
      </article>
    </Link>
  );
};

export default WallpaperCard;
