import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { LoaderOne } from "@/components/ui/loader";
import SubscribeButton from '@/components/SubscribeButton/SubscribeButton';

export default function ProfileHeader({ user, userInfo, setUser, updateProfile, totalVideos, canEdit = true }) {
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);

    const handleImageUpload = async (type, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type === 'avatar' ? 'avatar' : 'coverImage', file);

        try {
            if (type === 'avatar') {
                setIsUploadingAvatar(true);
            } else {
                setIsUploadingCover(true);
            }

            const response = await updateProfile(
                type === 'avatar' ? '/users/avatar' : '/users/cover-image',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            
            if (response?.data) {
                if (type === 'avatar') {
                    setUser({
                        ...user,
                        avatar: response.data.avatar
                    });
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploadingAvatar(false);
            setIsUploadingCover(false);
        }
    };

    return (
        <>
            {/* Cover Image Section */}
            <div className="w-full rounded-2xl overflow-hidden aspect-[16/3] max-h-[400px] bg-gray-200 dark:bg-gray-700 relative group">
                {userInfo?.coverImage ? (
                    <img
                        src={userInfo?.coverImage?.url}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/1920x300?text=No+Cover+Image';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl" />
                )}
                {canEdit && (
                    isUploadingCover ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <LoaderOne />
                        </div>
                    ) : (
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
                    )
                )}
            </div>

            <div className="w-full bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto py-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Avatar with Upload */}
                        <div className="relative group">
                            <img
                                src={user?.avatar?.url}
                                alt={user.username}
                                className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/128x128?text=${user.username.charAt(0).toUpperCase()}`;
                                }}
                            />
                            {canEdit && (
                                isUploadingAvatar ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <LoaderOne />
                                    </div>
                                ) : (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload('avatar', e)}
                                        />
                                        <Upload className="w-6 h-6 text-white" />
                                    </label>
                                )
                            )}
                        </div>
                        
                        {/* Profile Info */}
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-between gap-6">
                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold mb-1">{user.fullname}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                                        @{user.username} • {userInfo?.subscribersCount || 0} subscribers • {totalVideos} videos
                                    </p>
                                </div>
                                {!canEdit && (
                                    <div className="mt-2">
                                        <SubscribeButton 
                                            channelId={user._id}
                                            initialSubscriberCount={userInfo?.subscribersCount || 0}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 