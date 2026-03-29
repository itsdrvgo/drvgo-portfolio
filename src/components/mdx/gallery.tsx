import { cn } from "@/lib/utils";
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
        imageUrls: string[];
    };

export function MdxGallery({
    imageUrls,
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
                {imageUrls.map((url) => (
                    <CarouselItem key={url}>
                        <MdxImage url={url} className="lg:my-0!" />
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious className="left-0 h-full rounded-none border-none bg-gradient-to-r from-black/40 p-5 text-white/70 hover:bg-transparent hover:text-white" />
            <CarouselNext className="right-0 h-full rounded-none border-none bg-gradient-to-l from-black/40 p-5 text-white/70 hover:bg-transparent hover:text-white" />
        </Carousel>
    );
}
