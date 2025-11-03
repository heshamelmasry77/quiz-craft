import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "neutral" | "danger";
type Size = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const cx = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(" ");

export default function Button({ variant = "neutral", size = "md", className, ...rest }: Props) {
  const base =
    "rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-2 py-1",
    md: "px-3 py-2",
  } as const;

  const variants: Record<Variant, string> = {
    primary: "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
    neutral: "bg-white border-gray-300 text-gray-800 hover:bg-gray-50",
    danger: "bg-white border-red-300 text-red-600 hover:bg-red-50",
  };

  return <button className={cx(base, sizes[size], variants[variant], className)} {...rest} />;
}
