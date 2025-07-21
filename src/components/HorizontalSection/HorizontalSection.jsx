import React from 'react';
import VideoCard from '../VideoCard/VideoCard';

export default function HorizontalSection({ title, videos, onSeeAll, playlistId }) {
    if (!videos?.length) return null;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                {onSeeAll && (
                    <button
                        onClick={onSeeAll}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        See All
                    </button>
                )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {videos.map((video) => (
                    <div key={video._id} className="flex-shrink-0 w-90">
                        <VideoCard 
                            video={video} 
                            showStatus={false} 
                            playlistId={playlistId}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
} 