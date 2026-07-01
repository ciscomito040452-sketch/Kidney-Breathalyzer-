interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-[var(--bg-canvas)]">
      <div className="mobile-frame relative mx-auto min-h-dvh w-full max-w-app overflow-x-hidden bg-[var(--bg-primary)] shadow-mobile">
        {children}
      </div>
    </div>
  );
}
