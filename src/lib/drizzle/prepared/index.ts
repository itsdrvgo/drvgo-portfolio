import { placeholder } from "drizzle-orm";
import { db } from "..";

export const runtime = "edge";

export const pGetUserByEmail = db.query.users
    .findFirst({
        where: (users, { eq }) => eq(users.email, placeholder("email")),
    })
    .prepare();

export const pGetUserById = db.query.users
    .findFirst({
        where: (users, { eq }) => eq(users.id, placeholder("id")),
    })
    .prepare();

export const pGetUserByAccount = db.query.accounts
    .findFirst({
        where: (accounts, { eq, and }) =>
            and(
                eq(
                    accounts.providerAccountId,
                    placeholder("providerAccountId")
                ),
                eq(accounts.provider, placeholder("provider"))
            ),
        with: {
            user: true,
        },
    })
    .prepare();

export const pGetSessionByToken = db.query.sessions
    .findFirst({
        where: (sessions, { eq }) =>
            eq(sessions.sessionToken, placeholder("sessionToken")),
    })
    .prepare();

export const pGetSessionAndUser = db.query.sessions
    .findFirst({
        where: (sessions, { eq }) =>
            eq(sessions.sessionToken, placeholder("sessionToken")),
        with: {
            user: true,
        },
    })
    .prepare();

export const pGetVerificationTokenByToken = db.query.verificationTokens
    .findFirst({
        where: (vt, { eq }) => eq(vt.token, placeholder("token")),
    })
    .prepare();
