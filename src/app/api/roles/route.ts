import { BitFieldPermissions } from "@/src/config/const";
import { db } from "@/src/lib/drizzle";
import { roles } from "@/src/lib/drizzle/schema";
import { getAuthorizedUser, handleError } from "@/src/lib/utils";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rolesPatchSchema = z.array(
    z.object({
        id: z.string(),
        position: z.number(),
    })
);

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const roleId = nanoid();

        const currentRoles = await db.query.roles.findMany();
        const maxPosition = Math.max(...currentRoles.map((r) => r.position));

        await db.insert(roles).values({
            id: roleId,
            name: "new_role_" + roleId,
            key: "new_role_" + roleId,
            permissions: 1,
            position: maxPosition + 1,
        });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(roleId),
        });
    } catch (err) {
        return handleError(err);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        const user = await getAuthorizedUser(
            BitFieldPermissions.ManageRoles | BitFieldPermissions.ManagePages
        );
        if (!user)
            return NextResponse.json({
                code: 403,
                message: "Unauthorized!",
            });

        const updatedRoles = rolesPatchSchema.parse(body);
        const exisingRoles = await db.query.roles.findMany();

        const deletedRoles = exisingRoles.filter(
            (role) => !updatedRoles.find((r) => r.id === role.id)
        );

        if (deletedRoles.length > 0) {
            for (const role of deletedRoles) {
                await db.delete(roles).where(eq(roles.id, role.id));
            }

            for (const role of updatedRoles) {
                await db
                    .update(roles)
                    .set({
                        position: role.position,
                    })
                    .where(eq(roles.id, role.id));
            }
        } else {
            for (const role of updatedRoles) {
                await db
                    .update(roles)
                    .set({
                        position: role.position,
                    })
                    .where(eq(roles.id, role.id));
            }
        }

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
