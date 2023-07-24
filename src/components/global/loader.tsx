import DRVGOLogo from "@/public/DRVGO.svg";
import Image from "next/image";

function Loader() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Image
                src={DRVGOLogo}
                alt="DRVGO"
                width={200}
                height={200}
                className="animate-bounce"
            />
        </div>
    );
}

export default Loader;
