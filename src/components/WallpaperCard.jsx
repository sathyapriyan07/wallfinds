import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import { useIncrementDownload } from '../hooks/useWallpapers';
import { useSiteSettingsContext } from '../hooks/useSiteSettingsContext';
import { downloadWithOptionalTelegramRedirect } from '../utils/download';
import { normalizeTmdbToOriginal } from '../utils/imageUrl';

const sanitizeFilename = (value) => {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const WallpaperCard = ({ wallpaper }) => {
  const incrementDownload = useIncrementDownload();
  const { settings } = useSiteSettingsContext();

  const handleDownload = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const fullQualityUrl = normalizeTmdbToOriginal(wallpaper.image_url);
    const extension = fullQualityUrl.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const safeTitle = sanitizeFilename(wallpaper.title || 'wallpaper');
    const filename = `${safeTitle}-wallpaper.${extension}`;

    await downloadWithOptionalTelegramRedirect({
      url: fullQualityUrl,
      filename,
      settings,
    });

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
            className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 transition text-sm font-medium inline-flex items-center justify-center gap-2"
          >
            <FiDownload size={14} />
            Download Wallpaper
          </button>
        </div>
      </article>
    </Link>
  );
};

export default WallpaperCard;
