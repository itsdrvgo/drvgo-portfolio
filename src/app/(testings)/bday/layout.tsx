import { RootLayoutProps } from "@/src/types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Birthday",
        template: "Birthday | %s",
    },
    description: "Invitation to my birthday party",
};

function Page({ children }: RootLayoutProps) {
    return <main className="h-screen flex-1 overflow-hidden">{children}</main>;
}

export default Page;
