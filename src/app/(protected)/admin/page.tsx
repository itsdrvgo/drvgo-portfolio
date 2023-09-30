import AdminFAQ from "@/src/components/admin/admin-faq";
import AdminButtons from "@/src/components/admin/admin-tab";

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-[75rem] space-y-24 p-0">
                <div className="space-y-16">
                    <div className="space-y-2 text-center">
                        <p className="text-4xl font-bold">Admin Panel</p>

                        <p className="text-gray-400">
                            Manage your components from here
                        </p>
                    </div>

                    <AdminButtons className="grid w-full grid-cols-1 items-center justify-items-stretch gap-10 text-center md:grid-cols-2" />
                </div>

                <AdminFAQ />
            </div>
        </section>
    );
}

export default Page;
