import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  icons: {
    icon: "/logo.svg",
  },
  title: "1AI",
  description: "1AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel defaultSize={15}>
              <Sidebar />
            </ResizablePanel>
            <ResizablePanel defaultSize={85}>
              <main className="h-full p-2">{children}</main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ThemeProvider>
      </body>
    </html>
  );
}
