import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import SideNav from '../components/Navbar/SideNav'
import AuthNavigator from '../components/AuthNavigator'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-200">
      <AuthNavigator />
      <Navbar />
      <SideNav />
      <main className="md:ml-20 pb-16 md:pb-0">  
        <Outlet />
      </main>
    </div>
  )
}