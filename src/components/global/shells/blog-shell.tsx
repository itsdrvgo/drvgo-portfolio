import { ReactNode } from "react";

function BlogShell({ children }: { children: ReactNode }) {
    return <section className="container py-5 md:py-10">{children}</section>;
}

export default BlogShell;
