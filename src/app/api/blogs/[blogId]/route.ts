import { getBlogFromCache } from "@/src/lib/redis/methods/blog";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const blog = await getBlogFromCache(params.blogId);
        if (!blog)
            return NextResponse.json({
                code: 404,
                message: "Blog not found!",
            });

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(blog),
        });
    } catch (err) {
        return handleError(err);
    }
}
