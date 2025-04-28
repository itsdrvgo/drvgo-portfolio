import { ReactNode } from "react";

function GeneralShell({ children }: { children: ReactNode }) {
    return (
        <section className="flex justify-center p-5 py-10">
            <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
                {children}
            </div>
        </section>
    );
}

export default GeneralShell;
