"use client";

import { NewPatch } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../../icons/icons";
import { ButtonProps, buttonVariants } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

function PatchCreateButton({ className, variant, ...props }: ButtonProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogCreate = async () => {
        setIsLoading(true);

        const data: Omit<NewPatch, "id"> = {
            major: 0,
            minor: 0,
            patch: 0,
            description: "New patch",
        };

        axios
            .post<ResponseData>("/api/patches", JSON.stringify(data))
            .then(({ data: resData }) => {
                setIsLoading(false);
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                const patchId = JSON.parse(resData.data);
                router.push(`/admin/patches/${patchId}`);
            })
            .catch((err) => {
                console.log(err);

                setIsLoading(false);
                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <button
            onClick={handleLogCreate}
            className={cn(
                buttonVariants({ variant }),
                { "cursor-not-allowed opacity-60": isLoading },
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Icons.add className="mr-2 h-4 w-4" />
            )}
            New Patch
        </button>
    );
}

export default PatchCreateButton;
