import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import UserTable from "./users-table";

async function UsersView({ className }: DefaultProps) {
    const data = await db.select().from(users);

    return <UserTable className={className} data={data} />;
}

export default UsersView;
