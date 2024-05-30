import { notFound } from "next/navigation";

function Page() {
    return notFound();
    // return (
    //     <GeneralShell>
    //         <div className="space-y-3 text-center">
    //             <h2 className="text-3xl font-bold md:text-5xl">Blogs</h2>
    //             <p className="text-white/60">
    //                 I write about my experiences with music, and programming.
    //             </p>
    //         </div>

    //         <div className="grid gap-2 py-2 md:grid-cols-3 md:gap-4">
    //             {blogs
    //                 .sort(
    //                     (a, b) =>
    //                         new Date(b.meta.date).getTime() -
    //                         new Date(a.meta.date).getTime()
    //                 )
    //                 .map(
    //                     (blog) =>
    //                         blog && <BlogCard key={blog.slug} blog={blog} />
    //                 )}
    //         </div>
    //     </GeneralShell>
    // );
}

export default Page;
