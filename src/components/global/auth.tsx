import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DropdownProfile from "./dropdown-profile";
import LoginButton from "./login-button";

async function Auth() {
    // const supabase = createServerComponentClient({ cookies });
    // const { data, error } = await supabase.auth.getUser();

    // if (error || !data) return <LoginButton className="px-4 flex gap-2 items-center" />;

    // const dbUser = await db.query.users.findFirst({ where: eq(users.id, data.user.id) });
    // if (!dbUser) redirect("/");

    return (
        <LoginButton className="flex items-center gap-2 px-4 hover:bg-zinc-800" />
        // <DropdownProfile user={dbUser} />
    );
}

export default Auth;
