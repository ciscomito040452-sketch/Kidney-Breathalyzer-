interface PageSectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageSectionHeader({ title, subtitle }: PageSectionHeaderProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
      )}
    </div>
  );
}
