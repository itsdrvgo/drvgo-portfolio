import CachePage from "@/src/components/admin/cache/cache-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cache",
    description: "Manage the cache from here",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="space-y-2 text-center">
                    <p className="text-4xl font-bold md:text-5xl">
                        Cache Manager
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Manage the cache from here
                    </p>
                </div>

                <CachePage />
            </div>
        </section>
    );
}

export default Page;
