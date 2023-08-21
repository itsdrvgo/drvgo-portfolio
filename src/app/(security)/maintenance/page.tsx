import { EmptyPlaceholder } from "@/src/components/global/empty-placeholder";

function NotFound() {
    return (
        <div className="flex h-screen items-center justify-center p-5">
            <EmptyPlaceholder>
                <EmptyPlaceholder.Icon name="construction" />
                <EmptyPlaceholder.Title>Maintenance</EmptyPlaceholder.Title>
                <EmptyPlaceholder.Description>
                    The site is currently under maintenance. Come back after few
                    hours. Thank you.
                </EmptyPlaceholder.Description>
            </EmptyPlaceholder>
        </div>
    );
}

export default NotFound;
