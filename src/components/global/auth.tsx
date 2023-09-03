import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import DropdownProfile from "./dropdown-profile";
import LoginButton from "./login-button";

async function Auth() {
    const { userId } = auth();
    if (!userId) return <LoginButton />;

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });
    if (!dbUser) return <LoginButton />;

    return <DropdownProfile user={dbUser} />;
}

export default Auth;
