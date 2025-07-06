import React from 'react';
import useUserStore from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';

export default function You() {
    const { user } = useUserStore();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="pt-16 p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Your Channel</h1>
                <p className="text-gray-500 mb-4">Sign in to access your channel</p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="pt-16 p-4">
            <div className="max-w-4xl mx-auto">
                {/* User Header */}
                <div className="flex items-center gap-4 mb-8">
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-20 h-20 rounded-full object-cover"
                        onError={(e) => {
                            e.target.src = `https://via.placeholder.com/80x80?text=${user.username.charAt(0).toUpperCase()}`;
                        }}
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{user.username}</h1>
                        <p className="text-gray-500">{user.fullName}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
                    <div className="flex gap-4">
                        <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-500">
                            Videos
                        </button>
                        <button className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            About
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Video content will go here */}
                    <div className="text-center text-gray-500">
                        Your videos will appear here
                    </div>
                </div>
            </div>
        </div>
    );
} 