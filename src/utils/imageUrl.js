export const normalizeTmdbToOriginal = (url) => {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const tmdbPathMatch = path.match(/\/t\/p\/([^/]+)\/(.+)/);

    if (!tmdbPathMatch) return url;

    const filePath = tmdbPathMatch[2];
    parsed.pathname = `/t/p/original/${filePath}`;
    return parsed.toString();
  } catch {
    return url;
  }
};

export const deriveTmdbThumbnail = (url, size = 'w500') => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const tmdbPathMatch = path.match(/\/t\/p\/([^/]+)\/(.+)/);

    if (!tmdbPathMatch) return '';

    const filePath = tmdbPathMatch[2];
    parsed.pathname = `/t/p/${size}/${filePath}`;
    return parsed.toString();
  } catch {
    return '';
  }
};
