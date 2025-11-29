"use client";

import { Toaster as Sonner } from "sonner";
import { useEffect, useState } from "react";

export function ResponsiveToaster() {
  const [position, setPosition] = useState<"top-center" | "bottom-right">(
    "top-center"
  );

  useEffect(() => {
    const handleResize = () => {
      // Mobile breakpoint (768px)
      if (window.innerWidth < 768) {
        setPosition("top-center");
      } else {
        setPosition("bottom-right");
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Sonner
      position={position}
      expand={true}
      richColors={false} // Disable default richColors to use our custom styles
      closeButton
      theme="dark" // Force dark theme for the premium look
      toastOptions={{
        duration: 4000,
        className:
          "glass-card border-border shadow-2xl backdrop-blur-xl font-sans",
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-950 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "!bg-zinc-950 !border-amber-500/50 !text-white !shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
          error:
            "!bg-zinc-950 !border-red-500/50 !text-white !shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]",
          info: "!bg-zinc-950 !border-blue-500/50 !text-white !shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]",
          warning:
            "!bg-zinc-950 !border-orange-500/50 !text-white !shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]",
        },
      }}
    />
  );
}
