import { useState } from 'react';
import { useSiteSettings, useUpsertSiteSettings } from '../hooks/useSiteSettings';

const SettingsForm = ({ initialSettings, onSave, saving }) => {
  const [formData, setFormData] = useState({
    telegram_link: initialSettings.telegram_link || '',
    enable_telegram_redirect: !!initialSettings.enable_telegram_redirect,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4 max-w-2xl">
      <label className="space-y-2 block">
        <span className="small-label text-sm">Telegram Link</span>
        <input
          type="url"
          value={formData.telegram_link}
          onChange={(event) => setFormData({ ...formData, telegram_link: event.target.value })}
          placeholder="https://t.me/your_channel"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
        />
      </label>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.enable_telegram_redirect}
          onChange={(event) =>
            setFormData({ ...formData, enable_telegram_redirect: event.target.checked })
          }
        />
        Enable Telegram Redirect on Download
      </label>

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
};

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const upsertSettings = useUpsertSiteSettings();

  const handleSave = async (formData) => {
    try {
      await upsertSettings.mutateAsync({
        id: settings?.id || 1,
        telegram_link: formData.telegram_link.trim(),
        enable_telegram_redirect: formData.enable_telegram_redirect,
      });
      alert('Settings saved successfully');
    } catch (error) {
      alert(`Failed to save settings: ${error.message}`);
    }
  };

  if (isLoading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Settings</h1>
      <SettingsForm
        key={`${settings?.id}-${settings?.telegram_link}-${settings?.enable_telegram_redirect}`}
        initialSettings={settings}
        onSave={handleSave}
        saving={upsertSettings.isPending}
      />
    </div>
  );
};

export default AdminSettings;
