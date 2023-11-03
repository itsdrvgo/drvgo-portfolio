import BDayBG from "@/public/patterns/bday_bg.webp";
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
    return (
        <main
            className="h-full min-h-screen flex-1 overflow-x-hidden"
            style={{
                background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BDayBG.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {children}
        </main>
    );
}

export default Page;
