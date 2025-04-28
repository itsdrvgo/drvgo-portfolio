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

export function MaintenancePage() {
    return (
        <div className="flex justify-center">
            <EmptyPlaceholder>
                <EmptyPlaceholderIcon>
                    <Icons.Construction />
                </EmptyPlaceholderIcon>

                <EmptyPlaceholderContent>
                    <EmptyPlaceholderHeader>
                        <EmptyPlaceholderTitle>
                            Under Construction
                        </EmptyPlaceholderTitle>
                        <EmptyPlaceholderDescription>
                            Either this page is under maintenance or we are
                            still working on it. Please check back later.
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
