"use client";

import { defaultUserPFP } from "@/src/config/const";
import { cn } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { useClerk } from "@clerk/nextjs";
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/icons";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    user: ClerkUser;
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
                console.error(err);

                toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            });
    };

    return (
        <div className={className}>
            <Dropdown
                placement="bottom-end"
                radius="sm"
                shouldBlockScroll={true}
            >
                <DropdownTrigger>
                    <Avatar
                        isBordered
                        showFallback
                        as="button"
                        className="transition-transform"
                        size="sm"
                        src={user.imageUrl || defaultUserPFP.src}
                    />
                </DropdownTrigger>

                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold">@{user.username}</p>
                    </DropdownItem>

                    <DropdownSection title="Communications" showDivider>
                        <DropdownItem
                            key="messages"
                            startContent={<Icons.comment className="h-4 w-4" />}
                            onPress={() => router.push("/messages")}
                        >
                            Messages
                        </DropdownItem>

                        <DropdownItem
                            key="support"
                            startContent={<Icons.gem className="h-4 w-4" />}
                            onPress={() => router.push("/support")}
                        >
                            Support
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title="Profile" showDivider>
                        <DropdownItem
                            key="settings"
                            startContent={
                                <Icons.settings className="h-4 w-4" />
                            }
                            onPress={() => router.push("/profile/settings")}
                        >
                            Settings
                        </DropdownItem>

                        <DropdownItem
                            key="preferences"
                            startContent={<Icons.wrench className="h-4 w-4" />}
                            onPress={() => router.push("/profile/preferences")}
                        >
                            Preferences
                        </DropdownItem>

                        <DropdownItem
                            key="billing"
                            startContent={<Icons.billing className="h-4 w-4" />}
                            onPress={() => router.push("/profile/billing")}
                        >
                            Billing
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection
                        title="Admin"
                        showDivider
                        className={cn(
                            user.privateMetadata.role === "user" && "visible"
                        )}
                    >
                        <DropdownItem
                            key="admin"
                            startContent={<Icons.shield className="h-4 w-4" />}
                            onPress={() => router.push("/admin")}
                        >
                            Admin
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection title="Danger zone">
                        <DropdownItem
                            key="logout"
                            color="danger"
                            startContent={<Icons.logout className="h-4 w-4" />}
                            onPress={handleLogout}
                        >
                            Log Out
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>

                {/* <DropdownMenuContent className="w-48">
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
                            onSelect={() => router.push("/profile/preferences")}
                            className="cursor-pointer"
                        >
                            <Icons.wrench className="mr-2 h-4 w-4" />
                            <span>Preferences</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => router.push("/profile/billing")}
                            className="cursor-pointer"
                        >
                            <Icons.billing className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {user.privateMetadata.role !== "user" && (
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
                </DropdownMenuContent> */}
            </Dropdown>
        </div>
    );
}

export default DropdownProfile;
