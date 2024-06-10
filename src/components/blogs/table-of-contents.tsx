import Link from "next/link";

export function TableOfContents({ content }: { content: string }) {
    const headings = content.match(/#{1,6} .+/g);
    if (!headings) return null;

    const headingsWithId = headings.map((heading) => {
        const headingText = heading.replace(/#{1,6} /, "");
        const headingId = headingText
            .toLowerCase()
            .replace(/\s/g, "-")
            .replace(/:$/, "");

        return {
            text: headingText,
            id: headingId,
        };
    });

    return (
        <ul className="mb-0 lg:mb-0">
            {headingsWithId.map((heading) => (
                <li
                    key={heading.text}
                    className="marker:text-foreground lg:my-0"
                >
                    <Link
                        href={"#" + heading.id}
                        className="text-muted-foreground no-underline transition-all ease-in-out hover:text-foreground"
                    >
                        {heading.text}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
