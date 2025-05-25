"use client"

import * as React from "react"
import {
  Music,
  BookIcon,
  LayoutDashboardIcon,
  Grid3X3,
  HelpCircle,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SetupHelpModal } from "@/components/setup-help-modal"
import { useState } from "react"

const data = {
  user: {
    name: "Made By: WillyV3",
    email: "",
    avatar: "/profile.jpeg",
    bio: "@humanfrontierlabs."
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Composer",
      url: "/dashboard/compose",
      icon: Music,
    },
    {
      title: "Sequencer",
      url: "/dashboard/sequencer",
      icon: Grid3X3,
    },
  ],
  navSecondary: [
    {
      title: "Sonic Pi Docs",
      url: "/dashboard/docs",
      icon: BookIcon,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [showSetupHelp, setShowSetupHelp] = useState(false)
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Music className="h-5 w-5" />
                <span className="text-base font-semibold">Sonic Pi Composer</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 w-full">
          <button
            type="button"
            onClick={() => setShowSetupHelp(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors w-full justify-center"
          >
            <HelpCircle className="h-4 w-4 text-primary" />
            <span>Setup Help</span>
            <Sparkles className="h-3 w-3 text-primary animate-pulse ml-1" />
          </button>
          <NavUser user={data.user} />
        </div>
        <SetupHelpModal open={showSetupHelp} onOpenChange={setShowSetupHelp} />
      </SidebarFooter>
    </Sidebar>
  )
}
