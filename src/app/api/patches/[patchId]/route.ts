import { db } from "@/src/lib/drizzle";
import { NewPatch, patches, User } from "@/src/lib/drizzle/schema";
import { handleError } from "@/src/lib/utils";
import {
    patchPatchSchema,
    patchPublishSchema,
} from "@/src/lib/validation/patches";
import { PatchContext, patchContextSchema } from "@/src/lib/validation/route";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: PatchContext) {
    try {
        const { params } = patchContextSchema.parse(context);

        const patch = await db.query.patches.findFirst({
            where: eq(patches.id, params.patchId),
        });

        if (!patch)
            return NextResponse.json({
                code: 404,
                message: "Patch not found",
            });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(patch),
        });
    } catch (err) {
        handleError(err);
    }
}

export async function DELETE(req: NextRequest, context: PatchContext) {
    try {
        const { params } = patchContextSchema.parse(context);

        if (!(await verifyCurrentUserHasAccessToPatch()))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        await db.delete(patches).where(eq(patches.id, params.patchId));

        return NextResponse.json({
            code: 204,
            message: "Ok",
        });
    } catch (err) {
        handleError(err);
    }
}

export async function PATCH(req: NextRequest, context: PatchContext) {
    try {
        const body = await req.json();

        const { params } = patchContextSchema.parse(context);

        if (!(await verifyCurrentUserHasAccessToPatch()))
            return NextResponse.json({
                code: 403,
                message: "Unauthorized",
            });

        const { action, published, description, major, minor, patch } =
            patchPatchSchema.parse(body);

        switch (action) {
            case "edit": {
                try {
                    const data = await db.query.patches.findFirst({
                        where: eq(patches.id, params.patchId),
                    });

                    if (!data)
                        return NextResponse.json({
                            code: 404,
                            message: "Patch not found",
                        });

                    const updatedValues: Omit<NewPatch, "id"> = {
                        major: major ?? data.major,
                        minor: minor ?? data.minor,
                        patch: patch ?? data.patch,
                        description: description ?? data.description,
                        published: published ?? data.published,
                    };

                    await db
                        .update(patches)
                        .set({
                            ...updatedValues,
                        })
                        .where(eq(patches.id, params.patchId));

                    return NextResponse.json({
                        code: 200,
                        message: "Ok",
                    });
                } catch (err) {
                    return handleError(err);
                }
            }

            case "publish": {
                try {
                    const { description, major, minor, patch, published } =
                        patchPublishSchema.parse(body);

                    await db
                        .update(patches)
                        .set({
                            description,
                            major,
                            minor,
                            patch,
                            published,
                            createdAt: new Date(),
                        })
                        .where(eq(patches.id, params.patchId));

                    return NextResponse.json({
                        code: 200,
                        message: "Ok",
                    });
                } catch (err) {
                    return handleError(err);
                }
            }
        }
    } catch (err) {
        handleError(err);
    }
}

async function verifyCurrentUserHasAccessToPatch() {
    const authUser = await currentUser();
    if (
        !authUser ||
        !["owner", "admin"].includes(authUser.privateMetadata.role)
    )
        return false;
    else return true;
}
