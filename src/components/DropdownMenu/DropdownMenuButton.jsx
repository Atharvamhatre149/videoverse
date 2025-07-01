import {
  CreditCard,
  Keyboard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { UserRound } from '@/components/animate-ui/icons/user-round';

export const DropdownMenuButton = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>   
        <button className="rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center">
          <motion.div    
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserRound size="28" className="text-white" />
            )}
          </motion.div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-54 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 m-3">
        <DropdownMenuLabel >
          <div className="flex items-center gap-3 mb-2">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserRound size="24" className="text-blue-500" />
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">{user?.fullname}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{user?.username}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1" />
        <DropdownMenuGroup className="px-1 py-1">
          <DropdownMenuItem onClick={() => navigate('/profile')} className="px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 outline-none">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout} className="px-2 py-2 text-sm rounded-md cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 focus:bg-red-50 dark:focus:bg-red-900/10 outline-none">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};