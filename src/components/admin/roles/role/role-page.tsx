import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { roles } from "@/src/lib/drizzle/schema";
import { checkRoleHierarchy, hasPermission } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import RoleForm from "./role-form";

interface PageProps extends DefaultProps {
    params: {
        roleId: string;
    };
}

async function RolePage({ className, params, ...props }: PageProps) {
    const [user, role, allRoles] = await Promise.all([
        currentUser(),
        db.query.roles.findFirst({
            where: eq(roles.id, params.roleId),
        }),
        db.query.roles.findMany(),
    ]);
    if (!role) notFound();
    if (!user) redirect("/auth");

    const hasUserPermission = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.ManagePages | BitFieldPermissions.ManageRoles
    );

    const isUserRoleHigherThanTargettedRole = checkRoleHierarchy(
        user.privateMetadata.roles,
        [role.key],
        allRoles
    );

    const isOwner = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.Administrator
    );

    const hasAccessToEdit =
        hasUserPermission && isUserRoleHigherThanTargettedRole;

    return (
        <RoleForm
            roleData={role}
            className={className}
            hasAccessToEdit={hasAccessToEdit}
            isOwner={isOwner}
            {...props}
        />
    );
}

export default RolePage;
