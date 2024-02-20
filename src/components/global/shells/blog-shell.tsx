import { ReactNode } from "react";

function BlogShell({ children }: { children: ReactNode }) {
    return (
        <section className="flex justify-center p-5 md:py-10">
            <div className="max-w-6xl space-y-8">{children}</div>
        </section>
    );
}

export default BlogShell;
