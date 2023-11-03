import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import DRVGOLogo from "../global/svgs/DRVGOLogo";

function Loader({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn(
                "flex h-screen w-full items-center justify-center",
                className
            )}
            {...props}
        >
            <div className="flex animate-pulse flex-col items-center gap-2">
                <DRVGOLogo width={200} height={200} />
                <p className="text-2xl font-bold uppercase">Loading...</p>
            </div>
        </div>
    );
}

export default Loader;
