import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiCheckSquare, FiSearch, FiSquare } from 'react-icons/fi';
import { searchMovies, searchTVShows, getMovieLogos, getTVLogos, getImageUrl } from '../services/tmdbApi';
import { useCreateMedia, useCreateTitleLogos, useMedia } from '../hooks/useMedia';

const ImportMedia = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedLogoPaths, setSelectedLogoPaths] = useState([]);
  const [importing, setImporting] = useState(false);

  const { data: existingMedia = [] } = useMedia();
  const createMedia = useCreateMedia();
  const createTitleLogos = useCreateTitleLogos();

  const searchResultsQuery = useQuery({
    queryKey: ['tmdb-search', searchType, submittedQuery],
    queryFn: async () => {
      if (!submittedQuery.trim()) return [];
      return searchType === 'movie'
        ? searchMovies(submittedQuery.trim())
        : searchTVShows(submittedQuery.trim());
    },
    enabled: !!submittedQuery.trim(),
    staleTime: 10 * 60 * 1000,
  });

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
  const searchResults = searchResultsQuery.data || [];

  const selectedLogos = useMemo(() => {
    const selectedSet = new Set(selectedLogoPaths);
    return logos.filter((logo) => selectedSet.has(logo.file_path));
  }, [logos, selectedLogoPaths]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSelectedMedia(null);
    setSelectedLogoPaths([]);
    setSubmittedQuery(searchQuery);
  };

  const handleSelectMedia = (media) => {
    setSelectedMedia(media);
    setSelectedLogoPaths([]);
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
      setSubmittedQuery('');
      setSearchQuery('');
    } catch (error) {
      alert(`Error importing logos: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Import Movies & Series</h1>

      <div className="glass p-6 rounded-lg mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <select
              value={searchType}
              onChange={(event) => setSearchType(event.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
            >
              <option value="movie">Movie</option>
              <option value="tv">TV Series</option>
            </select>

            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search TMDB..."
                className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              type="submit"
              disabled={searchResultsQuery.isLoading}
              className="px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {searchResultsQuery.isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {searchResultsQuery.isError && (
        <p className="text-red-400 mb-6">Error searching TMDB: {searchResultsQuery.error.message}</p>
      )}

      {searchResults.length > 0 && !selectedMedia && (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((media) => (
              <div
                key={media.id}
                onClick={() => handleSelectMedia(media)}
                className="glass rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-purple-500 transition"
              >
                <img
                  src={getImageUrl(media.poster_path, 'w300')}
                  alt={media.title || media.name}
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold truncate">{media.title || media.name}</p>
                  <p className="text-xs text-gray-400">{media.release_date || media.first_air_date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMedia && (
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setSelectedMedia(null);
                setSelectedLogoPaths([]);
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
    </div>
  );
};

export default ImportMedia;
