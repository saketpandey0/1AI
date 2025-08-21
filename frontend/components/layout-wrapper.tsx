"use client";

import { useState, createContext, useContext } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Sidebar from "@/components/sidebar";

interface LayoutContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutWrapper");
  }
  return context;
};

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <LayoutContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <ResizablePanel
          defaultSize={sidebarOpen ? 15 : 0}
          minSize={sidebarOpen ? 15 : 0}
          maxSize={sidebarOpen ? 25 : 0}
        >
          <Sidebar />
        </ResizablePanel>
        <ResizablePanel defaultSize={sidebarOpen ? 85 : 100}>
          <main className="h-full p-2">{children}</main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </LayoutContext.Provider>
  );
}
