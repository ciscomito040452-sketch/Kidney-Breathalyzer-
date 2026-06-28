import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      {children}
      <BottomNav />
    </div>
  );
}
