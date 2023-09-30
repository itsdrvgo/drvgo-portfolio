import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { hasPermission } from "@/src/lib/utils";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserTable from "./users-table";

async function UsersView({ className }: DefaultProps) {
    const [user, allUsers, roles] = await Promise.all([
        currentUser(),
        db.query.users.findMany({
            with: {
                account: true,
            },
        }),
        db.query.roles.findMany(),
    ]);

    if (!user) redirect("/auth");
    const parsedUser = userSchema.parse(user);
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
            data={allUsers}
            user={parsedUser}
            roles={roles}
        />
    );
}

export default UsersView;
