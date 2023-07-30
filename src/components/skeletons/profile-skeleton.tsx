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
    );
}

export default ProfileSkeleton;
