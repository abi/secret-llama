import { type ReactNode } from 'react';
import {
    Prism as SyntaxHighlighter,
    type SyntaxHighlighterProps,
} from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeMessage({
    children,
    className,
    ...rest
}: {
    children: ReactNode;
    className?: string;
} & Partial<Omit<SyntaxHighlighterProps, 'children'>>) {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
        <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={vscDarkPlus}
        />
    ) : (
        <code {...rest} className={className}>
            {children}
        </code>
    );
}

export default CodeMessage;
