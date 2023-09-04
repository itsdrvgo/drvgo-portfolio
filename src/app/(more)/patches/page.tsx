import PatchPage from "@/src/components/patches/patch-page";

function Page() {
    return (
        <section className="m-5 my-10 flex">
            <div className="container max-w-[75rem] space-y-8 p-0">
                <div className="space-y-2 text-center">
                    <p className="text-3xl font-bold md:text-5xl">
                        Patch Notes
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        All the changes made to the website will be listed here
                    </p>
                </div>
                <PatchPage />
            </div>
        </section>
    );
}

export default Page;
