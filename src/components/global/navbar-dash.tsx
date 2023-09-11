import { db } from "@/src/lib/drizzle";
import { notifications } from "@/src/lib/drizzle/schema";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
import { currentUser } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import NavDashItems from "./navbar-dash-items";
import HomeNavbar from "./navbar-home";

async function DashNavbar({ className }: DefaultProps) {
    const user = await currentUser();
    if (!user) return <HomeNavbar />;

    const data = (await db.query.notifications.findMany({
        where: and(
            eq(notifications.userId, user.id),
            eq(notifications.read, false)
        ),
        orderBy: [desc(notifications.createdAt)],
        with: {
            notifier: true,
        },
    })) as ExtendedNotification[];

    const userData = userSchema.parse(user);

    return <NavDashItems user={userData} notifications={data} />;
}

export default DashNavbar;
