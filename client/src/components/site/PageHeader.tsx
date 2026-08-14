interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 sm:py-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 85% 0%, rgba(217,164,65,0.18) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-display text-4xl font-extrabold text-white sm:text-5xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-navy-100">{description}</p>
        )}
      </div>
    </section>
  );
}