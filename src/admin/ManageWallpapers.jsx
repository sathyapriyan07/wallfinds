import { useState } from 'react';
import { FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useWallpapers, useCreateWallpaper, useUpdateWallpaper, useDeleteWallpaper } from '../hooks/useWallpapers';
import { useCategories } from '../hooks/useCategories';
import { useMedia } from '../hooks/useMedia';
import { deriveTmdbThumbnail, normalizeTmdbToOriginal } from '../utils/imageUrl';

const ManageWallpapers = () => {
  const { data: wallpapers } = useWallpapers();
  const { data: categories } = useCategories();
  const { data: mediaItems } = useMedia();
  const createWallpaper = useCreateWallpaper();
  const updateWallpaper = useUpdateWallpaper();
  const deleteWallpaper = useDeleteWallpaper();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    media_id: '',
    image_url: '',
    thumbnail_url: '',
    tags: '',
    resolution: '',
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState('');

  const getImageResolution = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('Missing URL'));
        return;
      }

      const img = new Image();
      img.onload = () => resolve(`${img.naturalWidth}x${img.naturalHeight}`);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  const autoSetResolution = async (url) => {
    if (!url) return '';
    const normalized = normalizeTmdbToOriginal(url);
    const resolution = await getImageResolution(normalized);
    setFormData((prev) => ({ ...prev, resolution }));
    return resolution;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setResolutionStatus('');

    try {
      const normalizedFullImageUrl = normalizeTmdbToOriginal(formData.image_url);
      const thumbnailFromFull = deriveTmdbThumbnail(normalizedFullImageUrl, 'w500');
      const normalizedThumbnailUrl = formData.thumbnail_url || thumbnailFromFull || normalizedFullImageUrl;

      setFormData((prev) => ({
        ...prev,
        image_url: normalizedFullImageUrl,
        thumbnail_url: normalizedThumbnailUrl,
      }));

      let calculatedResolution = formData.resolution;
      if (!calculatedResolution) {
        try {
          calculatedResolution = await autoSetResolution(normalizedFullImageUrl);
        } catch {
          if (normalizedThumbnailUrl) {
            calculatedResolution = await autoSetResolution(normalizedThumbnailUrl);
          }
        }
      }

      if (!calculatedResolution) {
        throw new Error('Unable to auto-calculate resolution from URLs. Please check image URL.');
      }

      const parsedTags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const wallpaperData = {
        ...formData,
        category_id: formData.category_id || null,
        media_id: formData.media_id || null,
        image_url: normalizedFullImageUrl,
        thumbnail_url: normalizedThumbnailUrl,
        resolution: calculatedResolution,
        tags: parsedTags.length > 0 ? parsedTags : null,
      };

      if (editingId) {
        await updateWallpaper.mutateAsync({ id: editingId, updates: wallpaperData });
      } else {
        await createWallpaper.mutateAsync(wallpaperData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', category_id: '', media_id: '', image_url: '', thumbnail_url: '', tags: '', resolution: '', featured: false });
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (wallpaper) => {
    setEditingId(wallpaper.id);
    setFormData({
      title: wallpaper.title,
      category_id: wallpaper.category_id,
      media_id: wallpaper.media_id || '',
      image_url: wallpaper.image_url,
      thumbnail_url: wallpaper.thumbnail_url,
      tags: wallpaper.tags?.join(', ') || '',
      resolution: wallpaper.resolution,
      featured: wallpaper.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this wallpaper?')) {
      await deleteWallpaper.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Wallpapers</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: '', category_id: '', media_id: '', image_url: '', thumbnail_url: '', tags: '', resolution: '', featured: false });
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <FiPlus /> Add Wallpaper
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Wallpaper</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="small-label text-sm">Title</span>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
            </label>

            <label className="space-y-2">
              <span className="small-label text-sm">Category (Optional)</span>
              <select
                value={formData.category_id}
                onChange={(event) => setFormData({ ...formData, category_id: event.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              >
                <option value="">Not linked</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="small-label text-sm">Movie / Series (Optional)</span>
              <select
                value={formData.media_id}
                onChange={(event) => setFormData({ ...formData, media_id: event.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              >
                <option value="">Not linked</option>
                {mediaItems?.map((media) => (
                  <option key={media.id} value={media.id}>
                    {media.title} ({media.type === 'tv' ? 'Series' : 'Movie'})
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="small-label text-sm">Full Image URL</span>
              <input
                type="url"
                value={formData.image_url}
                onChange={(event) => setFormData({ ...formData, image_url: event.target.value })}
                onBlur={async () => {
                  if (!formData.image_url) return;
                  const normalized = normalizeTmdbToOriginal(formData.image_url);
                  if (normalized !== formData.image_url) {
                    setFormData((prev) => ({ ...prev, image_url: normalized }));
                  }
                  setResolutionStatus('Calculating...');
                  try {
                    await autoSetResolution(normalized);
                    setResolutionStatus('Resolution detected');
                  } catch {
                    setResolutionStatus('Could not detect from Full Image URL');
                  }
                }}
                placeholder="https://..."
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
            </label>

            <label className="space-y-2">
              <span className="small-label text-sm">Thumbnail URL</span>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(event) => setFormData({ ...formData, thumbnail_url: event.target.value })}
                onBlur={async () => {
                  if (!formData.thumbnail_url || formData.resolution) return;
                  setResolutionStatus('Calculating...');
                  try {
                    await autoSetResolution(formData.thumbnail_url);
                    setResolutionStatus('Resolution detected');
                  } catch {
                    setResolutionStatus('Could not detect from Thumbnail URL');
                  }
                }}
                placeholder="https://..."
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
            </label>

            <label className="space-y-2">
              <span className="small-label text-sm">Resolution</span>
              <input
                type="text"
                value={formData.resolution}
                onChange={(event) => setFormData({ ...formData, resolution: event.target.value })}
                placeholder="Auto-calculated from image URL"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
              {resolutionStatus && <p className="text-xs text-slate-400">{resolutionStatus}</p>}
            </label>

            <label className="space-y-2">
              <span className="small-label text-sm">Tags</span>
              <input
                type="text"
                value={formData.tags}
                onChange={(event) => setFormData({ ...formData, tags: event.target.value })}
                placeholder="nature, landscape, mountains"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
              />
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(event) => setFormData({ ...formData, featured: event.target.checked })}
              />
              Featured
            </label>

            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-soft">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left">
          <thead className="bg-white/[0.04] border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-sm font-medium">Thumbnail</th>
              <th className="px-4 py-3 text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-sm font-medium">Category</th>
              <th className="px-4 py-3 text-sm font-medium">Movie/Series</th>
              <th className="px-4 py-3 text-sm font-medium">Downloads</th>
              <th className="px-4 py-3 text-sm font-medium">Resolution</th>
              <th className="px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallpapers?.map((wallpaper) => (
              <tr key={wallpaper.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <img src={wallpaper.thumbnail_url} alt={wallpaper.title} className="w-16 h-10 rounded object-cover" />
                </td>
                <td className="px-4 py-3 font-medium">{wallpaper.title}</td>
                <td className="px-4 py-3 text-slate-300">{wallpaper.categories?.name || '-'}</td>
                <td className="px-4 py-3 text-slate-300">
                  {mediaItems?.find((m) => m.id === wallpaper.media_id)?.title || '-'}
                </td>
                <td className="px-4 py-3 text-slate-300">{wallpaper.downloads || 0}</td>
                <td className="px-4 py-3 text-slate-300">{wallpaper.resolution}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(wallpaper)} className="btn-soft inline-flex items-center gap-1 px-3 py-1.5">
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(wallpaper.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-400/50 text-red-200 hover:bg-red-500/15"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageWallpapers;
