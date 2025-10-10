import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive";
  children: React.ReactNode;
}

export default function Card({
  variant = "default",
  children,
  className = "",
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white rounded-lg border border-gray-200",
    elevated: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow",
    interactive:
      "bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
