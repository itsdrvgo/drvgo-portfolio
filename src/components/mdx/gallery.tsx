import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselProps,
} from "../ui/carousel";
import { MdxImage } from "./image";

type MdxGalleryProps = GenericProps &
    CarouselProps & {
        imagePaths: string[];
    };

export function MdxGallery({
    imagePaths,
    className,
    ...props
}: MdxGalleryProps) {
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
                                    className="lg:my-0"
                                />
                            ) : (
                                <MdxImage
                                    type="local"
                                    location={imagePath}
                                    className="lg:my-0"
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

const isUrl = (image: string) => /^(http|https):\/\//.test(image);
