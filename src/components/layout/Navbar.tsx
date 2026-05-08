import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-amber-400 font-bold text-lg leading-tight tracking-wide">
                SHRI THAKUR JI
              </span>
              <span className="text-amber-500/60 text-[10px] tracking-[0.3em] uppercase">
                Hotel & Resort
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-white/80 hover:text-amber-400 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-full text-white/70 hover:text-amber-400 hover:bg-white/5 transition-all"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-amber-400 transition-all"
                >
                  <User size={16} />
                  <span className="text-sm">{profile?.full_name || 'User'}</span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-sm text-white/70 hover:text-amber-400 hover:bg-white/5 transition-all"
                      >
                        My Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-3 text-sm text-white/70 hover:text-amber-400 hover:bg-white/5 transition-all"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={signOut}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-all flex items-center gap-2"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-amber-400 transition-all"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-white/70 hover:text-amber-400 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={toggle}
                  className="p-2 rounded-full text-white/70 hover:text-amber-400 transition-all"
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex-1 text-center px-4 py-2 rounded-full text-sm text-white/70 hover:text-amber-400 border border-white/10 transition-all"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={signOut}
                      className="px-4 py-2 rounded-full text-sm text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
