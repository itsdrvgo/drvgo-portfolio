import { authOptions } from "@/src/lib/auth/auth";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import DropdownProfile from "./dropdown-profile";
import LoginButton from "./login-button";

async function Auth() {
    const session = await getServerSession(authOptions);
    if (!session)
        return <LoginButton className="flex items-center gap-2 px-4" />;

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });
    if (!dbUser)
        return <LoginButton className="flex items-center gap-2 px-4" />;

    return <DropdownProfile user={dbUser} />;
}

export default Auth;
