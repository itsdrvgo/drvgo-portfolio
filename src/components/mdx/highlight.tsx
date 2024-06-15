export function MdxHighlight({ content }: { content: string }) {
    return (
        <code className="rounded-md bg-card p-1 before:content-none after:content-none">
            {content}
        </code>
    );
}
