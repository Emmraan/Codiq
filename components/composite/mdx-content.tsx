import type { ComponentType } from "react";

interface MdxContentProps {
  /** Path relative to `lib/generated/` of a compiled MDX module. */
  path: string;
}

interface MdxModule {
  default: ComponentType;
}

/**
 * Loads a build-time-compiled MDX module from `lib/generated/mdx/` and renders
 * it with the custom component set from `lib/mdx-components.tsx`.
 */
export async function MdxContent({ path }: MdxContentProps) {
  const mod = (await import(`@/lib/generated/${path}`)) as MdxModule;
  const Content = mod.default;
  return <Content />;
}
