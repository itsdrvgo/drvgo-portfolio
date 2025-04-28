import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    EmptyPlaceholder,
    EmptyPlaceholderContent,
    EmptyPlaceholderDescription,
    EmptyPlaceholderFooter,
    EmptyPlaceholderHeader,
    EmptyPlaceholderIcon,
    EmptyPlaceholderTitle,
} from "@/components/ui/empty-placeholder";
import Link from "next/link";

export function NotFoundPage() {
    return (
        <div className="flex justify-center">
            <EmptyPlaceholder>
                <EmptyPlaceholderIcon>
                    <Icons.AlertTriangle />
                </EmptyPlaceholderIcon>

                <EmptyPlaceholderContent>
                    <EmptyPlaceholderHeader>
                        <EmptyPlaceholderTitle>
                            Page Not Found
                        </EmptyPlaceholderTitle>
                        <EmptyPlaceholderDescription>
                            The page you are looking for does not exist or has
                            been moved. Please check the URL or go back to the
                            dashboard.
                        </EmptyPlaceholderDescription>
                    </EmptyPlaceholderHeader>

                    <EmptyPlaceholderFooter>
                        <Button size="sm" asChild>
                            <Link href="/dashboard">Go Back</Link>
                        </Button>
                    </EmptyPlaceholderFooter>
                </EmptyPlaceholderContent>
            </EmptyPlaceholder>
        </div>
    );
}
