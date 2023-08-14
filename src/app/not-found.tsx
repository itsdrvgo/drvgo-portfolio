import { EmptyPlaceholder } from "../components/global/empty-placeholder";
import { GoBackButton } from "../components/global/go-back-button";

function NotFound() {
    return (
        <div className="flex h-screen items-center justify-center bg-background p-5">
            <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="construction" />
                <EmptyPlaceholder.Title>Page not found</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                    Either this page is under maintenance or the page does not
                    exist. Come back later.
                </EmptyPlaceholder.Description>
                <GoBackButton />
            </EmptyPlaceholder>
        </div>
    );
}

export default NotFound;
