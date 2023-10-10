import { db } from "@/src/lib/drizzle";
import { views } from "@/src/lib/drizzle/schema";
import {
    getBlogFromCache,
    updateBlogInCache,
} from "@/src/lib/redis/methods/blog";
import { handleError } from "@/src/lib/utils";
import { BlogContext, blogContextSchema } from "@/src/lib/validation/route";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: BlogContext) {
    try {
        const { params } = blogContextSchema.parse(context);

        const blog = await getBlogFromCache(params.blogId);

        if (!blog)
            return NextResponse.json({
                code: 404,
                message: "Blog not found!",
            });

        await Promise.all([
            db.insert(views).values({
                id: nanoid(),
                blogId: params.blogId,
            }),
            updateBlogInCache({
                ...blog,
                views: blog.views + 1,
            }),
        ]);

        return NextResponse.json({
            code: 200,
            message: "Ok",
        });
    } catch (err) {
        return handleError(err);
    }
}
