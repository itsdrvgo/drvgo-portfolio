import DRVGOLogo from "./DRVGOLogo";

function Loader() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <DRVGOLogo className="animate-bounce" width={200} height={200} />
        </div>
    );
}

export default Loader;
