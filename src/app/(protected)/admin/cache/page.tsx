import CachePage from "@/src/components/admin/cache/cache-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cache",
    description: "Manage the cache from here",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold">Cache Manager</p>
                    <p className="text-gray-400">Manage the cache from here</p>
                </div>

                <CachePage />
            </div>
        </section>
    );
}

export default Page;
