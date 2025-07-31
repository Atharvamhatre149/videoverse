import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../lib/api';
import VideoCard from '../../components/VideoCard/VideoCard';
import SubscribeButton from '../../components/SubscribeButton/SubscribeButton';
import ProfileHeader from '../Profile/components/ProfileHeader';
import AboutSection from '../Profile/components/AboutSection';
import VideosSection from '../Profile/components/VideosSection';

export default function Channel() {
    const { channelId } = useParams();
    const [activeTab, setActiveTab] = useState('videos');

    const { data: channelData, loading: channelLoading } = useFetch(
        channelId ? `/users/${channelId}` : null
    );

    const { data: channelVideosData, loading: videosLoading } = useFetch(
        channelId ? `/videos?userId=${channelId}&limit=20` : null
    );

    const channel = channelData?.data;
    const videos = channelVideosData?.data?.docs || [];
    const totalVideos = channelVideosData?.data?.totalDocs || 0;

    if (channelLoading) {
        return (
            <div className="pt-16 flex justify-center items-center min-h-[50vh]">
                <div className="text-lg">Loading channel...</div>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="pt-16 flex justify-center items-center min-h-[50vh]">
                <div className="text-lg">Channel not found</div>
            </div>
        );
    }

    return (
        <div className="pt-20 px-20">
            <ProfileHeader 
                user={channel}
                userInfo={channel}
                totalVideos={totalVideos}
                canEdit={false}
            />

            {/* Channel Navigation */}
            <div className="border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <div className="flex space-x-8">
                        <button
                            className={`py-4 px-2 relative ${
                                activeTab === 'videos'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400'
                            }`}
                            onClick={() => setActiveTab('videos')}
                        >
                            Videos
                            {activeTab === 'videos' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400" />
                            )}
                        </button>
                        <button
                            className={`py-4 px-2 relative ${
                                activeTab === 'about'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400'
                            }`}
                            onClick={() => setActiveTab('about')}
                        >
                            About
                            {activeTab === 'about' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Channel Content */}
            <div className="max-w-7xl mx-auto py-8">
                {activeTab === 'videos' ? (
                    <VideosSection 
                        videos={videos}
                        loading={videosLoading}
                        showAvatar={false}
                    />
                ) : (
                    <AboutSection 
                        userInfo={channel}
                        totalVideos={totalVideos}
                        canEdit={false}
                    />
                )}
            </div>

            {/* Subscribe Button - Floating */}
            <div className="fixed bottom-6 right-6">
                <SubscribeButton 
                    channelId={channelId}
                    initialSubscriberCount={channel.subscribersCount || 0}
                />
            </div>
        </div>
    );
} 