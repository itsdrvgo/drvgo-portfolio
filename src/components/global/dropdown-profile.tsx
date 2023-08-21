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
import { defaultUserPFP } from "@/src/config/const";
import { User } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    user: User;
}

function DropdownProfile({ user, className }: PageProps) {
    const router = useRouter();
    const { toast } = useToast();

    const { signOut } = useClerk();

    const handleLogout = async () => {
        signOut()
            .then(() => {
                router.push("/");
                toast({
                    description: "See you soon!",
                });
            })
            .catch((err) => {
                console.log(err);

                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-slate-700">
                        <AvatarImage
                            src={user.image ?? defaultUserPFP.src}
                            alt="avatar"
                        />
                        <AvatarFallback>
                            {user.username[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuLabel className="truncate">
                        @{user.username}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => router.push("/messages")}
                            className="cursor-pointer"
                        >
                            <Icons.comment className="mr-2 h-4 w-4" />
                            <span>Messages</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => router.push("/support")}
                            className="cursor-pointer"
                        >
                            <Icons.gem className="mr-2 h-4 w-4" />
                            <span>Support</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onSelect={() => router.push("/profile/settings")}
                            className="cursor-pointer"
                        >
                            <Icons.settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => router.push("/notifications")}
                            className="cursor-pointer"
                        >
                            <Icons.notification className="mr-2 h-4 w-4" />
                            <span>Notifications</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => router.push("/profile/billing")}
                            className="cursor-pointer"
                        >
                            <Icons.billing className="mr-2 h-4 w-4" />
                            <span>Billing</span>
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
