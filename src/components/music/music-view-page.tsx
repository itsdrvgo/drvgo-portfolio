"use client";

import { music } from "@/src/config/music";
import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";
import IFrame from "../global/iframe";

function MusicViewPage({ className }: DefaultProps) {
    return (
        <div className={cn("space-y-5", className)}>
            <h1 className="text-center text-2xl font-semibold md:text-start">
                My Latest Uploads
            </h1>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {music.videos.map((video, index) => {
                    const artists =
                        video.artists.length > 2
                            ? video.artists[0].name +
                              "ft." +
                              video.artists
                                  .slice(1)
                                  .map((artist) => artist.name)
                                  .join(", ")
                            : video.artists.length === 2
                            ? video.artists[0].name +
                              "ft." +
                              video.artists[1].name
                            : video.artists[0].name;

                    return (
                        <div key={index}>
                            <Card>
                                <CardBody className="p-3">
                                    <IFrame src={video.embed} />
                                </CardBody>

                                <Divider />

                                <CardFooter className="flex-col p-4 text-center">
                                    <p className="text-lg font-semibold">
                                        {video.name}
                                    </p>
                                    <p className="text-base">by {artists}</p>
                                </CardFooter>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MusicViewPage;
