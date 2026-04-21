import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './markdown-renderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {

  const normalizeMarkdown = (text: string): string => {
    let normalized = text;

    normalized = normalized.replace(/([^\n])\n([-*+]\s)/g, '$1\n\n$2');
    normalized = normalized.replace(/([^\n])\n(\d+\.\s)/g, '$1\n\n$2');
    normalized = normalized.replace(/([^\n])\n(>\s)/g, '$1\n\n$2');
    normalized = normalized.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
    normalized = normalized.replace(/(#{1,6}\s[^\n]+)\n([^\n#])/g, '$1\n\n$2');

    return normalized;
  };

  const normalizedContent = normalizeMarkdown(content);

  return (
    <div className={styles.markdownContent}>
      <ReactMarkdown
        components={{
          h1: ({ children, ...props }) => (
            <h1 className={styles.h1} {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className={styles.h2} {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className={styles.h3} {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className={styles.h4} {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className={styles.h5} {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className={styles.h6} {...props}>
              {children}
            </h6>
          ),

          p: ({ children, ...props }) => (
            <p className={styles.p} {...props}>
              {children}
            </p>
          ),

          strong: ({ children, ...props }) => (
            <strong className={styles.strong} {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className={styles.em} {...props}>
              {children}
            </em>
          ),

          ul: ({ children, ...props }) => (
            <ul className={styles.ul} {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className={styles.ol} {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className={styles.li} {...props}>
              {children}
            </li>
          ),

          blockquote: ({ children, ...props }) => (
            <blockquote className={styles.blockquote} {...props}>
              {children}
            </blockquote>
          ),

          a: ({ href, children, ...props }) => (
            <a
              href={href}
              className={styles.a}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),

          img: ({ src, alt, ...props }) => {
            if (!src || src.trim() === '') {
              return null;
            }

            return (
              <span className={styles.imageBox}>
              <img
                src={src}
                alt={alt || 'image'}
                className={styles.image}
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.opacity = '0.5';
                  target.style.filter = 'grayscale(1)';
                }}
                {...props}
              />
              </span>
            );
          },

          hr: ({ ...props }) => (
            <hr className={styles.hr} {...props} />
          ),

          code: ({ inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <div className={styles.codeBlockWrapper}>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code className={styles.inlineCode} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;