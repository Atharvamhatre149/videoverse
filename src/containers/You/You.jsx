import React, { useEffect } from 'react';
import useUserStore from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../lib/api';
import HorizontalSection from '../../components/HorizontalSection/HorizontalSection';

export default function You() {
    const { user } = useUserStore();
    const navigate = useNavigate();

    const { data: likedVideosData } = useFetch(
        user ? '/likes/videos' : null
    );

    const { data: playlistsData } = useFetch(
        user ? '/playlist' : null
    );

    // Log data to check structure
    useEffect(() => {
  
        if (likedVideosData?.data) {
            console.log("Liked videos data:", likedVideosData.data[0]);
        }
        if (playlistsData?.data) {
            console.log("Playlist data:", playlistsData.data[0]);
        }
    }, [likedVideosData, playlistsData]);

    const likedVideos = likedVideosData?.data || [];
    const playlists = playlistsData?.data || [];

    // Process videos to ensure they have owner data
    const processVideos = (videos) => {
        return videos.map(video => ({
            ...video,
            owner: video.owner || video.creater || {}
        }));
    };
    
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
        <div className="pt-20 p-4">
            <div className="w-full max-w-7xl mx-auto">
                {/* User Header */}
                <div className="flex gap-5 mb-8">
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-30 h-30 rounded-full object-cover"
                        onError={(e) => {
                            e.target.src = `https://via.placeholder.com/80x80?text=${user.username.charAt(0).toUpperCase()}`;
                        }}
                    />
                    <div>
                        <h1 className="text-3xl font-bold pt-3">{user.fullname}</h1>
                        <p className="text-gray-500">{user.username}</p>
                    </div>
                </div>

                {/* Liked Videos Section */}
                <HorizontalSection
                    title="Liked Videos"
                    videos={processVideos(likedVideos)}
                    onSeeAll={() => navigate('/likes/videos')}
                />

                {/* Playlists Sections */}
                {playlists.map(playlist => (
                    <HorizontalSection
                        key={playlist._id}
                        title={playlist.name}
                        videos={processVideos(playlist.videos || [])}
                        onSeeAll={() => navigate(`/playlist/${playlist._id}`)}
                        playlistId={playlist._id}
                    />
                ))}

                {/* Empty State */}
                {!history.length && !likedVideos.length && !playlists.length && (
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-lg">No content yet</p>
                        <p className="mt-2">Videos you watch, like, or save will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
} 