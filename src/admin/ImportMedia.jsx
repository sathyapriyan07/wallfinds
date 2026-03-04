import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import { searchMovies, searchTVShows, getMovieLogos, getTVLogos, getImageUrl } from '../services/tmdbApi';
import { useCreateMedia, useCreateTitleLogos, useMedia, useUpdateTitleLogo } from '../hooks/useMedia';

const ImportMedia = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedLogoPaths, setSelectedLogoPaths] = useState([]);
  const [logoTelegramLinks, setLogoTelegramLinks] = useState({});
  const [existingLogoLinks, setExistingLogoLinks] = useState({});
  const [savingLogoId, setSavingLogoId] = useState(null);
  const [importing, setImporting] = useState(false);

  const { data: existingMedia = [] } = useMedia();
  const createMedia = useCreateMedia();
  const createTitleLogos = useCreateTitleLogos();
  const updateTitleLogo = useUpdateTitleLogo();

  const logosQuery = useQuery({
    queryKey: ['tmdb-logos', searchType, selectedMedia?.id],
    queryFn: async () => {
      if (!selectedMedia?.id) return [];
      return searchType === 'movie'
        ? getMovieLogos(selectedMedia.id)
        : getTVLogos(selectedMedia.id);
    },
    enabled: !!selectedMedia?.id,
    staleTime: 10 * 60 * 1000,
  });

  const logos = useMemo(() => logosQuery.data || [], [logosQuery.data]);

  const selectedLogos = useMemo(() => {
    const selectedSet = new Set(selectedLogoPaths);
    return logos.filter((logo) => selectedSet.has(logo.file_path));
  }, [logos, selectedLogoPaths]);

  const getLogoLink = (logo) => logo.telegram_file_link || logo.telegram_download_link || '';

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setSelectedMedia(null);
    setSelectedLogoPaths([]);
    setSearchError('');
    setHasSearched(true);
    setSearchLoading(true);

    const runSearch = async () => {
      try {
        const results = searchType === 'movie'
          ? await searchMovies(trimmedQuery)
          : await searchTVShows(trimmedQuery);
        setSearchResults(results || []);
      } catch {
        setSearchResults([]);
        setSearchError('Failed to fetch TMDB results');
      } finally {
        setSearchLoading(false);
      }
    };

    runSearch();
  };

  const handleSelectMedia = (media) => {
    setSelectedMedia(media);
    setSelectedLogoPaths([]);
    setLogoTelegramLinks({});
  };

  const toggleLogoSelection = (filePath) => {
    setSelectedLogoPaths((prev) => {
      if (prev.includes(filePath)) {
        return prev.filter((path) => path !== filePath);
      }
      return [...prev, filePath];
    });
  };

  const handleImportSelected = async () => {
    if (!selectedMedia || selectedLogos.length === 0) {
      return;
    }

    const missingLinks = selectedLogos.filter(
      (logo) => !logoTelegramLinks[logo.file_path]?.trim()
    );
    if (missingLinks.length > 0) {
      alert('Please add Telegram download links for all selected logos.');
      return;
    }

    setImporting(true);
    try {
      const existingEntry = existingMedia.find(
        (media) => media.tmdb_id === selectedMedia.id && media.type === searchType
      );

      const mediaRecord = existingEntry
        ? existingEntry
        : await createMedia.mutateAsync({
            tmdb_id: selectedMedia.id,
            title: selectedMedia.title || selectedMedia.name,
            type: searchType,
            poster: getImageUrl(selectedMedia.poster_path, 'w500'),
            backdrop: getImageUrl(selectedMedia.backdrop_path, 'original'),
          });

      const existingUrls = new Set((mediaRecord.title_logos || []).map((logo) => logo.logo_url));

      const logosToInsert = selectedLogos
        .map((logo) => ({
          media_id: mediaRecord.id,
          logo_url: getImageUrl(logo.file_path, 'original'),
          telegram_file_link: logoTelegramLinks[logo.file_path]?.trim() || null,
          language: logo.iso_639_1,
          width: logo.width,
          height: logo.height,
        }))
        .filter((logo) => !existingUrls.has(logo.logo_url));

      if (logosToInsert.length === 0) {
        alert('These selected logos are already imported for this media.');
        return;
      }

      await createTitleLogos.mutateAsync(logosToInsert);

      alert(`Imported ${logosToInsert.length} title logo(s) successfully.`);
      setSelectedMedia(null);
      setSelectedLogoPaths([]);
      setLogoTelegramLinks({});
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
    } catch (error) {
      alert(`Error importing logos: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleSaveExistingLogoLink = async (logoId) => {
    const nextLink = (existingLogoLinks[logoId] || '').trim();
    setSavingLogoId(logoId);
    try {
      await updateTitleLogo.mutateAsync({
        id: logoId,
        updates: { telegram_file_link: nextLink || null },
      });
    } catch (error) {
      alert(`Failed to save Telegram file link: ${error.message}`);
    } finally {
      setSavingLogoId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Import Movies & Series</h1>

      <div className="glass p-6 rounded-lg mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <select
              value={searchType}
              onChange={(event) => setSearchType(event.target.value)}
              className="w-full md:w-auto px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
            >
              <option value="movie">Movie</option>
              <option value="tv">TV Series</option>
            </select>

            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search movie or series..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={searchLoading}
              className="w-full md:w-auto px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {searchLoading && <p className="mb-6">Loading...</p>}
      {searchError && <p className="text-red-400 mb-6">{searchError}</p>}

      {searchResults.length > 0 && !selectedMedia && (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {searchResults.map((media) => (
              <div key={media.id} className="glass rounded-lg overflow-hidden">
                <img
                  src={getImageUrl(media.poster_path, 'w300')}
                  alt={media.title || media.name}
                  loading="lazy"
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold truncate">{media.title || media.name}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    {(media.release_date || media.first_air_date || '').slice(0, 4)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectMedia(media)}
                    className="w-full px-3 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 text-sm font-medium"
                  >
                    Import
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchLoading && !searchError && hasSearched && searchResults.length === 0 && !selectedMedia && (
        <p className="text-gray-400">No results found for this search.</p>
      )}

      {selectedMedia && (
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setSelectedMedia(null);
                setSelectedLogoPaths([]);
                setLogoTelegramLinks({});
              }}
              className="text-purple-400 hover:text-purple-300"
            >
              Back to results
            </button>
            <button
              onClick={handleImportSelected}
              disabled={selectedLogoPaths.length === 0 || importing}
              className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {importing
                ? 'Importing...'
                : `Import ${selectedLogoPaths.length} Selected Logo${selectedLogoPaths.length === 1 ? '' : 's'}`}
            </button>
          </div>

          <h2 className="text-xl font-bold mb-2">
            Select Logos for "{selectedMedia.title || selectedMedia.name}"
          </h2>
          <p className="text-gray-400 mb-4">
            Only selected logos will be imported from TMDB original image URLs.
          </p>

          {logosQuery.isLoading ? (
            <p>Loading logos...</p>
          ) : logosQuery.isError ? (
            <p className="text-red-400">Error fetching logos: {logosQuery.error.message}</p>
          ) : logos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {logos.map((logo) => {
                const selected = selectedLogoPaths.includes(logo.file_path);
                return (
                  <button
                    type="button"
                    key={logo.file_path}
                    onClick={() => toggleLogoSelection(logo.file_path)}
                    className={`glass p-4 rounded-xl border transition text-left ${
                      selected ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {selected ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                        <span className="text-sm">{logo.iso_639_1 || 'n/a'}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {logo.width}x{logo.height}
                      </span>
                    </div>

                    <div className="h-20 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center mb-3">
                      <img
                        src={getImageUrl(logo.file_path, 'original')}
                        alt="TMDB title logo preview"
                        loading="lazy"
                        className="max-w-full max-h-16 object-contain"
                      />
                    </div>

                    <input
                      type="url"
                      value={logoTelegramLinks[logo.file_path] || ''}
                      onChange={(event) =>
                        setLogoTelegramLinks((prev) => ({
                          ...prev,
                          [logo.file_path]: event.target.value,
                        }))
                      }
                      placeholder="https://t.me/channel_name/123"
                      className="w-full mb-3 px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg"
                      onClick={(event) => event.stopPropagation()}
                    />

                    <p className="text-xs text-gray-400 truncate">{logo.file_path}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No logos found for this {searchType}</p>
          )}
        </div>
      )}

      {existingMedia.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Imported Media</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {existingMedia.map((media) => (
              <div key={media.id} className="glass rounded-lg overflow-hidden">
                <img
                  src={media.poster}
                  alt={media.title}
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold truncate">{media.title}</p>
                  <p className="text-xs text-gray-400 capitalize">{media.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{media.title_logos?.length || 0} logo(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {existingMedia.some((media) => media.title_logos?.length) && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Manage Imported Logo Links</h2>
          <div className="space-y-6">
            {existingMedia
              .filter((media) => media.title_logos?.length)
              .map((media) => (
                <section key={media.id} className="glass p-4 rounded-xl">
                  <h3 className="font-semibold mb-4">{media.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {media.title_logos.map((logo) => {
                      const inputValue = existingLogoLinks[logo.id] ?? getLogoLink(logo);
                      return (
                        <article key={logo.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                          <div className="h-20 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center mb-3">
                            <img
                              src={logo.logo_url}
                              alt={`${media.title} logo`}
                              loading="lazy"
                              className="max-w-full max-h-16 object-contain"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mb-2">
                            Language: {logo.language || 'n/a'} | {logo.width}x{logo.height}
                          </p>
                          <label htmlFor={`logo-link-${logo.id}`} className="text-xs text-gray-300 mb-1 block">
                            Telegram File Link
                          </label>
                          <input
                            id={`logo-link-${logo.id}`}
                            type="url"
                            value={inputValue}
                            onChange={(event) =>
                              setExistingLogoLinks((prev) => ({
                                ...prev,
                                [logo.id]: event.target.value,
                              }))
                            }
                            placeholder="https://t.me/channelname/120"
                            className="w-full mb-3 px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveExistingLogoLink(logo.id)}
                            disabled={savingLogoId === logo.id}
                            className="w-full px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-sm font-medium disabled:opacity-50"
                          >
                            {savingLogoId === logo.id ? 'Saving...' : 'Save Link'}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportMedia;
