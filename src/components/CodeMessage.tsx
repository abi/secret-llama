import { useTimedToggle } from '@/hooks/useTimedToggle';
import { copyTextToClipboard } from '@/lib/utils';
import { FaCheck, FaRegClipboard } from 'react-icons/fa6';
import { useCallback, type ReactNode } from 'react';
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
    const [copied, setCopied] = useTimedToggle(3000);

    const onClickCopy = useCallback(() => {
        setCopied();
        copyTextToClipboard(String(children));
    }, [children, setCopied]);

    return match ? (
        <>
            <header className="text-xs flex">
                <span className="text-xs text-slate-500">{match[1]}</span>
                <button
                    className="ml-auto text-slate-400 hover:text-slate-100 flex gap-2"
                    onClick={onClickCopy}
                >
                    {copied ? (
                        <>
                            <FaCheck />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <FaRegClipboard />
                            <span>Copy code</span>
                        </>
                    )}
                </button>
            </header>
            <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={vscDarkPlus}
            />
        </>
    ) : (
        <code {...rest} className={className}>
            {children}
        </code>
    );
}

export default CodeMessage;
