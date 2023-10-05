// eslint-disable-next-line unused-imports/no-unused-imports
import { User } from "../lib/drizzle/schema";

declare global {
    interface UserPrivateMetadata {
        roles: string[];
        permissions: number;
        strikes: number;
    }
}
