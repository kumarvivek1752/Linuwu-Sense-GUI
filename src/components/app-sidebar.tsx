"use client";

import * as React from "react";
import {
  BatteryChargingIcon,
  BatteryMediumIcon,
  FanIcon,
  KeyboardIcon,
  MonitorIcon,
  PlugZapIcon,
  PowerSquareIcon,
  SunIcon,
  SettingsIcon,
} from "lucide-react";

import { NavSecondary } from "@/components/nav-secondary";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mod-toggle";

// This is sample data.
const data = {
  user: {
    name: "LinuwuSense",
    email: "kumarvivek1752@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Keyboard Control",
      url: "/dashboard/keyboard",
      icon: KeyboardIcon,
    },
    {
      title: "Fan Control",
      url: "/dashboard/fan",
      icon: FanIcon,
    },
    {
      title: "Backlight Timeout",
      url: "/dashboard/backlight-timeout",
      icon: SunIcon,
    },
    {
      title: "Battery Limiter",
      url: "/dashboard/battery-limiter",
      icon: BatteryMediumIcon,
    },
    {
      title: "Boot Animation Sound",
      url: "/dashboard/boot-animation-sound",
      icon: PowerSquareIcon,
    },
    {
      title: "LCD Override",
      url: "/dashboard/lcd-override",
      icon: MonitorIcon,
    },
    {
      title: "USB Charging",
      url: "/dashboard/usb-charging",
      icon: PlugZapIcon,
    },
    {
      title: "Battery Calibration",
      url: "/dashboard/battery-calibration",
      icon: BatteryChargingIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex flex-row items-center justify-between">
                <SettingsIcon className="size-5" />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Linuwu Sense</span>
                  <span className="">v1.0.0</span>
                </div>
                <ModeToggle />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
