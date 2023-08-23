import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

function BlogsSkeleton() {
    return (
        <>
            <Skeleton className="h-16 w-full" />
            <Separator />
            <div className="grid grid-cols-1 justify-items-stretch gap-5 md:grid-cols-3">
                {Array.from({ length: 4 }, (_, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-2 overflow-hidden rounded-md border border-gray-500"
                    >
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
                ))}
            </div>
        </>
    );
}

export default BlogsSkeleton;
