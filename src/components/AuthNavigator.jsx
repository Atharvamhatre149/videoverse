import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_EVENTS } from "../lib/api";

export default function AuthNavigator() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthEvent = () => {
      navigate('/login');
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleAuthEvent);
    window.addEventListener(AUTH_EVENTS.REFRESH_FAILED, handleAuthEvent);

    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleAuthEvent);
      window.removeEventListener(AUTH_EVENTS.REFRESH_FAILED, handleAuthEvent);
    };
  }, [navigate]);

  return null;
} 