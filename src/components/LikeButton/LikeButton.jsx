import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../lib/api';
import useUserStore from '../../store/useUserStore';
import { IconButton } from '../animate-ui/buttons/icon';
import { useFetch } from '../../lib/api';

export default function LikeButton({ videoId, initialLikeCount = 0}) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { mutate: toggleLike } = usePost();

  const { data: userVideoLikeData} = useFetch(
    videoId ? `/likes/v/${videoId}` : null
  );
  
  const userLike = userVideoLikeData?.data?.like;

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  useEffect(() => {
    setIsLiked(userLike);
  }, [userLike]);

  const handleLike = async() => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      await toggleLike(`/likes/toggle/v/${videoId}`)
    } catch (error) {
      console.log(error); 
      // Revert state on error
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  return (
    <div 
      onClick={handleLike}
      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-black-600 dark:hover:bg-black-500 transition-colors text-sm md:text-base cursor-pointer"
    >
      <IconButton
        icon={Heart}
        active={isLiked}
        className="size-4 md:size-5"
      />
      <span className="font-medium min-w-[1.5rem] md:min-w-[2rem] text-center">{likeCount}</span>
    </div>
  );
} 