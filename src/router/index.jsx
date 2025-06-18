import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../containers/Home/Home'
import VideoPlayer from '../containers/VideoPlayer/VideoPlayer'

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
      }
    ]
  }
])