import { BitFieldPermissions } from "@/src/config/const";
import { getAllBlogsFromCache } from "@/src/lib/redis/methods/blog";
import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import { getAllUsersFromCache } from "@/src/lib/redis/methods/user";
import { hasPermission } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CacheOperations from "./cache-operations";

async function CachePage({ className }: DefaultProps) {
    const [users, blogs, roles, user] = await Promise.all([
        getAllUsersFromCache(),
        getAllBlogsFromCache(),
        getAllRolesFromCache(),
        currentUser(),
    ]);
    if (!user) redirect("/auth");

    if (
        !hasPermission(
            user.privateMetadata.permissions,
            BitFieldPermissions.Administrator
        )
    )
        redirect("/admin");

    return (
        <CacheOperations
            className={className}
            users={users}
            blogs={blogs}
            roles={roles}
        />
    );
}

export default CachePage;
