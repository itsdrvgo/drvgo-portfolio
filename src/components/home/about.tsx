import AboutGrid from "@/../public/about_grid.webp";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import Image from "next/image";
import { Button } from "../ui/button";

export function About({ className, ...props }: GenericProps) {
    return (
        <section
            className={cn("flex min-h-screen flex-col items-center", className)}
            {...props}
        >
            <div className="flex w-full justify-center bg-foreground p-5 py-10 md:py-14">
                <h2 className="text-4xl font-semibold text-background md:text-7xl">
                    Who Am I?
                </h2>
            </div>

            <div className="flex flex-1 justify-center p-5 py-16 md:py-28">
                <div className="flex w-full max-w-7xl flex-col-reverse items-center justify-between gap-10 lg:flex-row">
                    <div className="space-y-4 md:basis-1/2 md:space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-semibold md:text-5xl">
                                Sarthak Kundu
                            </h3>
                            <p className="text-xl text-muted-foreground md:text-2xl">
                                Full Stack Developer
                            </p>
                        </div>

                        <div className="space-y-4 text-base md:text-lg">
                            <p>
                                A dedicated full-stack developer, thriving to
                                craft seamless web solutions for the modern
                                world, with expertise in Next.JS, React & more.
                            </p>

                            <p>
                                Always eager to learn new technologies and tools
                                to enhance my skills and knowledge. More focused
                                on the back-end side of things, but also have a
                                good understanding of front-end technologies. A
                                quick learner & a team player, always ready to
                                go the extra mile.
                            </p>
                        </div>

                        <Button className="rounded-full p-5 py-6 text-lg md:p-6 md:py-7 md:text-xl">
                            Learn More
                        </Button>
                    </div>

                    <div className="pointer-events-none flex items-center justify-center md:basis-1/2 md:justify-end">
                        <Image src={AboutGrid} alt="About Grid" width={500} />
                    </div>
                </div>
            </div>
        </section>
    );
}
