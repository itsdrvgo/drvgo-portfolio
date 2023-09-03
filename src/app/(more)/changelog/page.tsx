import LogPage from "@/src/components/changelog/log-page";

function Page() {
    return (
        <section className="m-5 my-10 flex">
            <div className="container max-w-[75rem] space-y-8 p-0">
                <div className="space-y-2">
                    <p className="text-5xl font-bold">Change Logs</p>
                    <p className="text-gray-400">
                        All the changes made to the website will be listed here
                    </p>
                </div>
                <LogPage />
            </div>
        </section>
    );
}

export default Page;
