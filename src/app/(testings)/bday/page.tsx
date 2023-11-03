import { env } from "@/env.mjs";
import { parseJSONToObject } from "@/src/lib/utils";
import { Metadata } from "next";
import BDayFetch from "./bday-fetch";
import BDayForm from "./bday-form";
import InvalidBday from "./invalid-bday";

interface PageProps {
    searchParams?: {
        fId: string;
    };
}

export function generateMetadata({ searchParams }: PageProps): Metadata {
    if (!searchParams || !searchParams.fId)
        return {
            title: "Birthday Invitation",
            description: "Invitation to my birthday party",
        };

    const friends = parseJSONToObject<Friend[]>(env.FRIENDS);
    const friend = friends.find((f) => f.id === searchParams.fId);
    if (!friend)
        return {
            title: "Invalid Participant",
            description: "Invalid participant ID",
        };

    return {
        title: "Invitation to " + friend.firstName,
        description: "Invitation to my birthday party for " + friend.firstName,
    };
}

export interface Friend {
    id: string;
    firstName: string;
    lastName: string;
}

function Page({ searchParams }: PageProps) {
    const FriendsString = env.FRIENDS;
    const parsedFriends = parseJSONToObject<Friend[]>(FriendsString);

    if (!searchParams || !searchParams.fId)
        return <BDayForm friends={parsedFriends} />;

    const friend = parsedFriends.find((f) => f.id === searchParams.fId);
    if (!friend) return <InvalidBday />;

    return <BDayFetch friend={friend} />;
}

export default Page;
