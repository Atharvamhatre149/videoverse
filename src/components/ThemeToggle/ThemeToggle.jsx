import useThemeStore from "@/store/useThemeStore";

export default function ThemeToggle(){
  const {theme, toggleTheme}= useThemeStore()
  
  return(
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-transform duration-200 active:scale-90"
      aria-label="Toggle theme"
    >
      {theme === "light" ? '☀️' : '🌙'}
    </button>
  )


}