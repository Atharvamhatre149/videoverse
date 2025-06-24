import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../containers/Home/Home'
import VideoPlayer from '../containers/VideoPlayer/VideoPlayer'
import Register from '@/containers/forms/Register'
import Login from '@/containers/forms/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    children:[
      {
        index:true,
        element: <Home/>
      },
      {
        path: '/watch/:videoId',
        element: <VideoPlayer/>
      },
      {
        path: '/register',
        element: <Register/>
      },
      {
        path: 'login',
        element: <Login/>
      }
    ]
  }
])