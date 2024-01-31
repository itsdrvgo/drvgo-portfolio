import { ReactNode } from "react";

function BlogShell({ children }: { children: ReactNode }) {
    return (
        <section className="flex justify-center p-5 py-10">
            <div className="w-full max-w-2xl space-y-8 2xl:max-w-4xl">
                {children}
            </div>
        </section>
    );
}

export default BlogShell;
