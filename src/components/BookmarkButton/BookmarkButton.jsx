import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Plus, Loader2 } from 'lucide-react';
import { IconButton } from '../animate-ui/buttons/icon';
import { usePost, useFetch, usePatch } from '../../lib/api';
import useUserStore from '../../store/useUserStore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../animate-ui/base/popover';

export default function BookmarkButton({ videoId }) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { mutate: createPlaylist } = usePost();
  const { mutate: toggleVideo } = usePatch();

  const { data: playlistsData } = useFetch(
    user ? '/playlist/names' : null
  );

  const { data: containingPlaylistsData } = useFetch(
    user ? `/playlist/v/${videoId}` : null
  );
   
  useEffect(() => {
  
    if (playlistsData?.data) {
      const playlistsWithCheckedState = playlistsData.data.map(playlist => ({
        ...playlist,
        hasVideo: containingPlaylistsData?.data?.some(p => p._id === playlist._id) || false
      }));
      setPlaylists(playlistsWithCheckedState);
    }
  }, [playlistsData, containingPlaylistsData]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const response = await createPlaylist('/playlist', { name: newPlaylistName });
      if (response?.data) {
        setPlaylists(prev => [...prev, { ...response.data, hasVideo: false }]);
        setNewPlaylistName('');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleCheckboxChange = async (playlist) => {
    setIsLoading(true);
    try {
      if (playlist.hasVideo) {
        // Remove video from playlist
        await toggleVideo(`/playlist/remove/${videoId}/${playlist._id}`);
      } else {
        // Add video to playlist
        await toggleVideo(`/playlist/add/${videoId}/${playlist._id}`);
      }

      // Update local state
      setPlaylists(prev => prev.map(p => 
        p._id === playlist._id 
          ? { ...p, hasVideo: !p.hasVideo }
          : p
      ));
    } catch (error) {
      console.error('Error toggling video in playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkClick = () => {
    if (!user) {
      navigate('/login');
      return false;
    }
    return true;
  };

  return (
    <Popover>
      <PopoverTrigger
        onClick={handleBookmarkClick}
        render={
          <IconButton
            icon={Bookmark}
          />
        }
      />
      <PopoverContent
        className="w-72 p-4 bg-white border-1 dark:border-0 border-gray-300 dark:bg-black-700"
        side="bottom"
        align="end"
        sideOffset={15}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 dark:text-white">Save to playlist</h3>
            
            {/* Create new playlist */}
            <form onSubmit={handleCreatePlaylist} className="flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Create new playlist"
                className="flex-1 px-3 py-1.5 rounded border border-gray-300 dark:border-black-600 dark:text-white bg-gray-50 dark:bg-black-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newPlaylistName.trim()}
                className="p-1.5 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Playlist list */}
          <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
            {isLoading && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            )}
            
            {!isLoading && Array.isArray(playlists) && playlists.filter(playlist => playlist.name !== "Watch History").map(playlist => (
              <label
                key={playlist._id}
                className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-black-600 dark:text-white rounded-md cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={playlist.hasVideo}
                    onChange={() => handleCheckboxChange(playlist)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span>{playlist.name}</span>
                </div>
              </label>
            ))}

            {(!playlists || playlists.length === 0) && !isLoading && (
              <p className="text-sm text-gray-500 text-center py-2">
                No playlists yet   
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 