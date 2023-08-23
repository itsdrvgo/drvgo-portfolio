import SSOCallback from "@/src/components/auth/sso-callback";

function Page() {
    return (
        <section className="flex min-h-screen items-center justify-center p-5">
            <div
                className="flex h-full w-full cursor-default flex-col items-center justify-center gap-4"
                role="status"
                aria-label="Loading"
                aria-describedby="loading-description"
            >
                <SSOCallback />
            </div>
        </section>
    );
}

export default Page;
