import { redirect } from "next/navigation";
import LoginButton from "./login-button";
import DropdownProfile from "./dropdown-profile";
import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function Auth() {
    // const supabase = createServerComponentClient({ cookies });
    // const { data, error } = await supabase.auth.getUser();

    // if (error || !data) return <LoginButton className="px-4 flex gap-2 items-center" />;

    // const dbUser = await db.query.users.findFirst({ where: eq(users.id, data.user.id) });
    // if (!dbUser) redirect("/");

    return (
        <LoginButton className="px-4 flex gap-2 items-center hover:bg-zinc-800" />
        // <DropdownProfile user={dbUser} />
    );
}

export default Auth;