import ThemeToggle from './../ThemeToggle/ThemeToggle';
import { GradientText } from '../animate-ui/text/gradient';
import { Upload } from '../animate-ui/icons/upload';
import { useNavigate } from 'react-router-dom';
import { DropdownMenuButton } from '../DropdownMenu/DropdownMenuButton';
import useUserStore from '../../store/useUserStore';
import { useScrollDirection } from '../../hooks/useScrollDirection';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const { isScrollingUp, scrollProgress } = useScrollDirection();

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

  // Calculate transform value based on scroll progress
  const transformValue = isScrollingUp 
    ? `translateY(-${Math.max(0, scrollProgress - 100)}%)`
    : `translateY(-${Math.min(100, scrollProgress)}%)`;

  return (
    <nav 
      style={{ transform: transformValue }}
      className="fixed top-0 left-0 w-full z-50 bg-white/93 dark:bg-black-700/90 shadow-md transition-transform duration-300"
    >
      <div className="px-4 py-3 flex flex-row items-center justify-between gap-4">
        
        <div className="w-full md:w-auto flex justify-start">
          <GradientText 
            className="text-3xl md:text-4xl font-bold whitespace-nowrap transition-transform duration-200 active:scale-98 cursor-pointer" 
            text="Videoverse"
            onClick={() => navigate('/')}
          />
        </div>

        <div className="w-full md:flex-1 md:mx-6 md:max-w-md">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Right Side - Buttons */}
        <div className="w-full md:w-auto flex justify-end items-center gap-4">
          <button 
            className="py-2 text-blue-400 rounded-lg dark:text-white transition-transform duration-200 active:scale-90"
            onClick={handleUploadClick}
          >
            <Upload animateOnHover size="22" />
          </button>
          
          {user ? (
            <DropdownMenuButton user={user} onLogout={handleLogout} />
          ) : (
            <button 
              className="px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-transform duration-200 active:scale-90" 
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
