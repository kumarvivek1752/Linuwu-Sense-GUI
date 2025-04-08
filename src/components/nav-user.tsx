"use client";

import Link from "next/link";

import { CoffeeIcon, CreditCardIcon, GithubIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <CoffeeIcon />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Support me</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <GithubIcon />
                <Link
                  href="https://github.com/kumarvivek1752/Linuwu-Sense-GUI"
                  target="_blank"
                >
                  Github
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CoffeeIcon />
                <Link
                  href="https://buymeacoffee.com/kumarvivek1752"
                  target="_blank"
                >
                  Buy me a coffee
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                <Link
                  href="https://paypal.me/kumarvivek1752?country.x=IN&locale.x=en_GB"
                  target="_blank"
                >
                  PayPal
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
