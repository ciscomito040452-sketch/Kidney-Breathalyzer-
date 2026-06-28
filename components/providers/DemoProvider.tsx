"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DeviceStatus } from "@/types/measurement";

interface DemoContextValue {
  isDemo: boolean;
  deviceStatus: DeviceStatus;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const DEMO_STORAGE_KEY = "kidney-breathalyzer-demo";

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    setIsDemo(stored === "true");
    setHydrated(true);
  }, []);

  const enterDemoMode = useCallback(() => {
    localStorage.setItem(DEMO_STORAGE_KEY, "true");
    setIsDemo(true);
  }, []);

  const exitDemoMode = useCallback(() => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setIsDemo(false);
  }, []);

  const deviceStatus: DeviceStatus = isDemo ? "demo" : "disconnected";

  const value = useMemo(
    () => ({
      isDemo: hydrated ? isDemo : false,
      deviceStatus: hydrated ? deviceStatus : "disconnected",
      enterDemoMode,
      exitDemoMode,
    }),
    [hydrated, isDemo, deviceStatus, enterDemoMode, exitDemoMode]
  );

  return (
    <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return context;
}
