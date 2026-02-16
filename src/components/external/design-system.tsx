import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type SectionTone = "base" | "surface" | "contrast";
type CardTone = "light" | "soft" | "dark";
type ButtonTone = "primary" | "secondary" | "ghost";

const SECTION_TONE_CLASS: Record<SectionTone, string> = {
  base: "bg-[#F5F7F4]",
  surface: "bg-white",
  contrast: "bg-[#1B4D3E]",
};

const CARD_TONE_CLASS: Record<CardTone, string> = {
  light: "bg-white text-[#1B4D3E] shadow-[0_4px_24px_rgba(0,0,0,0.03)]",
  soft: "bg-[#E8F5E9] text-[#1B4D3E]",
  dark: "bg-[#1B4D3E] text-white",
};

const BUTTON_TONE_CLASS: Record<ButtonTone, string> = {
  primary: "bg-[#2D5A45] text-white hover:bg-[#1B4D3E]",
  secondary: "border-2 border-[#2D5A45] text-[#2D5A45] hover:bg-[#2D5A45] hover:text-white",
  ghost: "border-2 border-white/30 text-white hover:bg-[#F5F7F4]/10 hover:border-white",
};

export function ExternalSection({
  tone = "base",
  className = "",
  containerClassName = "",
  id,
  children,
}: {
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`py-24 ${SECTION_TONE_CLASS[tone]} ${className}`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-10 ${containerClassName}`}>{children}</div>
    </section>
  );
}

export function ExternalEyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-sm font-medium tracking-[3px] text-[#7CB98A] mb-4 uppercase ${className}`}>
      {children}
    </div>
  );
}

export function ExternalHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`font-serif text-4xl lg:text-5xl text-[#1B4D3E] ${className}`}>{children}</h2>;
}

export function ExternalCard({
  tone = "light",
  className = "",
  children,
  ...props
}: {
  tone?: CardTone;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-lg p-8 ${CARD_TONE_CLASS[tone]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function externalButtonClass(tone: ButtonTone = "primary", className = "") {
  return `inline-block rounded-full px-6 py-3 font-medium transition-colors ${BUTTON_TONE_CLASS[tone]} ${className}`;
}

export function ExternalButton({
  tone = "primary",
  className = "",
  children,
  ...props
}: {
  tone?: ButtonTone;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={externalButtonClass(tone, className)} {...props}>
      {children}
    </button>
  );
}

export function ExternalMetric({
  label,
  value,
  helper,
  valueClassName = "",
}: {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div className={`font-serif text-4xl ${valueClassName}`}>{value}</div>
      {helper ? <p className="text-sm text-gray-600 mt-2">{helper}</p> : null}
    </div>
  );
}

export function ExternalEvidenceQuote({
  quote,
  source,
  date,
  tags,
  className = "",
}: {
  quote: string;
  source: string;
  date: string;
  tags?: string;
  className?: string;
}) {
  return (
    <div className={`border-l-4 border-red-400 pl-4 py-2 ${className}`}>
      <p className="text-gray-700 italic mb-2">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="capitalize">{source}</span>
        <span>&bull;</span>
        <span>{date}</span>
        {tags ? (
          <>
            <span>&bull;</span>
            <span className="text-red-600">{tags}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
