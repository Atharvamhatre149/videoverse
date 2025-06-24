import { useParams } from 'react-router-dom';
import { useFetch } from '../../lib/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function VideoPlayer() {
  const { videoId } = useParams();
  
  // Use the useFetch hook from api.js
  const { data: videoData, loading, error } = useFetch(
    videoId ? `/videos/${videoId}` : null
  );

  // Extract video from the API response structure
  const video = videoData?.data;

  if (loading) {
    return (
      <div className="pt-16 p-4">
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Loading video...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 p-4">
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-red-500">Error: {error.message || 'Failed to load video'}</div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="pt-16 p-4">
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Video not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 p-4 max-w-5xl">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          className="w-full h-full"
          controls
          autoPlay
          poster={video.thumbnail}
          src={video.videoFile}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Details */}
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
        
        {/* Video Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{video.views} views • {dayjs(video.createdAt).fromNow()}</span>
        </div>

        {/* Channel Info */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={video.owner?.avatar} 
            alt={video.owner?.username || 'Channel avatar'}
            className="w-12 h-12 rounded-full object-cover bg-gray-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/48x48?text=' + (video.owner?.username?.charAt(0).toUpperCase() || 'U');
            }}
          />
          <div>
            <h2 className="font-semibold text-gray-900">{video.owner?.username}</h2>
            <p className="text-sm text-gray-500">{video.owner?.fullName}</p>
          </div>
        </div>

        {/* Description */}
        {video.description && (
          <div className="bg-gray-100 rounded-lg p-4 shadow-md">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}