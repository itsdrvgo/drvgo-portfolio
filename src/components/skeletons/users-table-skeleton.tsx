import { Skeleton } from "../ui/skeleton";

function UsersTableSkeleton() {
    return (
        <>
            <div>
                <div className="flex items-center justify-between py-4">
                    <Skeleton className="h-9 w-1/3" />
                    <Skeleton className="h-9 w-1/12" />
                </div>
                <div className="overflow-hidden rounded-md">
                    <Skeleton className="h-32 w-full rounded-none" />
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        <Skeleton className="h-9 w-1/4" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-20" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default UsersTableSkeleton;
