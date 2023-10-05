import { db } from "@/src/lib/drizzle";
import { roles } from "@/src/lib/drizzle/schema";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import RolesManagePage from "./roles-manage-page";

async function RolesPage({ className }: DefaultProps) {
    const [initialRoles, user] = await Promise.all([
        db.query.roles.findMany({
            orderBy: [asc(roles.position)],
        }),
        currentUser(),
    ]);

    if (!user) redirect("/auth");
    let parsedUser = userSchema.parse(user);

    return (
        <RolesManagePage
            initialRoles={initialRoles}
            user={parsedUser}
            className={className}
        />
    );
}

export default RolesPage;
