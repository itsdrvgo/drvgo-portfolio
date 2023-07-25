import { SupabaseClient } from "@supabase/auth-helpers-nextjs";

interface EmailAuthProps {
    supabase: SupabaseClient;
    email: string;
    password: string;
}

async function signInWithEmail({ email, password, supabase }: EmailAuthProps) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}
