import React from 'react';
import { marked } from 'marked';

export default function MDXContent({ content }: { content: string }) {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Convert markdown to HTML
  const htmlContent = marked(content);

  return (
    <article className="mdx-content">
      <style jsx>{`
        .mdx-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          line-height: 1.75;
          color: var(--ink);
          font-family: var(--font-body);
        }

        .mdx-content :global(h1) {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 600;
          margin: 2rem 0 1.5rem 0;
          line-height: 1.2;
          color: var(--ink);
        }

        .mdx-content :global(h2) {
          font-family: var(--font-display);
          font-size: 1.875rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          line-height: 1.3;
          color: var(--ink);
          border-bottom: 2px solid var(--moss-light);
          padding-bottom: 0.5rem;
        }

        .mdx-content :global(h3) {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: var(--moss);
        }

        .mdx-content :global(p) {
          margin: 1.25rem 0;
          text-align: justify;
        }

        .mdx-content :global(em) {
          font-style: italic;
          color: var(--moss);
        }

        .mdx-content :global(strong) {
          font-weight: 600;
          color: var(--moss);
        }

        .mdx-content :global(ul),
        .mdx-content :global(ol) {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .mdx-content :global(li) {
          margin: 0.75rem 0;
        }

        .mdx-content :global(blockquote) {
          border-left: 4px solid var(--moss);
          padding-left: 1.5rem;
          margin: 2rem 0;
          color: var(--stone);
          font-style: italic;
        }

        .mdx-content :global(code) {
          font-family: var(--font-mono);
          background: var(--milk-deep);
          color: var(--moss);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .mdx-content :global(pre) {
          background: var(--ink);
          color: var(--milk);
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .mdx-content :global(pre) :global(code) {
          background: none;
          color: inherit;
          padding: 0;
          border-radius: 0;
        }

        .mdx-content :global(hr) {
          border: none;
          height: 2px;
          background: var(--chalk);
          margin: 3rem 0;
        }

        .mdx-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          border: 1px solid var(--chalk);
        }

        .mdx-content :global(th) {
          background: var(--milk-deep);
          border: 1px solid var(--chalk);
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: var(--moss);
          font-family: var(--font-display);
        }

        .mdx-content :global(td) {
          border: 1px solid var(--chalk);
          padding: 0.75rem;
        }

        .mdx-content :global(tr:nth-child(even)) {
          background: var(--milk-deep);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .mdx-content {
            padding: 1.5rem 1rem;
          }

          .mdx-content :global(h1) {
            font-size: 1.875rem;
            margin: 1.5rem 0 1rem 0;
          }

          .mdx-content :global(h2) {
            font-size: 1.35rem;
            margin: 1.5rem 0 0.75rem 0;
          }

          .mdx-content :global(h3) {
            font-size: 1.1rem;
            margin: 1.25rem 0 0.5rem 0;
          }

          .mdx-content :global(ul),
          .mdx-content :global(ol) {
            padding-left: 1.5rem;
          }

          .mdx-content :global(pre) {
            padding: 1rem;
            font-size: 0.75rem;
          }

          .mdx-content :global(table) {
            font-size: 0.9rem;
          }

          .mdx-content :global(th),
          .mdx-content :global(td) {
            padding: 0.5rem;
          }
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: htmlContent as string }} />
    </article>
  );
}
