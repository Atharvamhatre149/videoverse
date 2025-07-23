import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

export default function VideoCard({video, showStatus = false, showAvatar = true, playlistId}) {
    const navigate = useNavigate();

    const handleVideoClick = () => {
        let path = `/watch/${video._id}`;
        if (playlistId) {
            path += `?playlist=${playlistId}`;
        } else if (video.fromLikedVideos) {
            path += '?from=likes';
        }
        navigate(path);
    };

    return (
        <div 
            key={video._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={handleVideoClick}
        >
            <div className="relative aspect-video bg-gray-200">
                <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
                    }}
                />
                <div className="absolute bottom-2 right-2 bg-black-500/60 text-white font-semibold text-xs px-1 py-1 rounded">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </div>
            </div>

            <div className="flex flex-row gap-3 p-2">
                {showAvatar && (
                    <div className="flex-shrink-0">
                        <img 
                            src={video.owner?.avatar} 
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
                    </div>
                )}    
                <div className="flex-1 mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{video.title.length > 35 ? video.title.slice(0, 35) + '...' : video.title}</h3>
                    <p 
                        className="text-gray-500 font-medium text-sm mb-1 cursor-pointer hover:text-gray-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/channel/${video.owner?._id}`);
                        }}
                    >
                        {video.owner?.username}
                    </p>
                    
                    {/* Video Stats */}
                    <div className="font-medium items-center text-sm text-gray-500">
                        <span>{video.views} views • {dayjs(video.createdAt).toNow(true)} ago</span>
                    </div>
                    
                    {/* Status */}
                    {showStatus && (
                        <div className="mt-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                video.isPublished 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {video.isPublished ? 'Published' : 'Draft'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}