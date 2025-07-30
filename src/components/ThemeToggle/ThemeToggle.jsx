import useThemeStore from "@/store/useThemeStore";

export default function ThemeToggle(){
  const {theme, toggleTheme}= useThemeStore()
  
  return(
    <button
      onClick={toggleTheme}
      className="p-1.5 rounded-lg bg-gray-200 dark:bg-black-600 transition-transform duration-200 active:scale-90"
      aria-label="Toggle theme"
    >
      {theme === "light" ? '☀️' : '🌙'}
    </button>
  )


}