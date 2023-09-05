import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import DropdownProfile from "./dropdown-profile";

interface PageProps extends DefaultProps {
    user: ClerkUser;
}

function Auth({ user }: PageProps) {
    return <DropdownProfile user={user} />;
}

export default Auth;
