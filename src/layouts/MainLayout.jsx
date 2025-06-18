import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-black-700 text-gray-900 dark:text-white transition-colors duration-200">
      <Navbar />
      <main>  
        <Outlet />
      </main>
    </div>
  )
}