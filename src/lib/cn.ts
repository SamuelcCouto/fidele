type ClassValue = string | false | null | undefined;

/** Junta classes condicionais sem dependência externa. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
