import { db } from "@/src/lib/drizzle";
import { DefaultProps } from "@/src/types";
import UserTable from "./users-table";

async function UsersView({ className }: DefaultProps) {
    const data = await db.query.users.findMany();

    return <UserTable className={className} data={data} />;
}

export default UsersView;
