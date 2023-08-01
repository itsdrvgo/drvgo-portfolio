import { env } from "@/env.mjs";
import * as AuthSchema from "@/src/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession, NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import { adapterDB, db } from "../drizzle";
import { DrizzleAdapter } from "../drizzle/adapter";
import {
    pGetSessionAndUser,
    pGetSessionByToken,
    pGetUserByAccount,
    pGetUserByEmail,
    pGetUserById,
    pGetVerificationTokenByToken,
} from "../drizzle/prepared";
import { users } from "../drizzle/schema";

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(adapterDB, {
        schemas: {
            account: AuthSchema.accounts,
            session: AuthSchema.sessions,
            user: AuthSchema.users,
            verificationToken: AuthSchema.verificationTokens,
        },
        prepared: {
            getUserByEmail: pGetUserByEmail,
            getUserById: pGetUserById,
            getUserByAccount: pGetUserByAccount,
            getSessionByToken: pGetSessionByToken,
            getSessionAndUser: pGetSessionAndUser,
            getVerificationTokenByToken: pGetVerificationTokenByToken,
        },
    }),
    providers: [
        GitHubProvider({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7,
    },
    secret: env.NEXTAUTH_SECRET,
    callbacks: {
        session: async ({ token, session }) => {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }

            return session;
        },
        jwt: async ({ token, user }) => {
            const dbUser = await db.query.users.findFirst({
                where: eq(users.email, token.email),
            });

            if (!dbUser) {
                if (user) {
                    token.id = user.id;
                }
                return token;
            }

            return {
                id: dbUser.id,
                name: dbUser.name || "",
                email: dbUser.email,
                picture: dbUser.image,
            };
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);
