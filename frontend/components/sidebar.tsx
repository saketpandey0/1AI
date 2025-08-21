"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { PanelLeftClose, Menu, SidebarIcon } from "lucide-react";
import { useLayout } from "./layout-wrapper";
import { useState } from "react";
import PaymentModal from "./PaymentModal";
import PaymentComponent from "./PaymentModal";

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useLayout();
  return (
    <>
      {/* Toggle button for when sidebar is closed */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-3.5 left-3.5 z-50"
        >
          <SidebarIcon className="h-4 w-4" />
        </Button>
      )}

      <aside
        className={`sticky top-0 hidden h-screen flex-col overflow-x-hidden overflow-y-auto p-2 md:flex w-full transition-all duration-200 ease-out ${
          sidebarOpen ? "-translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="top-0 h-full rounded-2xl p-2 flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8"
              >
                <SidebarIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="accent" className="text-center w-full" size="lg">
                New Chat
              </Button>
              <PaymentComponent />
              <div className="text-sm px-4 py-2 hover:bg-primary/10 rounded-lg cursor-pointer transition-all duration-150 truncate text-secondary-foreground whitespace-nowrap">
                A Very Good Prompt A Very Good Prompt
              </div>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex gap-2 items-center px-4 py-3 cursor-pointer">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>DN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <p className="text-sm font-semibold">Deez Nuts</p>
                  <span className="text-xs text-muted-foreground">Pro</span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={10}
              className="max-w-48"
            >
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  <p>Logout</p>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </aside>
    </>
  );
}
