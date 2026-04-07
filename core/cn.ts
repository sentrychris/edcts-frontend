/**
 * Merges class names, filtering out all falsy values.
 * Use instead of string concatenation or template literal conditionals.
 *
 * @example cn("base", condition && "extra", className)
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(" ");
}
