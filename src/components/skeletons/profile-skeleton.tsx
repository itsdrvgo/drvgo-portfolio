import { DefaultProps } from "@/src/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function ProfileSkeleton({ className }: DefaultProps) {
    return (
        <>
            <Card className="bg-transparent">
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                        Change your profile picture
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-14">
                    <div className="flex w-full flex-col items-center justify-center gap-7 rounded-md border border-dashed border-gray-500 p-12">
                        <Skeleton className="h-40 w-40 rounded-full" />
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Skeleton className="h-9 w-44" />
                            <p className="text-xs text-gray-600">(2 MB)</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center md:justify-start">
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>

            <Card className="bg-transparent">
                <CardHeader>
                    <CardTitle>Username</CardTitle>
                    <CardDescription>
                        Update your username. This is the name that will be used
                        to identify you on the site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-11 w-full md:w-2/5" />
                </CardContent>
                <CardFooter className="flex justify-center md:justify-start">
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>

            <Card className="bg-transparent">
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        Delete your account permanantly
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center md:justify-end">
                    <Skeleton className="h-10 w-36" />
                </CardFooter>
            </Card>
        </>
    );
}

export default ProfileSkeleton;
