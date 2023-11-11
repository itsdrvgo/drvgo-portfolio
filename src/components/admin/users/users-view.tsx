import { BitFieldPermissions } from "@/src/config/const";
import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import { getAllUsersFromCache } from "@/src/lib/redis/methods/user";
import { hasPermission } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserTable from "./users-table";

async function UsersView({ className }: DefaultProps) {
    const [user, users, roles] = await Promise.all([
        currentUser(),
        getAllUsersFromCache(),
        getAllRolesFromCache(),
    ]);

    if (!user) redirect("/auth");
    const parsedUser = userSchema
        .omit({
            emailAddresses: true,
        })
        .parse(user);

    if (
        !hasPermission(
            parsedUser.privateMetadata.permissions,
            BitFieldPermissions.ManageUsers | BitFieldPermissions.ManagePages
        )
    )
        redirect("/admin");

    return (
        <UserTable
            className={className}
            users={users}
            user={parsedUser}
            roles={roles}
        />
    );
}

export default UsersView;
