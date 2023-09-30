import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { accounts, insertRoleSchema, roles } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError, wait } from "@/src/lib/utils";
import { RoleContext, roleContextSchema } from "@/src/lib/validation/route";
import { clerkClient } from "@clerk/nextjs";
import { eq, like } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: RoleContext) {
    try {
        const body = await req.json();
        const { params } = roleContextSchema.parse(context);

        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        const { name, permissions } = insertRoleSchema
            .pick({
                name: true,
                permissions: true,
            })
            .partial()
            .parse(body);

        const [role, allRoles] = await Promise.all([
            db.query.roles.findFirst({
                where: eq(roles.id, params.roleId),
            }),
            db.query.roles.findMany(),
        ]);
        if (!role)
            return NextResponse.json({
                code: 404,
                message: "Role not found!",
            });

        const roleAccounts = await db.query.accounts.findMany({
            where: like(accounts.roles, `%${role.key}%`),
        });

        if (roleAccounts.length > 0) {
            if (permissions && permissions !== role.permissions) {
                roleAccounts.map(async (account) => {
                    const accountRoles = account.roles.map((x) => {
                        const r = allRoles.find((y) => y.key === x);
                        if (!r) return null;
                        return r;
                    });

                    const accountHighestRole = accountRoles.reduce(
                        (prev, curr) => {
                            if (!prev) return curr;
                            if (!curr) return prev;
                            return prev.position > curr.position ? curr : prev;
                        },
                        null
                    );
                    if (!accountHighestRole) return;

                    if (role.position <= accountHighestRole.position)
                        await clerkClient.users.updateUserMetadata(account.id, {
                            privateMetadata: {
                                permissions,
                                roles: account.roles,
                                strikes: account.strikes,
                            },
                        });
                });
            }

            if (name && name !== role.name) {
                roleAccounts.forEach(async (account) => {
                    const accountRoles = account.roles;

                    const newRoles = accountRoles.map((x) =>
                        x === role.key
                            ? name.toLowerCase().replace(/\s/g, "_")
                            : x
                    );

                    await clerkClient.users.updateUserMetadata(account.id, {
                        privateMetadata: {
                            roles: newRoles,
                            permissions: account.permissions,
                            strikes: account.strikes,
                        },
                    });

                    await wait(750);
                });
            }
        }

        await db
            .update(roles)
            .set({
                name: name ?? role.name,
                key: name?.toLowerCase().replace(/\s/g, "_") ?? role.key,
                permissions: permissions ?? role.permissions,
            })
            .where(eq(roles.id, params.roleId));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
