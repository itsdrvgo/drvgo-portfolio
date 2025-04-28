import { NotFoundPage } from "@/components/globals/404";

export default function NotFound() {
    return (
        <div className="relative flex h-screen flex-col">
            <main className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xl space-y-6">
                    <NotFoundPage />
                </div>
            </main>
        </div>
    );
}
