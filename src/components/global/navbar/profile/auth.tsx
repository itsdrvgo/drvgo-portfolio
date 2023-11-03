import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { ExtendedNotification } from "@/src/types";
import NotificationBar from "../notification/notification-bar";
import DropdownProfile from "./dropdown-profile";

interface PageProps {
    user: ClerkUserWithoutEmail;
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
