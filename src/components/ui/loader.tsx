import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import DRVGOLogo from "../global/DRVGOLogo";

function Loader({ className, ...props }: DefaultProps) {
    return (
        <div
            className={cn(
                "flex h-screen w-full items-center justify-center",
                className
            )}
            {...props}
        >
            <DRVGOLogo className="animate-bounce" width={200} height={200} />
        </div>
    );
}

export default Loader;
