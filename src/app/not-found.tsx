import GoBackButton from "../components/global/buttons/go-back-button";
import { EmptyPlaceholder } from "../components/ui/empty-placeholder";

function Page() {
    return (
        <div className="flex h-screen items-center justify-center bg-background p-5">
            <EmptyPlaceholder
                className="max-w-md"
                icon="construction"
                title="Page not found"
                description="Either this page is under maintenance or the page does not exist. Come back later."
                endContent={
                    <GoBackButton color="danger" className="bg-red-700" />
                }
            />
        </div>
    );
}

export default Page;
