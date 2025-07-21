import VideoCard from '@/components/VideoCard/VideoCard';
import { useInfiniteVideos } from '../../lib/api';

export default function Home() {
  const { 
    videos, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    loadMore, 
    refresh 
  } = useInfiniteVideos('/videos', 10);  
  
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
    <div className="pt-16">
      <div className="p-4">
          {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard video={video} showStatus={false} key={video?._id}/>
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

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="text-center mt-16">
            <div className="text-gray-500">
              <p className="text-xl mb-2">No videos found</p>
              <p>Be the first to upload a video!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}