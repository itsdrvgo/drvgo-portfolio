import AnnouncementForm from "@/src/components/forms/announcement-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Announcements",
    description: "Send announcements to all of the users",
};

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold">Announcements</p>
                    <p className="text-gray-400">
                        Send announcements to all of the users
                    </p>
                </div>

                <AnnouncementForm />
            </div>
        </section>
    );
}

export default Page;
