import React, { useState } from 'react';
import { Link as LinkIcon, Plus, X } from 'lucide-react';
import { LoaderOne } from "@/components/ui/loader";
import dayjs from 'dayjs';

export default function AboutSection({ user, setUser, updateProfile }) {
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isUpdatingAbout, setIsUpdatingAbout] = useState(false);
    const [aboutFormData, setAboutFormData] = useState({
        description: user?.description || '',
        links: user?.links || []
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
                setUser(response.data);
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
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">About</h2>
                    {!isEditingAbout ? (
                        <button
                            onClick={() => setIsEditingAbout(true)}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Edit About
                        </button>
                    ) : null}
                </div>

                {isEditingAbout ? (
                    <div className="space-y-6">
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={aboutFormData.description}
                                onChange={(e) => setAboutFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                rows={4}
                                placeholder="Tell people about yourself..."
                            />
                        </div>

                        {/* Links */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Links
                                </label>
                                <button
                                    onClick={handleAddLink}
                                    className="flex items-center text-sm text-blue-500 hover:text-blue-600"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Link
                                </button>
                            </div>
                            <div className="space-y-3">
                                {aboutFormData.links.map((link, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={link.title}
                                                onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 mb-2"
                                                placeholder="Link Title"
                                            />
                                            <div className="flex gap-2 items-center">
                                                <LinkIcon className="w-4 h-4 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveLink(index)}
                                            className="p-2 text-red-500 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <button
                                onClick={handleAboutUpdate}
                                disabled={isUpdatingAbout}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUpdatingAbout ? (
                                    <>
                                        <LoaderOne />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save</span>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditingAbout(false);
                                    setAboutFormData({
                                        description: user?.description || '',
                                        links: user?.links || []
                                    });
                                }}
                                disabled={isUpdatingAbout}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Description</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {user.description || 'No description provided'}
                            </p>
                        </div>

                        {user.links && user.links.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium mb-2">Links</h3>
                                <div className="space-y-2">
                                    {user.links.map((link, index) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            {link.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-medium mb-2">More Info</h3>
                            <div className="text-gray-600 dark:text-gray-400">
                                <p>Joined {dayjs(user.createdAt).format('MMMM D, YYYY')}</p>
                                <p>{user.subscribersCount || 0} subscribers</p>
                                <p>{user.totalVideos} videos</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 