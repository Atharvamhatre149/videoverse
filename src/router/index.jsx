import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../containers/Home/Home';
import VideoPlayer from '../containers/VideoPlayer/VideoPlayer';
import Login from '../containers/forms/Login';
import Register from '../containers/forms/Register';
import Upload from '../containers/forms/Upload';
import You from '../containers/You/You';
import Channel from '../containers/Channel/Channel';
import Profile from '../containers/Profile/Profile';
import Subscriptions from '@/containers/Subscriptions/Subscriptions';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'watch/:videoId',
                element: <VideoPlayer />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'upload',
                element: <Upload />
            },
            {
                path: 'you',
                element: <You />
            },
            {
                path: 'channel/:channelId',
                element: <Channel />
            },
            {
                path: 'subscriptions',
                element: <Subscriptions/>
            },
            {
                path: 'profile',
                element: <Profile />
            }
        ]
    }
]);