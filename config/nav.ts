import {
  LayoutDashboard,
  FlaskConical,
  Home,
  Library,
  Map,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  external?: boolean;
}

export const mainNav: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Paths", href: "/paths", icon: Map, description: "Guided curriculum sequences" },
  {
    title: "Technologies",
    href: "/technologies",
    icon: Library,
    description: "Browse every technology",
  },
  { title: "Labs", href: "/labs", icon: FlaskConical, description: "Hands-on challenges" },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Your progress" },
  { title: "Search", href: "/search", icon: Search },
];

export const secondaryNav: NavItem[] = [{ title: "Settings", href: "/settings", icon: Settings }];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Learn",
    links: [
      { title: "Learning Paths", href: "/paths" },
      { title: "Technologies", href: "/technologies" },
      { title: "Labs", href: "/labs" },
      { title: "Playgrounds", href: "/technologies" },
    ],
  },
  {
    title: "Product",
    links: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Search", href: "/search" },
      { title: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Community",
    links: [
      { title: "About", href: "/about" },
      { title: "GitHub", href: "https://github.com/Emmraan/Codiq", external: true },
      {
        title: "Contribute",
        href: "https://github.com/Emmraan/Codiq/blob/main/CONTRIBUTING.md",
        external: true,
      },
    ],
  },
];
