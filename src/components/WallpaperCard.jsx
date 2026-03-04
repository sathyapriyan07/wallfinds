import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';

const WallpaperCard = ({ wallpaper }) => {
  return (
    <Link to={`/wallpaper/${wallpaper.id}`} className="group block flex-shrink-0 w-[290px]">
      <article className="media-card relative">
        <div className="relative h-[175px] overflow-hidden">
          <img
            src={wallpaper.thumbnail_url}
            alt={wallpaper.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 border border-white/20 opacity-0 group-hover:opacity-100 transition">
            <FiDownload size={14} />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-base truncate">{wallpaper.title}</h3>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200">
              {wallpaper.categories?.name || 'Uncategorized'}
            </span>
            <span className="text-slate-300">{wallpaper.resolution}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default WallpaperCard;
