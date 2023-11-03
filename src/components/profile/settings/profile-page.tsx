import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfileCards from "./profile-cards";

async function ProfilePage({ className, ...props }: DefaultProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const userData = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    return <ProfileCards user={userData} className={className} {...props} />;
}

export default ProfilePage;
