import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

dayjs.extend(relativeTime);

export default function VideoCard({
    video, 
    showStatus = false, 
    showAvatar = true, 
    playlistId, 
    isProfile = false,
    onDelete
}) {
    const navigate = useNavigate();
    const [isPublished,setIsPublished] = useState(false)

    useEffect(()=>{
        setIsPublished(video?.isPublished)
    },[video])

    const handleVideoClick = () => {
        let path = `/watch/${video._id}`;
        if (playlistId) {
            path += `?playlist=${playlistId}`;
        } else if (video.fromLikedVideos) {
            path += '?from=likes';
        }
        navigate(path);
    };

    const handleTogglePublish = async (e) => {
        e.stopPropagation(); // Prevent video click when toggling publish status
        try {
            const response = await api.patch(`/videos/toggle/publish/${video._id}`);
            setIsPublished(response.data.data.isPublished);
            
        } catch (error) {
            console.error('Error toggling video publish status:', error);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/edit-video/${video._id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await api.delete(`/videos/${video._id}`);
            if (onDelete) {
                onDelete(video._id);
            }
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    };

    return (
        <motion.div 
            key={video._id} 
            className="bg-white rounded-lg overflow-hidden cursor-pointer relative dark:bg-black-700"
            onClick={handleVideoClick}
            initial={{ scale: 1 }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            <motion.div 
                className="relative aspect-video"
                whileHover={{ 
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
            >
                <motion.img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
                <div className="absolute bottom-2 right-2 bg-black-500/60 text-white font-semibold text-xs px-1 py-1 rounded">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </div>
            </motion.div>

            <div className="flex flex-row gap-3 p-2 dark:bg-black-700">
                {showAvatar && (
                    <motion.div 
                        className="flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <img 
                            src={video.owner?.avatar?.url} 
                            alt={video.owner?.username || 'User avatar'}
                            className="w-10 h-10 rounded-full object-cover bg-gray-300 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/channel/${video.owner?._id}`);
                            }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40x40?text=' + (video.owner?.username?.charAt(0).toUpperCase() || 'U');
                            }}
                        />
                    </motion.div>
                )}    
                <div className="flex-1 mb-2">
                    <div className="flex justify-between items-start">
                        <motion.h3 
                            className="font-semibold text-lg line-clamp-2 dark:text-white"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                        >
                            {video.title.length > 35 ? video.title.slice(0, 35) + '...' : video.title}
                        </motion.h3>
                        {isProfile && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <motion.button 
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-black-600 rounded-full outline-none"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </motion.button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-36 bg-white dark:bg-black-600 rounded-lg shadow-lg border border-gray-200 dark:border-none">
                                    <DropdownMenuItem onClick={handleEdit} className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-black-500 dark:text-white flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete} className="px-2 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <motion.p 
                        className="text-gray-500 font-medium text-sm mb-1 cursor-pointer dark:text-gray-400 dark:hover:text-gray-200 hover:text-gray-700"
                        whileHover={{ x: 5 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/channel/${video.owner?._id}`);
                        }}
                    >
                        {video.owner?.username}
                    </motion.p>
                    
                    {/* Video Stats */}
                    <div className="font-medium items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{video.views} views • {dayjs(video.createdAt).toNow(true)} ago</span>
                    </div>
                    
                    {/* Status */}
                    {showStatus && (
                        <div className="mt-2">
                            <motion.button 
                                className={`inline-block px-2 py-1 rounded-full text-xs cursor-pointer ${
                                    isPublished 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}
                                onClick={handleTogglePublish}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isPublished ? 'Published' : 'Draft'}
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}