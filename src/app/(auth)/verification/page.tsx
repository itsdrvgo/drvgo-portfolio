import Verification from "@/src/components/auth/verification";

function Page() {
    return (
        <section className="flex min-h-screen items-center justify-center p-5">
            <div className="flex h-full w-full max-w-[35rem] cursor-default flex-col items-center justify-center gap-4 bg-background">
                <Verification />
            </div>
        </section>
    );
}

export default Page;
