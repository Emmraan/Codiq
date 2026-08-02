import { iconMap, FALLBACK_ICON } from "@/lib/icons";

export function TechIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name ? iconMap[name] : undefined) ?? FALLBACK_ICON;
  return <Icon className={className} />;
}
