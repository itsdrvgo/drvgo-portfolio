import { env } from "@/env.mjs";
import { db } from "@/src/lib/drizzle";
import {
    birthdayParticipants2023,
    insertBirthdayParticipant2023Schema,
} from "@/src/lib/drizzle/schema";
import { handleError, parseJSONToObject } from "@/src/lib/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Friend } from "../../(testings)/bday/page";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const friends = parseJSONToObject<Friend[]>(env.FRIENDS);

        const { id, isParticipating } =
            insertBirthdayParticipant2023Schema.parse(body);
        if (!friends.find((friend) => friend.id === id))
            return NextResponse.json({
                code: 403,
                message: "Forbidden",
            });

        const existingParticipant =
            await db.query.birthdayParticipants2023.findFirst({
                where: eq(birthdayParticipants2023.id, id),
            });

        if (!existingParticipant)
            await db.insert(birthdayParticipants2023).values({
                id,
                isParticipating,
            });
        else
            await db
                .update(birthdayParticipants2023)
                .set({
                    isParticipating,
                })
                .where(eq(birthdayParticipants2023.id, id));

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
