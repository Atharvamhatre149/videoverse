import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../lib/api';
import VideoCard from '../../components/VideoCard/VideoCard';
import SubscribeButton from '../../components/SubscribeButton/SubscribeButton';
import dayjs from 'dayjs';

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
            {/* Channel Cover Image */}
            <div className="w-full rounded-2xl overflow-hidden aspect-[16/3] max-h-[400px] bg-gray-200 dark:bg-gray-700">
                {channel.coverImage ? (
                    <img
                        src={channel.coverImage}
                        alt={`${channel.username}'s cover`}
                        className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/1920x300?text=No+Cover+Image';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl" />
                )}
            </div>

            <div className="w-full bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <img
                            src={channel.avatar}
                            alt={channel.username}
                            className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = `https://via.placeholder.com/128x128?text=${channel.username.charAt(0).toUpperCase()}`;
                            }}
                        />
                        
                        {/* Channel Info */}
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-between gap-6">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold mb-1">{channel.fullname}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                        @{channel.username} • {channel.subscribersCount || 0} subscribers • {totalVideos} videos
                                    </p>
                                </div>
                                <div className="mt-2">
                                    <SubscribeButton 
                                        channelId={channelId}
                                        initialSubscriberCount={channel.subscribersCount || 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                {/* Videos Tab */}
                {activeTab === 'videos' && (
                    <div>
                        {videosLoading ? (
                            <div className="text-center">Loading videos...</div>
                        ) : videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {videos.map(video => (
                                    <VideoCard key={video._id} video={video} showAvatar={false} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                No videos uploaded yet
                            </div>
                        )}
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div className="max-w-3xl">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">About</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Description</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {channel.bio || 'No description provided'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Stats</h3>
                                    <div className="text-gray-600 dark:text-gray-400">
                                        <p>Joined {dayjs(channel.createdAt).format('MMMM D, YYYY')}</p>
                                        <p>{channel.subscribersCount || 0} subscribers</p>
                                        <p>{totalVideos} videos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 