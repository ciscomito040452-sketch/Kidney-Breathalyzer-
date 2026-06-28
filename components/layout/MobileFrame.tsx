interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]">
      <div className="mobile-frame relative mx-auto min-h-screen w-full max-w-app bg-[var(--bg-primary)] shadow-mobile">
        {children}
      </div>
    </div>
  );
}
