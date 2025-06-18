import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle('dark', theme === 'dark')
      },
      toggleTheme: () => 
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
          return { theme: newTheme }
        })
    }),
    {
      name: 'theme-storage',
    }
  )
)

 
// Initialize theme based on system preference
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme-storage')
  if(savedTheme){
      const parsedTheme = JSON.parse(savedTheme)
      const theme = parsedTheme.state.theme
      useThemeStore.getState().setTheme(theme)
  }
  else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    useThemeStore.getState().setTheme('dark')  
  }
}

export default useThemeStore