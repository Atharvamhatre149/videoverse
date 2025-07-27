import React from 'react';
import VideoCard from '../../../components/VideoCard/VideoCard';

export default function VideosSection({ videos, loading, handleVideoDelete }) {
    return (
        <div>
            {loading ? (
                <div className="text-center">Loading videos...</div>
            ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map(video => (
                        <VideoCard 
                            key={video._id} 
                            video={video} 
                            showAvatar={false} 
                            showStatus={true}
                            isProfile={true}
                            onDelete={handleVideoDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    No videos uploaded yet
                </div>
            )}
        </div>
    );
} 