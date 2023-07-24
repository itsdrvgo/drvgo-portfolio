"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { User } from "@/src/lib/drizzle/schema";
import { usePathname, useRouter } from "next/navigation";
import { HTMLAttributes } from "react";
import { Icons } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../ui/use-toast";

interface CompProps extends HTMLAttributes<HTMLElement> {
    user: User;
}

function DropdownProfile({ user, className }: CompProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

    if ((!user.username || !user.username.length) && pathname !== "/profile") {
        toast({
            description: "You must have a username in order to continue",
            variant: "destructive",
        });
        router.push("/profile");
    }

    const defaultUserName = "User";

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-4">
                        <Avatar className="border-2 border-slate-700">
                            <AvatarImage
                                src={user.profile_image_url!}
                                alt="avatar"
                            />
                            <AvatarFallback>
                                {(user.username ?? defaultUserName)
                                    .charAt(0)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <p>Hi, {user.username ?? defaultUserName}</p>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => router.push("/profile")}
                            className="cursor-pointer"
                        >
                            <Icons.user className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => router.push("/support")}
                            className="cursor-pointer"
                        >
                            <Icons.gem className="mr-2 h-4 w-4" />
                            <span>Support</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {user.role !== "user" && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onSelect={() => router.push("/admin")}
                                    className="cursor-pointer"
                                >
                                    <Icons.shield className="mr-2 h-4 w-4" />
                                    <span>Admin</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => router.push("/signout")}
                        className="cursor-pointer"
                    >
                        <Icons.logout className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default DropdownProfile;
