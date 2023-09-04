import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { UsernameForm } from "../../forms/username-form";
import DeleteAccount from "./delete-account";
import UploadPFP from "./upload-pfp";

async function ProfilePage({ className }: DefaultProps) {
    const user = await currentUser();
    if (!user) return redirect("/signin");

    const userData = userSchema.parse(user);

    return (
        <>
            <Card className="bg-transparent">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                        Profile Picture
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Change your profile picture
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadPFP user={userData} />
                </CardContent>
            </Card>

            <Card className="bg-transparent">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                        Username
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Update your username. This is the name that will be used
                        to identify you on the site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UsernameForm user={userData} />
                </CardContent>
            </Card>

            <Card className="bg-transparent">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Delete your account permanantly
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DeleteAccount user={userData} />
                </CardContent>
            </Card>
        </>
    );
}

export default ProfilePage;
