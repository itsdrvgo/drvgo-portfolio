import { Skeleton } from "../ui/skeleton";

function BlogEditSkeleton() {
    return (
        <>
            <div className="flex flex-col items-center gap-2 overflow-hidden rounded-md border border-gray-500">
                <Skeleton className="aspect-video h-full w-full" />
                <div className="flex w-full items-center justify-between p-5">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-40 bg-gray-700" />
                        <Skeleton className="h-6 w-28 bg-gray-700" />
                    </div>
                    <div>
                        <Skeleton className="h-7 w-7 bg-gray-700" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogEditSkeleton;
