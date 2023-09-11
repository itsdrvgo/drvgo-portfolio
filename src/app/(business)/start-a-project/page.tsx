import ProjectStart from "@/src/components/start-a-project/project-start";

function Page() {
    return (
        <section className="m-5 my-10 flex">
            <div className="container max-w-[75rem] space-y-8 p-0">
                <div className="space-y-2 text-center">
                    <p className="text-3xl font-bold md:text-5xl">
                        Start a Project
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Interested in working together? We can have a chat, and
                        see if we&apos;re a good fit for each other.
                    </p>
                </div>
                <ProjectStart />
            </div>
        </section>
    );
}

export default Page;
