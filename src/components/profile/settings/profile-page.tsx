import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { getAuthSession } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { UsernameForm } from "../../forms/username-form";
import DeleteAccount from "./delete-account";
import UploadPFP from "./upload-pfp";

async function ProfilePage({ className }: DefaultProps) {
    const session = await getAuthSession();
    if (!session) return redirect("/");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user) return redirect("/signin");

    return (
        <>
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                        Profile Picture
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Change your profile picture
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadPFP user={user} />
                </CardContent>
            </Card>

            <Card className="bg-background">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                        Username
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Update your username or display name
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UsernameForm user={user} />
                </CardContent>
            </Card>

            <Card className="bg-background">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Delete your account permanantly
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DeleteAccount user={user} />
                </CardContent>
            </Card>
        </>
    );
}

export default ProfilePage;
