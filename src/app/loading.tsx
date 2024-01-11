import Loader from "@/src/components/ui/loader";

function Loading() {
    return (
        <section className="flex h-screen w-full items-center justify-center p-5">
            <Loader />
        </section>
    );
}

export default Loading;
