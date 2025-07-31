import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../lib/api';
import useUserStore from '../../store/useUserStore';
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { useFetch } from '../../lib/api';

export default function SubscribeButton({ channelId, onSubscriptionChange }) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { mutate: toggleSubscribe } = usePost();

  const { data: userVideoSubscriptionData} = useFetch(
    channelId ? `/subscriptions/v/${channelId}` : null
  );

  const userSubscription = userVideoSubscriptionData?.data?.subscribe;

  useEffect(() => {
    setIsSubscribed(userSubscription);
  }, [userSubscription]);

  const handleSubscribe = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      const newSubscriptionState = !isSubscribed;
      setIsSubscribed(newSubscriptionState);
      onSubscriptionChange?.(newSubscriptionState);
      
      await toggleSubscribe(`/subscriptions/c/${channelId}`);
    } catch (error) {
      console.log(error);
      setIsSubscribed(isSubscribed);
      onSubscriptionChange?.(isSubscribed);
    }
  };

  return (
    <button 
      onClick={handleSubscribe}
      className={`relative overflow-hidden group flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
        isSubscribed 
        ? 'bg-gray-200 hover:bg-gray-300 dark:bg-black-600 dark:hover:bg-black-500 text-gray-900 dark:text-white' 
        : 'bg-black hover:bg-black-800 text-white dark:text-black dark:bg-gray-200 dark:hover:bg-white font-semibold'
      }`}
    >
      <div className={`flex items-center transition-transform duration-300 ${isSubscribed ? '-translate-y-40' : ''}`}>
        <span>Subscribe</span>
        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 font-semibold ${isSubscribed ? '' : 'translate-y-full'}`}>
        <CheckIcon className="mr-2 size-4" />
        <span>Subscribed</span>
      </div>
    </button>
  );
} 