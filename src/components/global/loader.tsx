import { Icons } from "../icons/icons";

function Loader() {
    return (
        <div className="h-screen bg-black w-full flex justify-center items-center">
            <div className="flex flex-row gap-9 justify-center items-center">
                <Icons.music className="text-white animate-bounce h-20 w-20" />
            </div>
        </div>
    );
};

export default Loader;