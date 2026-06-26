export interface NavItem {
  label: string;
  href: string;
  code: string;
}

export const APP_NAV_ITEMS: NavItem[] = [
  { code: "00", label: "Overview", href: "/app" },
  { code: "01", label: "Dossier", href: "/dossier" },
  { code: "02", label: "Advisor", href: "/advisor" },
  { code: "03", label: "Account", href: "/app/account" },
];

export function isNavActive(pathname: string | null, href: string) {
  return (
    pathname === href ||
    (href !== "/app" && (pathname?.startsWith(href) ?? false))
  );
}
