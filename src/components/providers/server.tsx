import { DefaultProps } from "@/src/types";
import { ClerkProvider } from "@clerk/nextjs";

function ServerProvider({ children }: DefaultProps) {
    return <ClerkProvider>{children}</ClerkProvider>;
}

export default ServerProvider;
