import { ClerkUser } from "@/src/lib/validation/user";
import { ExtendedNotification } from "@/src/types";
import NotificationBar from "../notification/notification-bar";
import DropdownProfile from "./dropdown-profile";

interface PageProps {
    user: ClerkUser;
    notifications: ExtendedNotification[];
}

function Auth({ user, notifications }: PageProps) {
    return (
        <>
            <NotificationBar data={notifications} user={user} />
            <DropdownProfile user={user} />
        </>
    );
}

export default Auth;
