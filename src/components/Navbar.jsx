import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiMenu, FiSearch, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { signOut } from '../services/supabaseClient';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const dropdownRef = useRef(null);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      setShowMobileMenu(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowMobileMenu(false);
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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070c18]/80 backdrop-blur-xl">
      <div className="section-wrap py-2.5">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="text-[1.8rem] font-semibold tracking-tight text-white whitespace-nowrap">
            Wall<span className="text-indigo-300">Finds</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl mx-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search wallpapers, movies, series..."
                className="w-full h-10 px-11 rounded-full border border-white/15 bg-white/5 focus:outline-none focus:border-indigo-300/60"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            </div>
          </form>

          <div className="hidden md:flex items-center gap-2" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="btn-soft inline-flex items-center gap-2"
              >
                Categories <FiChevronDown size={16} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden max-h-72 overflow-y-auto">
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
                <Link to="/login" className="btn-soft">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          <button
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/15 bg-white/5"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="md:hidden mt-3 glass rounded-2xl p-3 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search..."
                  className="w-full h-10 px-11 rounded-xl border border-white/15 bg-white/5 focus:outline-none focus:border-indigo-300/60"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2">
              {user ? (
                <>
                  <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="btn-soft inline-flex items-center justify-center gap-2">
                    <FiUser size={15} /> Profile
                  </Link>
                  <button onClick={handleSignOut} className="btn-soft inline-flex items-center justify-center gap-2">
                    <FiLogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setShowMobileMenu(false)} className="btn-soft text-center">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setShowMobileMenu(false)} className="btn-primary text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <div className="border-t border-white/10 pt-2 max-h-44 overflow-y-auto">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400 px-1 mb-2">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
