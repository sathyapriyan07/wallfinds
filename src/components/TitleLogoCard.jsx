import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import { useSiteSettingsContext } from '../hooks/useSiteSettingsContext';
import { downloadWithOptionalTelegramRedirect } from '../utils/download';

const sanitizeFilename = (value) => {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const downloadLogo = async (url, title, settings) => {
  const safeTitle = sanitizeFilename(title || 'media');
  const filename = `${safeTitle}-title-logo.png`;
  await downloadWithOptionalTelegramRedirect({ url, filename, settings });
};

const TitleLogoCard = ({ media, logo, showDownload = false, showPoster = false }) => {
  const { settings } = useSiteSettingsContext();
  const activeLogo = logo || media.title_logos?.[0];
  const mediaTitle = media.title || 'Untitled';
  const imageSrc = showPoster ? media.poster : activeLogo?.logo_url;

  const handleDownload = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!activeLogo?.logo_url) return;
    await downloadLogo(activeLogo.logo_url, mediaTitle, settings);
  };

  return (
    <Link to={`/${media.type}/${media.id}`} className="group block snap-card w-full">
      <article className={`relative ${showPoster ? 'h-[320px] sm:h-[360px]' : 'h-[170px]'} rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03] transition duration-300 group-hover:shadow-[0_12px_30px_rgba(86,117,255,0.25)] group-hover:border-indigo-300/45`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="h-full p-4 flex flex-col justify-between">
          <div className={`${showPoster ? 'h-[245px] sm:h-[280px]' : 'h-20'} rounded-xl bg-black/25 border border-white/5 flex items-center justify-center ${showPoster ? 'px-0 overflow-hidden' : 'px-4'}`}>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={showPoster ? `${mediaTitle} poster` : `${mediaTitle} logo`}
                loading="lazy"
                className={showPoster ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'}
              />
            ) : (
              <h3 className="text-xl font-semibold text-center">{mediaTitle}</h3>
            )}
          </div>

          <div>
            <p className="font-medium truncate mb-2">{mediaTitle}</p>
            {showDownload && !showPoster && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={!activeLogo?.logo_url}
                className="w-full py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <FiDownload size={14} />
                Download Logo
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default TitleLogoCard;
