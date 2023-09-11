import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps, ExtendedNotification } from "@/src/types";
import DropdownProfile from "./dropdown-profile";
import NotificationBar from "./notification-bar";

interface PageProps extends DefaultProps {
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
