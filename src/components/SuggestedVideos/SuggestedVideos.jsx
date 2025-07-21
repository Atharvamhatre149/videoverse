import React from 'react';
import { useInfiniteVideos, useFetch } from '../../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function SuggestedVideoCard({ video, playlistId }) {
    const navigate = useNavigate();

    return (
        <div 
            className="flex gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg"
            onClick={() => {
                const path = playlistId 
                    ? `/watch/${video._id}?playlist=${playlistId}`
                    : `/watch/${video._id}`;
                navigate(path);
            }}
        >
            {/* Thumbnail */}
            <div className="relative w-40 flex-shrink-0">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </div>
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{video.owner?.username}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{video.views} views</span>
                    <span className="mx-1">•</span>
                    <span>{dayjs(video.createdAt).fromNow()}</span>
                </div>
            </div>
        </div>
    );
}

export default function SuggestedVideos() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const playlistId = searchParams.get('playlist');

    // Fetch playlist videos if playlistId exists
    const { data: playlistData } = useFetch(
        playlistId ? `/playlist/${playlistId}` : null
    );

    const { 
        videos,
        loading, 
        loadingMore,
        error,
        hasMore,
        loadMore,
        refresh
    } = useInfiniteVideos('/videos', 10);

    // Use playlist videos if available, otherwise use suggested videos
    const displayVideos = playlistData?.data?.videos || videos;

    if (error) {
        return (
            <div className="space-y-4">
                <div className="text-red-500 text-center">
                    <p>Error loading videos: {error.message}</p>
                    <button 
                        onClick={refresh}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-2">
                        <div className="w-40 aspect-video bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-2">
                {displayVideos?.map(video => (
                    <SuggestedVideoCard 
                        key={video._id} 
                        video={video} 
                        playlistId={playlistId}
                    />
                ))}
            </div>
            
            {/* Only show load more for suggested videos, not playlist videos */}
            {!playlistId && hasMore && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}

            {/* No More Videos Message */}
            {!playlistId && !hasMore && displayVideos?.length > 0 && (
                <div className="text-center mt-4 text-gray-500 text-sm">
                    No more videos to load
                </div>
            )}
        </div>
    );
} 