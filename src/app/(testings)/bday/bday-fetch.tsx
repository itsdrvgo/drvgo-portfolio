import { env } from "@/env.mjs";
import { db } from "@/src/lib/drizzle";
import { birthdayParticipants2023 } from "@/src/lib/drizzle/schema";
import { DefaultProps } from "@/src/types";
import { eq } from "drizzle-orm";
import BDayPage from "./bday-page";
import { Friend } from "./page";

interface PageProps extends DefaultProps {
    friend: Friend;
}

async function BDayFetch({ className, friend, ...props }: PageProps) {
    const data = await db.query.birthdayParticipants2023.findFirst({
        where: eq(birthdayParticipants2023.id, friend.id),
    });

    const isParticipating = data ? data.isParticipating : null;
    const location = env.LOCATION;

    return (
        <BDayPage
            className={className}
            location={location}
            friend={friend}
            isParticipating={isParticipating}
            {...props}
        />
    );
}

export default BDayFetch;
