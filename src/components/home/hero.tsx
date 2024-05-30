import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";

export function Hero({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn(
                "relative flex h-full min-h-screen items-center justify-center overflow-hidden p-5 md:p-0",
                className
            )}
            style={{
                backgroundImage: "url(/noise-light.png)",
            }}
            {...props}
        >
            <div className="z-10 flex flex-col items-center gap-5 md:gap-0">
                <h1 className="text-6xl font-semibold md:text-[12rem]">
                    DRVGO
                </h1>
                <p className="max-w-3xl text-center text-base md:-translate-y-2 md:text-2xl">
                    A dedicated full-stack developer, passionate about crafting
                    seamless web solutions, with the expertise in Next.JS, React
                    & more... :D
                </p>
            </div>

            <div className="absolute bottom-32 right-32 size-96 rounded-full bg-primary/30 opacity-50 blur-3xl" />
            <div className="absolute left-28 top-12 size-[42rem] rounded-full bg-primary/30 opacity-50 blur-3xl" />
            <div className="absolute left-64 top-44 size-56 rounded-full bg-secondary/60 blur-3xl" />
        </section>
    );
}
