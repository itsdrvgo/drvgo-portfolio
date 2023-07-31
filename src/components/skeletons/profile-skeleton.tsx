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
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                        Change your profile picture
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-14">
                    <Skeleton className="h-40 w-40 rounded-full" />
                    <Skeleton className="h-10 w-36" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>

            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Username</CardTitle>
                    <CardDescription>Change your username</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-11 w-2/5" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>

            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        Delete your account permanantly
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                    <Skeleton className="h-10 w-36" />
                </CardFooter>
            </Card>
        </>
    );
}

export default ProfileSkeleton;
