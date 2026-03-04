import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiTag } from 'react-icons/fi';
import { useWallpaper, useWallpapers, useIncrementDownload } from '../hooks/useWallpapers';
import WallpaperCard from '../components/WallpaperCard';
import { normalizeTmdbToOriginal } from '../utils/imageUrl';

const WallpaperDetail = () => {
  const { id } = useParams();
  const { data: wallpaper, isLoading } = useWallpaper(id);
  const { data: relatedWallpapers } = useWallpapers({ 
    category: wallpaper?.category_id, 
    limit: 4 
  });
  const incrementDownload = useIncrementDownload();
  const [actualResolution, setActualResolution] = useState('');

  const fullQualityImageUrl = wallpaper?.image_url ? normalizeTmdbToOriginal(wallpaper.image_url) : '';
  const displayResolution = actualResolution || wallpaper?.resolution;

  const triggerDownload = (href, filename) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    const extension = fullQualityImageUrl.toLowerCase().includes('.png') ? 'png' : 'jpg';
    const fileName = `${wallpaper.title}.${extension}`;

    try {
      const response = await fetch(fullQualityImageUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      triggerDownload(objectUrl, fileName);
      URL.revokeObjectURL(objectUrl);
    } catch {
      triggerDownload(fullQualityImageUrl, fileName);
    }

    await incrementDownload.mutateAsync(wallpaper.id);
  };

  if (isLoading) {
    return <div className="section-wrap px-4 py-8">Loading...</div>;
  }

  if (!wallpaper) {
    return <div className="section-wrap px-4 py-8">Wallpaper not found</div>;
  }

  return (
    <div className="section-wrap px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={fullQualityImageUrl}
            alt={wallpaper.title}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (naturalWidth && naturalHeight) {
                setActualResolution(`${naturalWidth}x${naturalHeight}`);
              }
            }}
            className="w-full rounded-2xl border border-white/10"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{wallpaper.title}</h1>
            <p className="text-gray-400">Category: {wallpaper.categories?.name}</p>
          </div>

          <div className="glass p-4 rounded-2xl space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Resolution</span>
              <span className="font-semibold">{displayResolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Downloads</span>
              <span className="font-semibold">{wallpaper.downloads || 0}</span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-3 btn-primary rounded-xl flex items-center justify-center gap-2 transition"
          >
            <FiDownload size={20} />
            Download Wallpaper
          </button>

          {wallpaper.tags && wallpaper.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FiTag /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {wallpaper.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedWallpapers && relatedWallpapers.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Wallpapers</h2>
          <div className="flex flex-wrap gap-4">
            {relatedWallpapers
              .filter(w => w.id !== wallpaper.id)
              .slice(0, 4)
              .map((w) => (
                <WallpaperCard key={w.id} wallpaper={w} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WallpaperDetail;
