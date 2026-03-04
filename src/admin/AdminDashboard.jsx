import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiFilm, FiGrid, FiHome, FiImage, FiSettings } from 'react-icons/fi';
import { useAuth, useIsAdmin } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();

  if (authLoading || loading) {
    return <div className="section-wrap py-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/wallpapers', icon: FiImage, label: 'Wallpapers' },
    { path: '/admin/categories', icon: FiGrid, label: 'Categories' },
    { path: '/admin/media', icon: FiFilm, label: 'Movies/Series' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="section-wrap py-8">
      <div className="mb-4 lg:hidden">
        <label className="small-label text-xs text-slate-400 mb-2 block">Admin Section</label>
        <select
          value={location.pathname}
          onChange={(event) => navigate(event.target.value)}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl"
        >
          {navItems.map((item) => (
            <option key={item.path} value={item.path}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="hidden lg:block glass rounded-2xl border border-white/10">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-1">Admin Panel</h2>
            <p className="text-sm text-slate-400 mb-6">Control center</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive ? 'bg-indigo-500/90 text-white shadow-lg shadow-indigo-500/25' : 'hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          </div>
        </aside>

        <main className="glass rounded-2xl border border-white/10 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
