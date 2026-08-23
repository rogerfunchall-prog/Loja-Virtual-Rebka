export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-7 text-center">
      <h2 className="section-title">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-[13px] text-ink-soft">{subtitle}</p>
      ) : null}
    </div>
  );
}
