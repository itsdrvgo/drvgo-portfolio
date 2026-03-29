interface Props {
    content: string;
}

export function MdxHighlight({ content }: Props) {
    return (
        <code className="rounded-md border border-primary/15 bg-primary/5 px-1.5 py-0.5 text-primary before:content-none after:content-none">
            {content}
        </code>
    );
}
