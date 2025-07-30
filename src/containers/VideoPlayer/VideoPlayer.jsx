import { useParams } from 'react-router-dom';
import { useFetch, usePost } from '../../lib/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect, useRef, useCallback } from 'react';
import LikeButton from '../../components/LikeButton/LikeButton';
import SubscribeButton from '../../components/SubscribeButton/SubscribeButton';
import CommentSection from '../../components/Comments/CommentSection';
import BookmarkButton from '../../components/BookmarkButton/BookmarkButton';
import SuggestedVideos from '../../components/SuggestedVideos/SuggestedVideos';

dayjs.extend(relativeTime);

export default function VideoPlayer() {
  const { videoId } = useParams();
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [views, setViews] = useState(0);
  const [hasViewedFor30Seconds, setHasViewedFor30Seconds] = useState(false);
  const videoRef = useRef(null);
  const lastCheckTimeRef = useRef(0);
  const { mutate: incrementView } = usePost();
  
  const { data: videoData, loading, error } = useFetch(
    videoId ? `/videos/${videoId}` : null
  );

  const video = videoData?.data;

  // Initialize subscriber count and views when video data loads
  useEffect(() => {
    if (video) {
      setSubscriberCount(video.subscriberCount || 0);
      setViews(video.views || 0);
    }
  }, [video]);

  const handleTimeUpdate = useCallback(() => {
    

    if (hasViewedFor30Seconds) {
      return;
    }
    const currentTime = videoRef.current?.currentTime || 0;
    
    if (currentTime - lastCheckTimeRef.current < 1) {
      return;
    }
    
    lastCheckTimeRef.current = currentTime;
    
    if (currentTime >= 30) {
      setHasViewedFor30Seconds(true);
      incrementView(`/videos/view/${videoId}`)
        .then(response => {
          if (response?.data) {
            setViews(response?.data?.views);
          }
        })
        .catch(error => {
          console.error('Error incrementing view:', error);
        });
    }
  }, [videoId, hasViewedFor30Seconds, incrementView]);
   
  const handleSubscriptionChange = (isSubscribed) => {
    setSubscriberCount(prev => isSubscribed ? prev + 1 : prev - 1);
  };

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
    <div className="pt-20 p-4">
      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
              poster={video.thumbnail}
              src={video.videoFile}
              onTimeUpdate={!hasViewedFor30Seconds ? handleTimeUpdate : undefined}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Details */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{video.title}</h1>

            {/* Channel Info and Buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={video.owner?.avatar?.url} 
                  alt={video.owner?.username || 'Channel avatar'}
                  className="w-12 h-12 rounded-full object-cover bg-gray-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/48x48?text=' + (video.owner?.username?.charAt(0).toUpperCase() || 'U');
                  }}
                />
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{video.owner?.username}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{subscriberCount} subscribers</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <SubscribeButton 
                  channelId={video.owner?._id}
                  onSubscriptionChange={handleSubscriptionChange}
                />
                <LikeButton 
                  videoId={videoId}
                  initialLikeCount={video.likes || 0}
                />
                <BookmarkButton videoId={videoId} />
              </div>
            </div>

            {/* Description */}
            {video.description && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md">
                {/* Video Stats */}
                <div className="flex items-center gap-3 text-sm font-semibold mb-4">
                  <span>{views} views</span>
                  <span>{dayjs(video.createdAt).fromNow()}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{video.description}</p>
              </div>
            )}

            {/* Comments Section */}
            <CommentSection videoId={videoId} />
          </div>
        </div>

        {/* Suggested Videos */}
        <div className="lg:w-[400px] flex-shrink-0">
          <SuggestedVideos />
        </div>
      </div>
    </div>
  );
}