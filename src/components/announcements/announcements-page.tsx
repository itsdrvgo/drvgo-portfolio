import { db } from "@/src/lib/drizzle";
import { notifications } from "@/src/lib/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import GoBackButton from "../global/buttons/go-back-button";
import { EmptyPlaceholder } from "../ui/empty-placeholder";
import AnnouncementItem from "./announcement-item";

async function AnnouncementPage() {
    const announcements = await db.query.notifications.findMany({
        limit: 1,
        orderBy: [desc(notifications.createdAt)],
        where: eq(notifications.type, "custom"),
    });

    return (
        <>
            {announcements.length ? (
                <div className="">
                    {announcements.map((announcement) => (
                        <AnnouncementItem
                            key={announcement.id}
                            announcement={announcement}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <EmptyPlaceholder
                        title="No announcements"
                        description="No recent announcements from the admins"
                        icon="flag"
                        endContent={<GoBackButton />}
                    />
                </div>
            )}
        </>
    );
}

export default AnnouncementPage;
