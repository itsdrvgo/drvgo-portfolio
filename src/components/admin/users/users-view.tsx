import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UserTable, { PartialUser } from "./users-table";

async function UsersView({ className }: DefaultProps) {
    const [user, allUsers] = await Promise.all([
        currentUser(),
        db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                role: users.role,
                created: users.createdAt,
                image: users.image,
            })
            .from(users),
    ]);

    if (!user) return redirect("/auth");
    const parsedUser = userSchema.parse(user);

    const data = allUsers as unknown as PartialUser[];

    return (
        <UserTable className={className} data={data} authUser={parsedUser} />
    );
}

export default UsersView;
