import ThemeToggle from './../ThemeToggle/ThemeToggle';
import { GradientText } from '../animate-ui/text/gradient';
import { Upload } from '../animate-ui/icons/upload';
import { UserRound } from '../animate-ui/icons/user-round';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/93 dark:bg-black-700/90 shadow-md">
      <div className=" px-4 py-3 flex flex-row items-center justify-between gap-4">
        
        <div className="w-full md:w-auto flex justify-start">
          <GradientText className="text-3xl md:text-4xl font-bold whitespace-nowrap transition-transform duration-200 active:scale-98" text="Videoverse" />
        </div>

        <div className="w-full md:flex-1md:mx-6 md:max-w-md">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Right Side - Buttons */}
        <div className="w-full md:w-auto flex justify-end items-center gap-4">
          <button className="py-2 text-blue-400 rounded-lg dark:text-white transition-transform duration-200 active:scale-90">
            <Upload animateOnHover size="22" />
          </button>
          <button className="px-2 py-2 bg-blue-400 text-white rounded-lg transition-transform duration-200 active:scale-90">
            <UserRound animateOnHover size="22" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
