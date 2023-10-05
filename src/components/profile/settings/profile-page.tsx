import { userSchema } from "@/src/lib/validation/user";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfileCards from "./profile-cards";

async function ProfilePage() {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const userData = userSchema.parse(user);

    return <ProfileCards user={userData} />;
}

export default ProfilePage;
