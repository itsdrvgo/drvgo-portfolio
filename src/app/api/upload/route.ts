import { handleError } from "@/src/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { utapi } from "uploadthing/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.formData();

        const user = await currentUser();
        if (!user)
            return NextResponse.json({
                code: 401,
                message: "Unauthorized!",
            });

        const file = body.get("file");
        if (!file)
            return NextResponse.json({
                code: 400,
                message: "Bad Request!",
            });

        const response = await utapi.uploadFiles(file, {
            uploaderId: user.id,
            uploadedAt: new Date().toISOString(),
        });

        if (response.error)
            return NextResponse.json({
                code: response.error.code,
                message: response.error.message,
                data: response.error.data,
            });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: response.data,
        });
    } catch (err) {
        return handleError(err);
    }
}
