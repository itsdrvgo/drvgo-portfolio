import { db } from "@/src/lib/drizzle";
import { patches } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "../md/mdx-comp";
import { Separator } from "../ui/separator";

interface PageProps extends DefaultProps {
    params: {
        patchId: string;
    };
}

async function PatchViewPage({ params, className }: PageProps) {
    const patch = await db.query.patches.findFirst({
        where: eq(patches.id, params.patchId),
    });

    if (!patch) notFound();

    return (
        <article
            className={cn(
                "relative flex flex-col items-center gap-3",
                className
            )}
        >
            <div className="flex w-full flex-col gap-4">
                <div>
                    <p className="text-3xl font-bold md:text-5xl md:leading-tight">
                        Patch {patch.major}.{patch.minor}.{patch.patch}
                    </p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Published on {formatDate(patch.createdAt.getTime())}
                    </p>
                </div>

                <Separator className="w-full" />

                {patch.description?.split("\n").length! > 1 ? (
                    <div className="flex cursor-default flex-col gap-4 rounded-md border border-gray-400 bg-stone-950 p-5">
                        <p className="text-lg font-bold underline underline-offset-4 md:text-xl">
                            Table of Contents
                        </p>

                        <ol className="list-disc space-y-1 px-5 text-sm md:text-base">
                            {patch.description?.split("\n").map((x, index) => {
                                if (x.startsWith("## ")) {
                                    return (
                                        <li key={index}>
                                            <Link
                                                href={`#${x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
                                                className="text-gray-300 transition-all ease-in-out hover:text-white"
                                            >
                                                {x
                                                    .replace("## ", "")
                                                    .replace(/:$/, "")}
                                            </Link>
                                        </li>
                                    );
                                } else if (x.startsWith("### ")) {
                                    return (
                                        <li key={index} className="ml-5">
                                            <Link
                                                href={`#${x
                                                    .replace("### ", "")
                                                    .replace(/:$/, "")
                                                    .toLowerCase()
                                                    .replace(/\s/g, "-")}`}
                                                className="text-gray-400 transition-all ease-in-out hover:text-gray-300"
                                            >
                                                {x
                                                    .replace("### ", "")
                                                    .replace(/:$/, "")}
                                            </Link>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ol>
                    </div>
                ) : null}
                <Mdx className="prose prose-lg max-w-full text-sm text-white md:text-base">
                    {patch.description!}
                </Mdx>
            </div>

            <Separator className="w-full" />
        </article>
    );
}

export default PatchViewPage;
