"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { music, MVideo } from "@/src/config/video";
import { Button } from "@nextui-org/react";
import { Icons } from "../icons/icons";

function MusicVideos({ className }: DefaultProps) {
    const videos = [...music].reverse();
    const videosGrouped: MVideo[][] = [];
    while (videos.length > 0) {
        videosGrouped.push(videos.splice(0, 3));
    }

    return (
        <div className={cn("space-y-5", className)}>
            <h2 className="text-start text-base font-semibold md:text-2xl">
                Music Videos
            </h2>

            <Carousel
                showIndicators={false}
                showStatus={false}
                renderArrowNext={(clickHandler, hasNext, label) => {
                    return (
                        <Button
                            onPress={clickHandler}
                            radius="full"
                            isIconOnly
                            className={cn(
                                "absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-default-100",
                                {
                                    hidden: !hasNext,
                                }
                            )}
                            startContent={
                                <Icons.chevronRight className="text-white/70" />
                            }
                            title={label}
                        />
                    );
                }}
                renderArrowPrev={(clickHandler, hasPrev, label) => {
                    return (
                        <Button
                            onPress={clickHandler}
                            radius="full"
                            isIconOnly
                            className={cn(
                                "absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-default-100",
                                {
                                    hidden: !hasPrev,
                                }
                            )}
                            startContent={
                                <Icons.chevronLeft className="text-white/70" />
                            }
                            title={label}
                        />
                    );
                }}
            >
                {videosGrouped.map((videos, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 px-5">
                        {videos.map((video, index) => {
                            const artists =
                                video.artists.length > 2
                                    ? video.artists[0].name +
                                      " ft. " +
                                      video.artists
                                          .slice(1)
                                          .map((artist) => artist.name)
                                          .join(", ")
                                    : video.artists.length === 2
                                      ? video.artists[0].name +
                                        " ft. " +
                                        video.artists[1].name
                                      : video.artists[0].name;

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="overflow-hidden rounded-lg">
                                        <LiteYouTubeEmbed
                                            id={video.id}
                                            title={video.name}
                                        />
                                    </div>

                                    <div className="text-start">
                                        <p className="text-sm font-semibold md:text-lg">
                                            {video.name.split(" - ")[0].length >
                                            30
                                                ? video.name
                                                      .split(" - ")[0]
                                                      .slice(0, 30) + "..."
                                                : video.name.split(" - ")[0]}
                                        </p>
                                        <p className="text-xs text-white/60 md:text-sm">
                                            {artists}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default MusicVideos;
