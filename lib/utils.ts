// Minimal cn utility — avoids adding clsx as a dependency
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
