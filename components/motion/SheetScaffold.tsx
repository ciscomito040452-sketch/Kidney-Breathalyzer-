"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface SheetScaffoldProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeLabel: string;
  ariaLabelledBy?: string;
  header: ReactNode;
  children: ReactNode;
  sheetClassName?: string;
  align?: "bottom" | "centerOnDesktop";
}

export function SheetScaffold({
  open,
  onOpenChange,
  closeLabel,
  ariaLabelledBy,
  header,
  children,
  sheetClassName,
  align = "bottom",
}: SheetScaffoldProps) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleClose() {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onOpenChange(false);
    }, 250);
  }

  if ((!open && !closing) || !mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-end justify-center",
        align === "centerOnDesktop" && "sm:items-center"
      )}
      role="presentation"
    >
      <button
        type="button"
        className={cn(
          "absolute inset-0 bg-black/40 kb-backdrop-fade",
          closing && "kb-backdrop-fade-out"
        )}
        aria-label={closeLabel}
        onClick={handleClose}
      />
      <div
        className={cn(
          "relative z-10 flex w-full max-w-app flex-col bg-[var(--bg-canvas)] shadow-mobile kb-sheet-up",
          align === "bottom"
            ? "max-h-[min(88vh,720px)] rounded-t-2xl"
            : "max-h-[min(88vh,720px)] rounded-t-2xl sm:max-h-[min(88vh,640px)] sm:rounded-3xl",
          closing && "kb-sheet-down",
          sheetClassName
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        {header}
        {children}
      </div>
    </div>,
    document.body
  );
}
