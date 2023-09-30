"use client";

import { BitFieldPermissions, DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, hasPermission } from "@/src/lib/utils";
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
import toast from "react-hot-toast";
import { Icons } from "../../../icons/icons";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function DropdownProfile({ user, className, ...props }: PageProps) {
    const router = useRouter();
    const { signOut } = useClerk();

    const handleLogout = () => {
        signOut()
            .then(() => {
                router.push("/");
                toast.success("See you soon!");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            });
    };

    return (
        <div className={cn("", className)} {...props}>
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
                        src={user.imageUrl || DEFAULT_USER_IMAGE.src}
                    />
                </DropdownTrigger>

                <DropdownMenu
                    aria-label="Profile Actions"
                    variant="flat"
                    disabledKeys={[
                        hasPermission(
                            user.privateMetadata.permissions,
                            BitFieldPermissions.ViewPrivatePages
                        )
                            ? ""
                            : "admin",
                    ]}
                >
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold">@{user.username}</p>
                    </DropdownItem>

                    <DropdownSection title="Communications" showDivider>
                        <DropdownItem
                            key="chats"
                            startContent={<Icons.comment className="h-4 w-4" />}
                            onPress={() => router.push("/chats")}
                        >
                            Chats
                        </DropdownItem>

                        <DropdownItem
                            key="projects"
                            startContent={<Icons.folder className="h-4 w-4" />}
                            onPress={() => router.push("/projects")}
                        >
                            Projects
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
                            !hasPermission(
                                user.privateMetadata.permissions,
                                BitFieldPermissions.ViewPrivatePages
                            ) && "hidden"
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
            </Dropdown>
        </div>
    );
}

export default DropdownProfile;
