import React, { useState } from 'react';
import { useFetch, usePost } from '../../lib/api';
import VideoCard from '../../components/VideoCard/VideoCard';
import dayjs from 'dayjs';
import useUserStore from '../../store/useUserStore';
import { Upload } from 'lucide-react';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('videos');
    const [isEditing, setIsEditing] = useState(false);
    const { user, updateUser } = useUserStore();
    const [formData, setFormData] = useState({
        fullname: user?.fullname || '',
        bio: user?.bio || ''
    });

    const { data: userVideosData, loading: videosLoading } = useFetch(
        user ? `/videos?userId=${user._id}&limit=20` : null
    );

    const { mutate: updateProfile } = usePost();

    const videos = userVideosData?.data?.docs || [];
    const totalVideos = userVideosData?.data?.totalDocs || 0;

    const handleImageUpload = async (type, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await updateProfile(
                type === 'avatar' ? '/users/avatar' : '/users/cover-image',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            
            if (response?.data) {
                updateUser(response.data.data);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const response = await updateProfile('/users', formData);
            if (response?.data) {
                updateUser(response.data.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="pt-20 px-20">
            {/* Cover Image Section */}
            <div className="w-full rounded-2xl overflow-hidden aspect-[16/3] max-h-[400px] bg-gray-200 dark:bg-gray-700 relative group">
                {user.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-2xl"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl" />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('cover', e)}
                    />
                    <Upload className="w-8 h-8 text-white" />
                    <span className="text-white ml-2">Upload Cover Image</span>
                </label>
            </div>

            <div className="w-full bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Avatar with Upload */}
                        <div className="relative group">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload('avatar', e)}
                                />
                                <Upload className="w-6 h-6 text-white" />
                            </label>
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-between gap-6">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={formData.fullname}
                                            onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Full Name"
                                        />
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Bio"
                                            rows={3}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleProfileUpdate}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        fullname: user.fullname || '',
                                                        bio: user.bio || ''
                                                    });
                                                }}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-2xl md:text-4xl font-bold mb-1">{user.fullname}</h1>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                            @{user.username} • {user.subscribersCount || 0} subscribers • {totalVideos} videos
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            {/* Profile Content */}
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
                                        {user.bio || 'No description provided'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Stats</h3>
                                    <div className="text-gray-600 dark:text-gray-400">
                                        <p>Joined {dayjs(user.createdAt).format('MMMM D, YYYY')}</p>
                                        <p>{user.subscribersCount || 0} subscribers</p>
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