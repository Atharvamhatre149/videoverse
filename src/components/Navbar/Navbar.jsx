import ThemeToggle from './../ThemeToggle/ThemeToggle';
import { GradientText } from '../animate-ui/text/gradient';
import { Upload } from '../animate-ui/icons/upload';
import { useNavigate, useLocation } from 'react-router-dom';
import { DropdownMenuButton } from '../DropdownMenu/DropdownMenuButton';
import useUserStore from '../../store/useUserStore';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { Search, X, UserRound } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '../animate-ui/buttons/icon';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useUserStore();
  const { isScrollingUp, scrollProgress } = useScrollDirection();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      clearUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/upload');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (location.pathname !== '/') {
        await navigate('/');
        setTimeout(() => {
          navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
        }, 100);
      } else {
        navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => document.querySelector('input[type="text"]')?.focus(), 100);
    }
  };

  // Calculate transform value based on scroll progress
  const transformValue = isScrollingUp 
    ? `translateY(-${Math.max(0, scrollProgress - 100)}%)`
    : `translateY(-${Math.min(100, scrollProgress)}%)`;

  return (
    <nav 
      style={{ transform: transformValue }}
      className="fixed top-0 left-0 w-full z-50 dark:border-b-1 dark:border-black-600 bg-white/93 dark:bg-black/90 shadow-md transition-transform duration-300"
    >
      <div className="px-4 py-3 flex flex-row items-center justify-between gap-4">
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            // Search Mode
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSearch} 
              className="flex-1 flex items-center"
            >
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-black-400 bg-gray-100 dark:bg-black-700 text-black dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-400"
                />
                <button 
                  type="button"
                  onClick={toggleSearch}
                  className="absolute right-4 p-1.5 text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.form>
          ) : (
            // Normal Mode
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:w-auto flex justify-start"
              >
                <GradientText 
                  className="text-3xl md:text-4xl font-bold whitespace-nowrap transition-transform duration-200 active:scale-98 cursor-pointer" 
                  text="Videoverse"
                  onClick={() => navigate('/')}
                />
              </motion.div>

              {/* Desktop Search */}
              <div className="hidden md:flex-1 md:flex md:mx-6 md:max-w-md">
                <form onSubmit={handleSearch} className="w-full relative">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search videos..."
                      className="w-full px-4 py-2 pr-12 rounded-l-lg border border-gray-300 dark:border-black-400 bg-gray-100 dark:bg-black-700 text-black dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-400"
                    />
                    {searchQuery && (
                      <IconButton
                        icon={X}
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-14 p-1.5 text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      />
                    )}
                    <motion.button 
                      type="submit"
                      whileTap={{ scale: 0.95 }}
                      className="right-1 py-2.5 px-4 border border-gray-300 bg-gray-100 text-gray-500 dark:bg-black-700 dark:border-black-400 border-l-0 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-r-xl"
                    >
                      <Search size={20} />
                    </motion.button>
                  </div>
                </form>
              </div>

              {/* Right Side - Buttons */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile Search Toggle */}
                <button 
                  onClick={toggleSearch}
                  className="md:hidden p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Search size={22} />
                </button>

                <button 
                  className="py-2 text-blue-400 rounded-lg font-bold transition-transform duration-200 active:scale-90"
                  onClick={handleUploadClick}
                >
                  <Upload animateOnHover size="22" />
                </button>
                
                {user ? (
                  <DropdownMenuButton user={user} onLogout={handleLogout} />
                ) : (
                  <button 
                    className="flex items-center gap-2 px-3 p-1.5 bg-blue-400 hover:bg-blue-500 text-white rounded-3xl transition-transform duration-200 active:scale-90" 
                    onClick={() => navigate('/login')}
                  >
                    <UserRound size={20} />
                    <span className="hidden md:inline">Sign In</span>
                  </button>
                )}
                
                <ThemeToggle />
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
