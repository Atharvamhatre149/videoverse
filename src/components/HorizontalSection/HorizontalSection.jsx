import React, { useRef } from 'react';
import VideoCard from '../VideoCard/VideoCard';
import styles from './HorizontalSection.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HorizontalSection({ title, videos, onSeeAll, playlistId }) {
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();
    
    if (!videos?.length) return null;

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600; // Adjust this value to control scroll distance
            const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleSeeAll = () => {
        if (videos.length > 0) {
            const firstVideo = videos[0];
            let path = `/watch/${firstVideo._id}`;
            
            // Add appropriate query parameter based on the section type
            if (playlistId) {
                path += `?playlist=${playlistId}`;
            } else if (title === "Liked Videos") {
                path += '?from=likes';
            }
            
            navigate(path);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleScroll('left')}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6 text-blue-500 hover:text-blue-600" />
                    </button>
                    <button
                        onClick={() => handleScroll('right')}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6 text-blue-500 hover:text-blue-600" />
                    </button>
                    {videos.length > 0 && (
                        <button
                            onClick={handleSeeAll}
                            className="text-blue-500 hover:text-blue-600 ml-2"
                        >
                            See All
                        </button>
                    )}
                </div>
            </div>
            <div ref={scrollContainerRef} className={styles.scrollContainer}>
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