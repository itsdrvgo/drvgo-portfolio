import Image from "next/image";
import DRVGOLogo from "@/public/DRVGO.svg";

function Loader() {
    return (
        <div className="h-screen bg-background w-full flex justify-center items-center">
            <Image src={DRVGOLogo} alt="DRVGO" width={200} height={200} className="animate-bounce" />
        </div>
    );
};

export default Loader;