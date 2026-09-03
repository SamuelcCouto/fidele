import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import s from "./button.module.css";

type Variant = "solid" | "outline" | "buy";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export function Button({
  variant = "solid",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(s.base, s[variant], fullWidth && s.fullWidth, className)}
      {...props}
    />
  );
}
