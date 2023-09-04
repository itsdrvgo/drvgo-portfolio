import { currentUser } from "@clerk/nextjs";
import DropdownProfile from "./dropdown-profile";
import LoginButton from "./login-button";

async function Auth() {
    const user = await currentUser();
    if (!user) return <LoginButton />;

    return <DropdownProfile user={user} />;
}

export default Auth;
