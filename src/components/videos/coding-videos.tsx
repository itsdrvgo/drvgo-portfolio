"use client";

import { programming } from "@/src/config/video";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

function CodingVideos({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("space-y-5", className)} {...props}>
            <h2 className="text-start text-base font-semibold md:text-2xl">
                Coding Videos
            </h2>

            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {programming.reverse().map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <div className="size-full overflow-hidden rounded-xl">
                                <LiteYouTubeEmbed
                                    id={item.id}
                                    title={item.name}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

export default CodingVideos;
