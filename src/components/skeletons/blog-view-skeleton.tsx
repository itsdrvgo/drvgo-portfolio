import { Skeleton } from "../ui/skeleton";

function BlogViewSkeleton() {
    return (
        <div className="flex w-full flex-col gap-4">
            <Skeleton className="h-14 w-full" />
            <div className="flex items-center gap-3 text-xs md:text-sm">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="h-7 w-44" />
                </div>
            </div>
            <Skeleton className="aspect-video" />
            <Skeleton className="h-56 w-full" />
        </div>
    );
}

export default BlogViewSkeleton;
