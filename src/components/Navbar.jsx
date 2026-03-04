import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiSearch, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { signOut } from '../services/supabaseClient';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const dropdownRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070c18]/75 backdrop-blur-xl">
      <div className="section-wrap px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[1.75rem] font-semibold tracking-tight text-white whitespace-nowrap">
            Wall<span className="text-indigo-300">Finds</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search wallpapers, movies, series..."
                className="w-full h-11 px-12 rounded-full border border-white/15 bg-white/5 focus:outline-none focus:border-indigo-300/60"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:gap-3" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="btn-soft inline-flex items-center gap-2"
              >
                Categories <FiChevronDown size={16} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden">
                  {categories?.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-white/10 transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link to="/admin" className="btn-soft inline-flex items-center gap-2">
                  <FiUser size={16} /> Profile
                </Link>
                <button onClick={handleSignOut} className="btn-soft inline-flex items-center gap-2">
                  <FiLogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-soft">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
