"use client";

import { Patch } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { PatchPatchData } from "@/src/lib/validation/patches";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../../icons/icons";
import { Mdx } from "../../md/mdx-comp";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { useToast } from "../../ui/use-toast";

interface PageProps extends DefaultProps {
    params: {
        patchId: string;
    };
    data: Patch;
}

function PatchWriteUp({ data }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [previewEnabled, setPreviewEnable] = useState(false);
    const [patchMajor, setPatchMajor] = useState(data.major);
    const [patchMinor, setPatchMinor] = useState(data.minor);
    const [patchPatch, setPatchPatch] = useState(data.patch);
    const [patchDescription, setPatchDescription] = useState(
        data.description ?? ""
    );

    const [showVersion, setShowVersion] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const handleSave = () => {
        setIsSaving(true);

        const body: PatchPatchData = {
            major: patchMajor,
            minor: patchMinor,
            patch: patchPatch,
            published: data.published,
            description: patchDescription,
            action: "edit",
        };

        axios
            .patch<ResponseData>(
                `/api/patches/${data.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                setIsSaving(false);

                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                toast({
                    description: "Patch has been saved",
                });

                router.push("/admin/patches");
            })
            .catch((err) => {
                setIsSaving(false);
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <div className="relative flex w-full flex-col items-center gap-10">
            {previewEnabled ? (
                <div className="flex w-full flex-col gap-4">
                    <div className="space-y-2 md:space-y-3">
                        <p className="text-2xl font-bold md:text-5xl">
                            Patch Notes
                        </p>
                        <div className="flex items-end justify-between">
                            <p className="text-base font-semibold text-gray-400 md:text-xl">
                                Version {patchMajor}.{patchMinor}.{patchPatch}
                            </p>
                            <p className="text-xs font-semibold text-gray-500 md:text-sm">
                                Published on{" "}
                                {formatDate(data.createdAt.getTime())}
                            </p>
                        </div>
                    </div>

                    <Separator className="w-full" />

                    {patchDescription.split("\n").length! > 1 ? (
                        <div className="flex cursor-default flex-col gap-4 rounded-md border border-gray-400 bg-stone-950 p-5">
                            <p className="text-lg font-bold underline underline-offset-4 md:text-xl">
                                Table of Contents
                            </p>

                            <ol className="list-disc space-y-1 px-5 text-sm md:text-base">
                                {patchDescription
                                    .split("\n")
                                    .map((x, index) => {
                                        if (x.startsWith("## ")) {
                                            return (
                                                <li key={index}>
                                                    <Link
                                                        href={`#${x
                                                            .replace("## ", "")
                                                            .replace(/:$/, "")
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s/g,
                                                                "-"
                                                            )}`}
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
                                                <li
                                                    key={index}
                                                    className="ml-5"
                                                >
                                                    <Link
                                                        href={`#${x
                                                            .replace("### ", "")
                                                            .replace(/:$/, "")
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s/g,
                                                                "-"
                                                            )}`}
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
                        {patchDescription}
                    </Mdx>
                    <Separator className="w-full" />
                </div>
            ) : (
                <div className="mx-auto flex w-full flex-col gap-4">
                    <div
                        className={cn(
                            "flex flex-col rounded-md border border-border bg-secondary p-5 transition-all ease-in-out",
                            { "gap-4": showVersion },
                            { "gap-0": !showVersion }
                        )}
                    >
                        <button
                            className="flex w-full items-center justify-between"
                            onClick={() => setShowVersion(!showVersion)}
                        >
                            <p className="text-lg font-bold md:text-2xl">
                                Version &amp; Release
                            </p>
                            <Icons.chevronDown
                                className={cn(
                                    "h-5 w-5 transition-all ease-in-out md:h-6 md:w-6",
                                    showVersion ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "w-full space-y-4 transition-all ease-in-out",
                                { "max-h-full opacity-100": showVersion },
                                {
                                    "max-h-0 overflow-hidden opacity-0":
                                        !showVersion,
                                }
                            )}
                        >
                            <Separator />
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <div className="relative w-full">
                                    <Input
                                        defaultValue={patchMajor}
                                        value={patchMajor}
                                        placeholder="Enter patch major"
                                        className="h-auto pl-[74px] text-base font-bold md:pl-20 md:text-xl"
                                        min={0}
                                        onChange={(e) => {
                                            if (
                                                e.target.value.match(
                                                    /^[0-9\b]+$/
                                                )
                                            )
                                                setPatchMajor(
                                                    Number(e.target.value)
                                                );
                                            else if (e.target.value === "")
                                                setPatchMajor(0);
                                        }}
                                    />
                                    <p className="absolute left-0 top-1/2 -translate-y-1/2 cursor-default border-r border-gray-700 p-2 px-3 text-xs uppercase text-gray-400 md:text-sm">
                                        Major
                                    </p>
                                </div>

                                <div className="relative w-full">
                                    <Input
                                        defaultValue={patchMinor}
                                        value={patchMinor}
                                        placeholder="Enter patch major"
                                        className="h-auto pl-[74px] text-base font-bold md:pl-20 md:text-xl"
                                        min={0}
                                        onChange={(e) => {
                                            if (
                                                e.target.value.match(
                                                    /^[0-9\b]+$/
                                                )
                                            )
                                                setPatchMinor(
                                                    Number(e.target.value)
                                                );
                                            else if (e.target.value === "")
                                                setPatchMinor(0);
                                        }}
                                    />
                                    <p className="absolute left-0 top-1/2 -translate-y-1/2 cursor-default border-r border-gray-700 p-2 px-3 text-xs uppercase text-gray-400 md:text-sm">
                                        Minor
                                    </p>
                                </div>

                                <div className="relative w-full">
                                    <Input
                                        defaultValue={patchPatch}
                                        value={patchPatch}
                                        placeholder="Enter patch major"
                                        className="h-auto pl-[74px] text-base font-bold md:pl-20 md:text-xl"
                                        min={0}
                                        onChange={(e) => {
                                            if (
                                                e.target.value.match(
                                                    /^[0-9\b]+$/
                                                )
                                            )
                                                setPatchPatch(
                                                    Number(e.target.value)
                                                );
                                            else if (e.target.value === "")
                                                setPatchPatch(0);
                                        }}
                                    />
                                    <p className="absolute left-0 top-1/2 -translate-y-1/2 cursor-default border-r border-gray-700 p-2 px-3 text-xs uppercase text-gray-400 md:text-sm">
                                        Patch
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col rounded-md border border-border bg-secondary p-5 transition-all ease-in-out",
                            { "gap-4": showDescription },
                            { "gap-0": !showDescription }
                        )}
                    >
                        <button
                            className="flex w-full items-center justify-between"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            <p className="text-lg font-bold md:text-2xl">
                                Content
                            </p>
                            <Icons.chevronDown
                                className={cn(
                                    "h-5 w-5 transition-all ease-in-out md:h-6 md:w-6",
                                    showDescription ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "w-full space-y-4 transition-all ease-in-out",
                                { "max-h-full opacity-100": showDescription },
                                {
                                    "max-h-0 overflow-hidden opacity-0":
                                        !showDescription,
                                }
                            )}
                        >
                            <Separator />
                            <TextareaAutosize
                                autoFocus
                                defaultValue={patchDescription}
                                placeholder="Enter the patch content"
                                className="min-h-[300px] w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-base"
                                onChange={(e) =>
                                    setPatchDescription(e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="sticky bottom-10 flex w-auto items-center justify-center gap-3 rounded-full border border-gray-600 bg-card p-5 py-3">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.document className="h-4 w-4" />
                    )}
                    <span>
                        {data.published ? "Save & Publish" : "Save as Draft"}
                    </span>
                </button>

                <Separator orientation="vertical" className="h-5 bg-gray-600" />

                <button
                    type="button"
                    onClick={() => setPreviewEnable(!previewEnabled)}
                    className="flex items-center gap-2 text-sm"
                >
                    {isSaving ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : previewEnabled ? (
                        <Icons.view className="h-4 w-4" />
                    ) : (
                        <Icons.hide className="h-4 w-4" />
                    )}
                    <span>
                        {previewEnabled ? "Hide Preview" : "Show Preview"}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default PatchWriteUp;
