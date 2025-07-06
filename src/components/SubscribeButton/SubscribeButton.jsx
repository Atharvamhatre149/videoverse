import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../lib/api';
import useUserStore from '../../store/useUserStore';
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { AnimatedSubscribeButton } from '../magicui/animated-subscribe-button';

export default function SubscribeButton({ channelId, initialSubscriptionStatus = false }) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isSubscribed, setIsSubscribed] = useState(initialSubscriptionStatus);
  const { mutate: toggleSubscribe } = usePost();

  useEffect(() => {
    setIsSubscribed(initialSubscriptionStatus);
  }, [initialSubscriptionStatus]);

  const handleSubscribe = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }
      
      setIsSubscribed(!isSubscribed);
      // await toggleSubscribe(`/subscriptions/toggle/${channelId}`);
    } catch (error) {
      console.log(error);
      setIsSubscribed(isSubscribed);
    }
  };

  return (
    <AnimatedSubscribeButton 
      onClick={handleSubscribe}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        isSubscribed 
        ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white' 
        : 'bg-black hover:bg-gray-900 text-white'
      }`}
    >
       <span className="group inline-flex items-center">
        Subscribe
        <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <span className="group inline-flex items-center">
        <CheckIcon className="mr-2 size-4" />
        Subscribed
      </span>
    </AnimatedSubscribeButton>
  );
} 