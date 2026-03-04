import { useWallpapers } from '../hooks/useWallpapers';
import { useCategories } from '../hooks/useCategories';
import { useMedia } from '../hooks/useMedia';

const Dashboard = () => {
  const { data: wallpapers } = useWallpapers();
  const { data: categories } = useCategories();
  const { data: media } = useMedia();

  const stats = [
    { label: 'Total Wallpapers', value: wallpapers?.length || 0 },
    { label: 'Categories', value: categories?.length || 0 },
    { label: 'Movies/Series', value: media?.length || 0 },
    { label: 'Total Downloads', value: wallpapers?.reduce((sum, w) => sum + (w.downloads || 0), 0) || 0 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-slate-400 mb-2 text-sm">{stat.label}</p>
            <p className="text-4xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
