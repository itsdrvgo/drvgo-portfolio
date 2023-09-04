import { DefaultProps } from "@/src/types";
import { clerkClient } from "@clerk/nextjs";
import UserTable from "./users-table";

async function UsersView({ className }: DefaultProps) {
    const users = await clerkClient.users.getUserList();

    return <UserTable className={className} data={users} />;
}

export default UsersView;
