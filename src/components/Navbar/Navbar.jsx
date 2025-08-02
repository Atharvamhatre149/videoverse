import ThemeToggle from './../ThemeToggle/ThemeToggle';
import { GradientText } from '../animate-ui/text/gradient';
import { Upload } from '../animate-ui/icons/upload';
import { useNavigate } from 'react-router-dom';
import { DropdownMenuButton } from '../DropdownMenu/DropdownMenuButton';
import useUserStore from '../../store/useUserStore';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const { isScrollingUp, scrollProgress } = useScrollDirection();
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
        
        <div className="w-full md:w-auto flex justify-start">
          <GradientText 
            className="text-3xl md:text-4xl font-bold whitespace-nowrap transition-transform duration-200 active:scale-98 cursor-pointer" 
            text="Videoverse"
            onClick={() => navigate('/')}
          />
        </div>

        <form onSubmit={handleSearch} className="w-full md:flex-1 md:mx-6 md:max-w-md relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-4 py-2 pr-12 z-10 rounded-l-lg border border-gray-300 dark:border-black-400 bg-gray-100 dark:bg-black-700 text-black dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-400"
            />
            <button 
              type="submit"
              className="right-1 py-2.5 px-4 border border-gray-300 bg-gray-100 text-gray-500 dark:bg-black-700 dark:border-black-400 border-l-0 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 rounded-r-xl"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {/* Right Side - Buttons */}
        <div className="w-full md:w-auto flex justify-end items-center gap-4">
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
              className="px-3 p-1.5 bg-blue-400 hover:bg-blue-500 text-white rounded-3xl transition-transform duration-200 active:scale-90" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
