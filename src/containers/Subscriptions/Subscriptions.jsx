import React from 'react';
import { useInfiniteVideos } from '../../lib/api';
import VideoCard from '../../components/VideoCard/VideoCard';

export default function Subscriptions() {
    const { 
        videos, 
        loading, 
        loadingMore, 
        error, 
        hasMore, 
        loadMore, 
        refresh 
    } = useInfiniteVideos('/videos/subscriptions', 10);

    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center min-h-[50vh]">
                <div className="text-lg">Loading videos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-16 flex justify-center items-center min-h-[50vh]">
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

    return (
        <div className="pt-18 p-4">
            <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
            
            {videos.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video._id} video={video} />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore ? 'Loading...' : 'Load More Videos'}
                            </button>
                        </div>
                    )}

                    {/* No More Videos Message */}
                    {!hasMore && videos.length > 0 && (
                        <div className="text-center mt-8 text-gray-500">
                            No more videos to load
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center text-gray-500">
                    <p className="text-lg mb-2">No videos from subscribed channels</p>
                    <p>Videos from channels you subscribe to will appear here</p>
                </div>
            )}
        </div>
    );
} 