import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselProps,
} from "../ui/carousel";
import MdxImage from "./image";

type MdxGalleryProps = DefaultProps &
    CarouselProps & {
        imagePaths: string[];
    };

function MdxGallery({ imagePaths, className, ...props }: MdxGalleryProps) {
    return (
        <Carousel
            opts={{
                align: "center",
                loop: true,
            }}
            className={cn("w-full", className)}
            {...props}
        >
            <CarouselContent>
                {imagePaths.map((imagePath) => (
                    <CarouselItem key={imagePath}>
                        <div className="size-full overflow-hidden rounded-xl">
                            {isUrl(imagePath) ? (
                                <MdxImage
                                    type="external"
                                    url={imagePath}
                                    classNames={{
                                        img: "lg:my-0",
                                    }}
                                />
                            ) : (
                                <MdxImage
                                    type="local"
                                    location={imagePath}
                                    classNames={{
                                        img: "lg:my-0",
                                    }}
                                />
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="from-background p-5" />
            <CarouselNext className="from-background p-5" />
        </Carousel>
    );
}

export default MdxGallery;

const isUrl = (image: string) => /^(http|https):\/\//.test(image);
