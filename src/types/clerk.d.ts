import { User } from "../lib/drizzle/schema";

declare global {
    interface UserPrivateMetadata {
        role: User["role"];
    }
}
