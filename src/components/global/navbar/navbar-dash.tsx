import { db } from "@/src/lib/drizzle";
import { notifications } from "@/src/lib/drizzle/schema";
import { userSchema } from "@/src/lib/validation/user";
import { ExtendedNotification } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { NavbarProps } from "@nextui-org/react";
import { and, desc, eq } from "drizzle-orm";
import NavDashItems from "./navbar-dash-items";
import NavbarHome from "./navbar-home";

async function NavbarDash({ ...props }: NavbarProps) {
    const user = await currentUser();
    if (!user) return <NavbarHome />;

    const data = await db.query.notifications.findMany({
        where: and(
            eq(notifications.userId, user.id),
            eq(notifications.read, false)
        ),
        orderBy: [desc(notifications.createdAt)],
        with: {
            notifier: true,
        },
    });

    const userData = userSchema.parse(user);

    return <NavDashItems user={userData} notifications={data} {...props} />;
}

export default NavbarDash;
