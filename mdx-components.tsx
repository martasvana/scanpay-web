import type { MDXComponents } from 'mdx/types';
import { ReactNode } from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Add custom components here if needed
    ...components,
    h1: ({ children }: { children: ReactNode }) => (
      <h1 className="text-3xl font-bold text-gray-900 my-6">{children}</h1>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children: ReactNode }) => (
      <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">{children}</h3>
    ),
    p: ({ children }: { children: ReactNode }) => (
      <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: { children: ReactNode }) => (
      <ul className="list-disc list-inside mb-4 ml-2 text-gray-700">{children}</ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 ml-2 text-gray-700">{children}</ol>
    ),
    li: ({ children }: { children: ReactNode }) => (
      <li className="mb-1">{children}</li>
    ),
    strong: ({ children }: { children: ReactNode }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }: { children: ReactNode }) => (
      <em className="italic text-gray-800">{children}</em>
    ),
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-gray-50 rounded text-gray-700 italic">{children}</blockquote>
    ),
    a: ({ href, children }: { href?: string; children: ReactNode }) => (
      <a href={href} className="text-purple-600 hover:text-purple-800 underline" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    ),
    hr: () => <hr className="my-8 border-gray-200" />,
  };
} 