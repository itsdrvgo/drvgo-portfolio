import AdminButtons from "@/src/components/admin/admin-tab";
import FAQAccordian from "@/src/components/admin/faq";
import { Separator } from "@/src/components/ui/separator";

function Page() {
    return (
        <section className="m-5 my-10 flex min-h-[calc(100vh-5rem)]">
            <div className="container max-w-[75rem] space-y-24">
                <div className="space-y-16">
                    <div className="space-y-2 text-center">
                        <p className="text-4xl font-bold">Admin Panel</p>
                        <p className="text-gray-400">
                            Manage your components from here
                        </p>
                    </div>
                    <AdminButtons className="grid w-full grid-cols-1 items-center justify-items-stretch gap-10 text-center md:grid-cols-2" />
                </div>
                <div className="space-y-4">
                    <p className="text-4xl font-bold">F.A.Q.</p>
                    <Separator className="h-[2px] w-12 bg-blue-300" />
                    <FAQAccordian className="w-full" />
                </div>
            </div>
        </section>
    );
}

export default Page;
