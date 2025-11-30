import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex justify-end p-4">
        <ModeToggle />
      </div>
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Light/Dark Theme Demo</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Use the toggle to switch themes.
        </p>
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-100">
          <p>This box adapts to the current theme.</p>
          <button className="mt-4 rounded-md bg-gray-900 px-3 py-2 text-white dark:bg-white dark:text-gray-900">
            Themed Button
          </button>
        </div>
      </main>
    </ThemeProvider>
  )
}

export default App