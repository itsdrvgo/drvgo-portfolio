import { BitFieldPermissions } from "@/src/config/const";
import { getAllRolesFromCache } from "@/src/lib/redis/methods/roles";
import { checkRoleHierarchy, hasPermission } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import RoleForm from "./role-form";

interface PageProps extends DefaultProps {
    params: {
        roleId: string;
    };
}

async function RolePage({ className, params, ...props }: PageProps) {
    const [user, roles] = await Promise.all([
        currentUser(),
        getAllRolesFromCache(),
    ]);

    if (!roles.length) notFound();
    if (!user) redirect("/auth");

    const role = roles.find((role) => role.id === params.roleId);
    if (!role) notFound();

    const hasUserPermission = hasPermission(
        user.privateMetadata.permissions,
        BitFieldPermissions.ManagePages | BitFieldPermissions.ManageRoles
    );

    const isUserRoleHigherThanTargettedRole = checkRoleHierarchy(
        user.privateMetadata.roles,
        [role.key],
        roles
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
