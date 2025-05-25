// Dashboard layout for (dashboard) route group
// Professional dashboard with sidebar navigation

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { GlobalPlaybackStatus } from "@/components/GlobalPlaybackStatus"
import { GlobalLoadingOverlay } from "@/components/GlobalLoadingOverlay"
import { NowPlayingProvider } from "@/contexts/NowPlayingContext"
import { QuickCreateProvider } from "@/contexts/QuickCreateContext"
import { QuickCreateModalWrapper } from "@/components/composer/QuickCreateModalWrapper"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NowPlayingProvider>
      <QuickCreateProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <SiteHeader />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4 @container/main">
              {children}
            </div>
          </SidebarInset>
          <GlobalPlaybackStatus />
          <GlobalLoadingOverlay />
          <QuickCreateModalWrapper />
        </SidebarProvider>
      </QuickCreateProvider>
    </NowPlayingProvider>
  );
}
