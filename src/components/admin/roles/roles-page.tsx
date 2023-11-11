import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import RolesManagePage from "./roles-manage-page";

async function RolesPage({ className }: DefaultProps) {
    const [roles, user] = await Promise.all([
        getAllRolesFromCache(),
        currentUser(),
    ]);

    if (!user) redirect("/auth");
    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    const initialRoles = roles.sort((a, b) => a.position - b.position);

    return (
        <RolesManagePage
            initialRoles={initialRoles}
            user={parsedUser}
            className={className}
        />
    );
}

export default RolesPage;
