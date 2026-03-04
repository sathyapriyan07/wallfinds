import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WallpaperDetail from './pages/WallpaperDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import MoviePage from './pages/MoviePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './admin/AdminDashboard';
import Dashboard from './admin/Dashboard';
import ManageWallpapers from './admin/ManageWallpapers';
import ManageCategories from './admin/ManageCategories';
import ImportMedia from './admin/ImportMedia';
import AdminSettings from './admin/AdminSettings';
import { SiteSettingsProvider } from './context/SiteSettingsProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wallpaper/:id" element={<WallpaperDetail />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MoviePage />} />
              <Route path="/tv/:id" element={<MoviePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<Dashboard />} />
                <Route path="wallpapers" element={<ManageWallpapers />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="media" element={<ImportMedia />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
