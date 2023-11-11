import { getAllBlogsFromCache } from "@/src/lib/redis/methods/blog";
import { handleError } from "@/src/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allBlogs = await getAllBlogsFromCache();
        const filteredBlogs = allBlogs
            .filter((blog) => blog.published)
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

        return NextResponse.json({
            code: 200,
            message: "Ok",
            data: JSON.stringify(filteredBlogs),
        });
    } catch (err) {
        return handleError(err);
    }
}
