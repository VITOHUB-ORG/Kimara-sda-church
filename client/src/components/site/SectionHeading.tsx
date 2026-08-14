interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  center,
  light,
}: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-balance ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg ${light ? "text-navy-100" : "text-gray-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}