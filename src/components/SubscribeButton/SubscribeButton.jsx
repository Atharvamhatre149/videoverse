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
    console.log(userSubscription);
    setIsSubscribed(userSubscription);
  }, [userSubscription]);

  const handleSubscribe = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      console.log("current subscription",isSubscribed);
      
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
      className={`relative overflow-hidden group flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
        isSubscribed 
        ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white' 
        : 'bg-black hover:bg-gray-900 text-white'
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