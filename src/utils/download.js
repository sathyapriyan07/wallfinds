const triggerDownload = (href, filename) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const openTelegramIfEnabled = (settings) => {
  if (!settings?.enable_telegram_redirect) return;
  if (!settings?.telegram_link) return;
  if (!isValidHttpUrl(settings.telegram_link)) return;
  window.open(settings.telegram_link, '_blank', 'noopener,noreferrer');
};

export const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed with status ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    triggerDownload(blobUrl, filename);
    URL.revokeObjectURL(blobUrl);
  } catch {
    triggerDownload(url, filename);
  }
};

export const downloadWithOptionalTelegramRedirect = async ({ url, filename, settings }) => {
  openTelegramIfEnabled(settings);
  await downloadFile(url, filename);
};
