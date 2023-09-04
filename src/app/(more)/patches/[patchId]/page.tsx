import PatchNav from "@/src/components/patches/patch-nav";
import PatchViewPage from "@/src/components/patches/patch-view-page";
import BlogViewSkeleton from "@/src/components/skeletons/blog-view-skeleton";
import { siteConfig } from "@/src/config/site";
import { db } from "@/src/lib/drizzle";
import { patches } from "@/src/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
    params: { patchId: string };
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const patch = await db.query.patches.findFirst({
        where: eq(patches.id, params.patchId),
    });
    if (!patch)
        return {
            title: `Patch | ${params.patchId}`,
        };

    return {
        title: patch.major + "." + patch.minor + "." + patch.patch,
        description:
            "Patch " +
            patch.major +
            "." +
            patch.minor +
            "." +
            patch.patch +
            " for " +
            siteConfig.name +
            ".",
        openGraph: {
            title: patch.major + "." + patch.minor + "." + patch.patch,
            description:
                "Patch " +
                patch.major +
                "." +
                patch.minor +
                "." +
                patch.patch +
                " for " +
                siteConfig.name +
                ".",
            type: "article",
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteConfig.name + " | Patches",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: patch.major + "." + patch.minor + "." + patch.patch,
            description:
                "Patch " +
                patch.major +
                "." +
                patch.minor +
                "." +
                patch.patch +
                " for " +
                siteConfig.name +
                ".",
            images: [siteConfig.ogImage],
        },
    };
}

function Page({ params }: PageProps) {
    return (
        <section className="m-5 my-10 flex min-h-[calc(100vh-5rem)]">
            <div className="container relative flex max-w-[65rem] flex-col gap-4 p-0">
                <Suspense fallback={<BlogViewSkeleton />}>
                    <PatchNav params={params} />
                    <PatchViewPage params={params} />
                </Suspense>
            </div>
        </section>
    );
}

export default Page;
