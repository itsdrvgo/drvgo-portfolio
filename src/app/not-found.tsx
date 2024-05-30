import { GoBackButton } from "@/components/global/buttons";
import { buttonVariants } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";

function Page() {
    return (
        <div
            className="flex h-screen items-center justify-center bg-background p-5"
            style={{
                backgroundImage: "url(/noise-light.png)",
            }}
        >
            <EmptyPlaceholder
                className="max-w-md"
                icon="construction"
                title="Page not found"
                description="Either this page is under maintenance or the page does not exist. Come back later."
                endContent={
                    <GoBackButton className={buttonVariants({ size: "sm" })} />
                }
            />
        </div>
    );
}

export default Page;
