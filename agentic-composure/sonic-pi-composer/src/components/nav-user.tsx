"use client"

import {
  MoreVerticalIcon,
  GithubIcon,
  LinkedinIcon,
  GlobeIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { hflPromo, projects, socials } from "@/data/user-footer-content"

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="h-5 w-5" />,
  linkedin: <LinkedinIcon className="h-5 w-5" />,
  globe: <GlobeIcon className="h-5 w-5" />,
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    bio?: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* User Info */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left">
                <Avatar className="h-9 w-9 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">WV3</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left">
                  <span className="truncate font-bold text-base leading-tight">{user.name}</span>
                  {user.bio && (
                    <span className="truncate text-xs text-muted-foreground">{user.bio}</span>
                  )}
                  {user.email && (
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Human Frontier Labs Promo */}
            <div className="flex items-center gap-3 mb-3 px-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hflPromo.logo} alt={hflPromo.name} className="h-9 w-9 rounded shadow" />
              <div>
                <div className="font-extrabold text-sm leading-tight text-primary">{hflPromo.name}</div>
                <div className="text-xs text-muted-foreground leading-tight font-medium">{hflPromo.tagline}</div>
              </div>
            </div>
            <Button asChild size="sm" className="w-full mb-3 font-semibold">
              <a href={hflPromo.link} target="_blank" rel="noopener noreferrer">
                {hflPromo.cta}
              </a>
            </Button>
            <Separator className="my-3" />

            {/* Projects List */}
            <div className="font-semibold mb-2 px-3 text-sm text-primary">Other Projects by Willy</div>
            <ul className="space-y-1 text-sm px-3 mb-2">
              {projects.map((proj) => (
                <li key={proj.name}>
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium"
                  >
                    {proj.name}
                    {proj.description ? (
                      <span className="text-muted-foreground font-normal"> – {proj.description}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
            <Separator className="my-3" />

            {/* Social Links */}
            <div className="flex gap-4 justify-center pb-2">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="hover:text-primary"
                >
                  {iconMap[s.icon] || s.name}
                </a>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
