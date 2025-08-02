import React, { useState, useEffect } from 'react';
import { useFetch, usePatch } from '../../lib/api';
import useUserStore from '../../store/useUserStore';
import ProfileHeader from './components/ProfileHeader';
import AboutSection from './components/AboutSection';
import VideosSection from './components/VideosSection';
import { motion, AnimatePresence } from 'motion/react';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('videos');
    const { user, setUser } = useUserStore();
    const [videosList, setVideosList] = useState([]);

    const { data: userInfoData, loading: userInfoLoading } = useFetch(
        user ? `/users/${user._id}` : null
    );

    const { data: userVideosData, loading: videosLoading } = useFetch(
        user ? `/videos?userId=${user._id}&limit=20&all=1` : null
    );

    useEffect(() => {
        if (userVideosData?.data?.docs) {
            setVideosList(userVideosData.data.docs);
        }
    }, [userVideosData]);

    const handleVideoDelete = (videoId) => {
        setVideosList(prevVideos => prevVideos.filter(video => video._id !== videoId));
    };

    const { mutate: updateProfile } = usePatch();

    if (!user) return null;
    console.log(userInfoData);
    
    const userInfo = userInfoData?.data;
    const totalVideos = videosList.length;

    if (userInfoLoading) {
        return (
            <div className="pt-16 flex justify-center items-center min-h-[50vh]">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="pt-20 px-20">
            <ProfileHeader 
                user={user}
                userInfo={userInfo} 
                setUser={setUser} 
                updateProfile={updateProfile}
                totalVideos={totalVideos}
            />

            {/* Profile Navigation */}
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
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"
                                    layoutId="activeTab"
                                />
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
                                <motion.div 
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400"
                                    layoutId="activeTab"
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-7xl mx-auto py-8 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'videos' ? (
                            <VideosSection 
                                videos={videosList}
                                loading={videosLoading}
                                handleVideoDelete={handleVideoDelete}
                                canEdit={true}
                            />
                        ) : (
                            <AboutSection 
                                userInfo={userInfo}
                                updateProfile={updateProfile}
                                totalVideos={totalVideos}
                                canEdit={true}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
} 