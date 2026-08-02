/**
 * MDX compilation + extraction helpers used by the build pipeline.
 *
 * `compileMdx` produces the final ESM that the app renders: remark-gfm for
 * tables/task lists, rehype-slug for heading anchors, and a `useMDXComponents`
 * provider import that wires the custom component set from
 * `lib/mdx-components.tsx` (see the Next.js App Router MDX convention).
 *
 * The same single pass extracts the headings (ids generated with the same
 * github-slugger algorithm as rehype-slug) and plain-text body for the search
 * index.
 */
import { compile } from "@mdx-js/mdx";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export interface ContentHeading {
  depth: number;
  text: string;
  id: string;
}

export interface CompiledContent {
  /** Final ESM program that default-exports an `MDXContent` component. */
  code: string;
  headings: ContentHeading[];
  /** Plain-text body for search indexing. */
  text: string;
}

/** Minimal structural view of the mdast tree (no extra AST deps required). */
interface MdxNode {
  type?: string;
  depth?: number;
  value?: string;
  children?: MdxNode[];
}

/** Concatenated inline text of a node (headings, links, inline code, …). */
function nodeText(node: MdxNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  if (node.children) return node.children.map(nodeText).join("");
  return "";
}

/** Collapse whitespace so the index is compact and search-friendly. */
export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function collectContent(
  tree: MdxNode,
  slugs: GithubSlugger,
): { headings: ContentHeading[]; textParts: string[] } {
  const headings: ContentHeading[] = [];
  const textParts: string[] = [];

  const walk = (node: MdxNode): void => {
    if (node.type === "heading" && node.children) {
      const text = nodeText(node).trim();
      if (text) {
        headings.push({ depth: node.depth ?? 2, text, id: slugs.slug(text) });
      }
    }
    if (
      (node.type === "text" || node.type === "inlineCode" || node.type === "code") &&
      node.value
    ) {
      textParts.push(node.value);
    }
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  };

  walk(tree);
  return { headings, textParts };
}

export async function compileMdx(source: string): Promise<CompiledContent> {
  const slugs = new GithubSlugger();
  let headings: ContentHeading[] = [];
  let textParts: string[] = [];

  const remarkCollect = () => (tree: MdxNode) => {
    const collected = collectContent(tree, slugs);
    headings = collected.headings;
    textParts = collected.textParts;
  };

  const file = await compile(matter(source).content, {
    format: "mdx",
    outputFormat: "program",
    providerImportSource: "@/lib/mdx-components",
    remarkPlugins: [remarkGfm, remarkCollect],
    rehypePlugins: [rehypeSlug],
  });

  return {
    code: String(file),
    headings,
    text: normalizeText(textParts.join(" ")),
  };
}
