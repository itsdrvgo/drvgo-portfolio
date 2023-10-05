import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import AnnouncementForm from "./announcement-form";

async function AnnouncementPage({ ...props }: DefaultProps) {
    const user = await currentUser();
    if (!user) redirect("/auth");

    const parsedUser = userSchema.parse(user);

    return <AnnouncementForm user={parsedUser} {...props} />;
}

export default AnnouncementPage;
