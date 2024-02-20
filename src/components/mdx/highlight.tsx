function MdxHighlight({ content }: { content: string }) {
    return (
        <code className="rounded-md bg-default-100 p-1 before:content-none after:content-none">
            {content}
        </code>
    );
}

export default MdxHighlight;
