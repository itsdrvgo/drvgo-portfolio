"use client";

import { music } from "@/src/config/video";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";

function MusicVideos({ className, ...props }: DefaultProps) {
    return (
        <div className={cn("space-y-5", className)} {...props}>
            <h2 className="text-start text-base font-semibold md:text-2xl">
                Music Videos
            </h2>

            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {music.reverse().map((item, index) => (
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

export default MusicVideos;
