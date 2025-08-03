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
import { motion } from 'framer-motion';
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
        <button className="rounded-full outline-none bg-blue-400 hover:bg-blue-500 flex items-center justify-center">
          <motion.div    
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center"
          >
            {user?.avatar ? (
              <img 
                src={user?.avatar?.url} 
                alt={user.username} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserRound size="28" className="text-white" />
            )}
          </motion.div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-57 bg-white dark:bg-black-700 dark:border-1 dark:border-black-700 rounded-lg shadow-lg border border-gray-200 m-2">
        <DropdownMenuLabel >
          <div className="flex items-center gap-3 mb-2">
            {user?.avatar ? (
              <img 
                src={user?.avatar?.url} 
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
        <DropdownMenuSeparator className="h-[1px] bg-gray-200 dark:bg-black-500 my-1" />
        <DropdownMenuGroup className="px-1 py-1">
          <DropdownMenuItem onClick={() => navigate('/profile')} className="px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-black-600 focus:bg-gray-100 dark:text-white  dark:focus:bg-black-600 outline-none">
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