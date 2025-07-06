import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, User } from 'lucide-react';

export default function SideNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        {
            name: 'Home',
            icon: Home,
            path: '/'
        },
        {
            name: 'Subscriptions',
            icon: Users,
            path: '/subscriptions'
        },
        {
            name: 'You',
            icon: User,
            path: '/you'
        }
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Desktop Side Navigation */}
            <div className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 flex-col pt-5 gap-4 items-center bg-white dark:bg-black-700 border-r border-gray-200 dark:border-gray-800">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`w-full p-4 flex font-semibold flex-col items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                            isActive(item.path) ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        <item.icon size={24} />
                        <span className="text-xs">{item.name}</span>
                    </button>
                ))}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/93 dark:bg-black-700/90 shadow-md dark:bg-black-700 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`p-4 flex flex-col items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                                isActive(item.path) ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <item.icon size={24} />
                            <span className="text-xs">{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
} 