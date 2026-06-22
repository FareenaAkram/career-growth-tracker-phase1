declare module "next/link" {
  import * as React from "react";

  export default function Link(props: {
    href: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    target?: string;
    rel?: string;
    prefetch?: boolean;
  }): React.ReactElement | null;
}

declare module "next/navigation" {
  export function notFound(): never;
  export function usePathname(): string;
  export function useRouter(): { push: (href: string) => void; replace: (href: string) => void; back: () => void };
  export function useSearchParams(): URLSearchParams;
  export function redirect(url: string): never;
}
