interface Props {
    content: string;
}

export function MdxHighlight({ content }: Props) {
    return (
        <code className="rounded-md bg-card p-1 before:content-none after:content-none">
            {content}
        </code>
    );
}
