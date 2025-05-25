'use client'

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Moon, Sun, PlusCircle, Music, Volume2 } from "lucide-react"
import { useTheme } from "next-themes"
import { useNowPlaying } from "@/contexts/NowPlayingContext"
import { useQuickCreate } from "@/contexts/QuickCreateContext"
import { SetupHelpButton } from "@/components/setup-help-button"

export function SiteHeader() {
  const { isPlaying, currentCode } = useNowPlaying();
  const { openModal } = useQuickCreate();
  
  const isModifyMode = isPlaying && currentCode;

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Music Composer</h1>
        
        {/* Setup Help Button */}
        <div className="ml-2">
          <SetupHelpButton />
        </div>
        
        {/* Dynamic Quick Create Button */}
        <div className="ml-auto mr-4">
          <Button
            onClick={openModal}
            size="sm"
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isModifyMode ? (
              <>
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Modify Music</span>
                <span className="sm:hidden">Modify</span>
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Create</span>
                <span className="sm:hidden">Create</span>
              </>
            )}
            {isModifyMode && (
              <Volume2 className="h-3 w-3 animate-pulse ml-1" />
            )}
          </Button>
        </div>
        
        {/* Theme Toggle */}
        <div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
