import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';
import { ReactNode } from 'react';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                    // Headings
                    h1: ({ children, ...props }) => (
                        <h1 
                            className="text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0 leading-tight border-b border-gray-200 dark:border-zinc-700 pb-3" 
                            {...props}
                        >
                            {children}
                        </h1>
                    ),
                    h2: ({ children, ...props }) => (
                        <h2 
                            className="text-3xl font-bold text-gray-900 dark:text-white mb-5 mt-8 first:mt-0 leading-tight" 
                            {...props}
                        >
                            {children}
                        </h2>
                    ),
                    h3: ({ children, ...props }) => (
                        <h3 
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6 first:mt-0 leading-tight" 
                            {...props}
                        >
                            {children}
                        </h3>
                    ),
                    h4: ({ children, ...props }) => (
                        <h4 
                            className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6 first:mt-0 leading-tight" 
                            {...props}
                        >
                            {children}
                        </h4>
                    ),
                    h5: ({ children, ...props }) => (
                        <h5 
                            className="text-lg font-bold text-gray-900 dark:text-white mb-3 mt-4 first:mt-0 leading-tight" 
                            {...props}
                        >
                            {children}
                        </h5>
                    ),
                    h6: ({ children, ...props }) => (
                        <h6 
                            className="text-base font-bold text-gray-900 dark:text-white mb-3 mt-4 first:mt-0 leading-tight" 
                            {...props}
                        >
                            {children}
                        </h6>
                    ),

                    // Paragraphs
                    p: ({ children, ...props }) => (
                        <p 
                            className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-base" 
                            {...props}
                        >
                            {children}
                        </p>
                    ),

                    // Lists
                    ul: ({ children, ...props }) => (
                        <ul 
                            className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 pl-4" 
                            {...props}
                        >
                            {children}
                        </ul>
                    ),
                    ol: ({ children, ...props }) => (
                        <ol 
                            className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300 pl-4" 
                            {...props}
                        >
                            {children}
                        </ol>
                    ),
                    li: ({ children, ...props }) => (
                        <li 
                            className="text-gray-700 dark:text-gray-300 leading-relaxed" 
                            {...props}
                        >
                            {children}
                        </li>
                    ),

                    // Links
                    a: ({ children, href, ...props }) => (
                        <a 
                            href={href}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline underline-offset-2 transition-colors font-medium" 
                            {...props}
                        >
                            {children}
                        </a>
                    ),

                    // Code
                    code: ({ children, className, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code 
                                    className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-zinc-700" 
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code 
                                className={`block bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 p-4 rounded-lg text-sm font-mono border border-gray-200 dark:border-zinc-700 overflow-x-auto ${className}`} 
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },

                    // Pre (code blocks)
                    pre: ({ children, ...props }) => (
                        <pre 
                            className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 mb-4 overflow-x-auto" 
                            {...props}
                        >
                            {children}
                        </pre>
                    ),

                    // Blockquotes
                    blockquote: ({ children, ...props }) => (
                        <blockquote 
                            className="border-l-4 border-indigo-500 pl-6 py-2 mb-4 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-900 rounded-r-lg" 
                            {...props}
                        >
                            {children}
                        </blockquote>
                    ),

                    // Horizontal rule
                    hr: ({ ...props }) => (
                        <hr 
                            className="my-8 border-0 border-t border-gray-300 dark:border-zinc-600" 
                            {...props}
                        />
                    ),

                    // Tables
                    table: ({ children, ...props }) => (
                        <div className="overflow-x-auto mb-4">
                            <table 
                                className="min-w-full border border-gray-200 dark:border-zinc-700 rounded-lg" 
                                {...props}
                            >
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children, ...props }) => (
                        <thead 
                            className="bg-gray-50 dark:bg-zinc-800" 
                            {...props}
                        >
                            {children}
                        </thead>
                    ),
                    tbody: ({ children, ...props }) => (
                        <tbody 
                            className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700" 
                            {...props}
                        >
                            {children}
                        </tbody>
                    ),
                    tr: ({ children, ...props }) => (
                        <tr {...props}>
                            {children}
                        </tr>
                    ),
                    th: ({ children, ...props }) => (
                        <th 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-700" 
                            {...props}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children, ...props }) => (
                        <td 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700" 
                            {...props}
                        >
                            {children}
                        </td>
                    ),

                    // Images
                    img: ({ src, alt, ...props }) => {
                        if (!src || typeof src !== 'string') {
                            return null;
                        }
                        return (
                            <div className="mb-4">
                                <Image 
                                    src={src}
                                    alt={alt || ''}
                                    width={800}
                                    height={600}
                                    className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700" 
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </div>
                        );
                    },

                    // Strong/Bold
                    strong: ({ children, ...props }) => (
                        <strong 
                            className="font-bold text-gray-900 dark:text-white" 
                            {...props}
                        >
                            {children}
                        </strong>
                    ),

                    // Emphasis/Italic
                    em: ({ children, ...props }) => (
                        <em 
                            className="italic text-gray-700 dark:text-gray-300" 
                            {...props}
                        >
                            {children}
                        </em>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}