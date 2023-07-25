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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
    const { toast } = useToast();
    const supabase = createClientComponentClient();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error)
            return toast({
                title: "Oops!",
                description: error.message,
                variant: "destructive",
            });

        toast({
            description: "Have a good day, " + user.username + "!",
        });

        router.refresh();
        router.push("/");
    };

    const defaultUserName = "User";

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-slate-700">
                        <AvatarImage
                            src={
                                user.icon ??
                                "https://cdn.discordapp.com/attachments/1091399104480944158/1124287608990736476/pexels-photo-2426085.webp"
                            }
                            alt="avatar"
                        />
                        <AvatarFallback>
                            {(user.username ?? defaultUserName)
                                .charAt(0)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
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
                        onClick={handleLogout}
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
