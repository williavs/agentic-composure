'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle, Sparkles } from "lucide-react"
import { SetupHelpModal } from "@/components/setup-help-modal"

export function SetupHelpButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="relative group hover:bg-primary/10 transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5 text-primary animate-pulse" />
              <span className="sr-only">Setup Help</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Need help setting up Sonic Pi?</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SetupHelpModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  )
} 