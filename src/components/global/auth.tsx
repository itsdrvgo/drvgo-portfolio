import { userSchema } from "@/src/lib/validation/user";
import { currentUser } from "@clerk/nextjs";
import DropdownProfile from "./dropdown-profile";
import LoginButton from "./login-button";

async function Auth() {
    const user = await currentUser();
    if (!user) return <LoginButton />;

    const userData = userSchema.parse(user);

    return <DropdownProfile user={userData} />;
}

export default Auth;
