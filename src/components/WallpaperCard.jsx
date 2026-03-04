import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import { useIncrementDownload } from '../hooks/useWallpapers';

const WallpaperCard = ({ wallpaper }) => {
  const incrementDownload = useIncrementDownload();

  const handleDownload = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!wallpaper.telegram_download_link) return;
    window.open(wallpaper.telegram_download_link, '_blank', 'noopener,noreferrer');

    await incrementDownload.mutateAsync(wallpaper.id);
  };

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
          <button
            type="button"
            onClick={handleDownload}
            disabled={!wallpaper.telegram_download_link}
            className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 transition text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload size={14} />
            Download Wallpaper
          </button>
          {!wallpaper.telegram_download_link && (
            <p className="text-xs text-slate-400 mt-2">Download link not available.</p>
          )}
        </div>
      </article>
    </Link>
  );
};

export default WallpaperCard;
