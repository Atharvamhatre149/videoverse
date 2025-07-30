import React, { useState } from 'react';
import { Link as LinkIcon, Plus, X, Calendar, Users, Video, Edit2 } from 'lucide-react';
import { LoaderOne } from "@/components/ui/loader";
import dayjs from 'dayjs';

export default function AboutSection({ userInfo, updateProfile, totalVideos }) {
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isUpdatingAbout, setIsUpdatingAbout] = useState(false);
    const [aboutFormData, setAboutFormData] = useState({
        description: userInfo?.description || '',
        links: userInfo?.links || []
    });

    const handleAddLink = () => {
        setAboutFormData(prev => ({
            ...prev,
            links: [...prev.links, { title: '', url: '' }]
        }));
    };

    const handleRemoveLink = (index) => {
        setAboutFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
    };

    const handleLinkChange = (index, field, value) => {
        setAboutFormData(prev => ({
            ...prev,
            links: prev.links.map((link, i) => 
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    const handleAboutUpdate = async () => {
        try {
            setIsUpdatingAbout(true);
            aboutFormData.links = aboutFormData.links.filter((link) => link.title !== "" && link.url !== "");
            
            const response = await updateProfile('/users/update-profile', aboutFormData);
            if (response?.data) {
                // Don't update the user store since these fields are not stored there
                setIsEditingAbout(false);
            }
        } catch (error) {
            console.error('Error updating about section:', error);
        } finally {
            setIsUpdatingAbout(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">About</h2>
                    {!isEditingAbout ? (
                        <button
                            onClick={() => setIsEditingAbout(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit About
                        </button>
                    ) : null}
                </div>

                {isEditingAbout ? (
                    <div className="space-y-8">
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={aboutFormData.description}
                                onChange={(e) => setAboutFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                                rows={4}
                                placeholder="Tell people about yourself..."
                            />
                        </div>

                        {/* Links */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Links
                                </label>
                                <button
                                    onClick={handleAddLink}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Link
                                </button>
                            </div>
                            <div className="space-y-4">
                                {aboutFormData.links.map((link, index) => (
                                    <div key={index} className="flex gap-3 items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="text"
                                                value={link.title}
                                                onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                placeholder="Link Title"
                                            />
                                            <div className="flex gap-2 items-center">
                                                <LinkIcon className="w-4 h-4 text-blue-500" />
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveLink(index)}
                                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleAboutUpdate}
                                disabled={isUpdatingAbout}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors duration-200"
                            >
                                {isUpdatingAbout ? (
                                    <>
                                        <LoaderOne />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save Changes</span>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingAbout(false);
                                    setAboutFormData({
                                        description: userInfo?.description || '',
                                        links: userInfo?.links || []
                                    });
                                }}
                                disabled={isUpdatingAbout}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Description Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-700/30 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Description</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {userInfo?.description || 'No description provided'}
                            </p>
                        </div>

                        {/* Links Section */}
                        {userInfo?.links && userInfo.links.length > 0 && (
                            <div className="bg-white dark:bg-gray-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Links</h3>
                                <div className="grid gap-3">
                                    {userInfo.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600/50 group transition-colors duration-200"
                                        >
                                            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-colors duration-200">
                                                <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                {link.title}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Section */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl flex flex-col items-center">
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg mb-2">
                                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{dayjs(userInfo?.createdAt).format('MMM D, YYYY')}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl flex flex-col items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg mb-2">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Subscribers</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{userInfo?.subscribersCount || 0}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl flex flex-col items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg mb-2">
                                    <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Videos</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">{totalVideos}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 