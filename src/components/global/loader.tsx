import { DRVGOIcon } from "@/src/config/const";
import Image from "next/image";

function Loader() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Image
                src={DRVGOIcon}
                alt="DRVGO"
                width={200}
                height={200}
                className="animate-bounce"
            />
        </div>
    );
}

export default Loader;
