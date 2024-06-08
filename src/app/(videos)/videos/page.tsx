import { VideoCards, VideoCarousel } from "@/components/videos";
import { programmingVideos } from "@/config/video";

function Page() {
    return (
        <section className="flex min-h-screen justify-center p-5 py-10">
            <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
                <div className="space-y-2 text-center md:text-start">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        My Videos
                    </h1>
                    <p className="text-sm md:text-base">
                        I make videos on programming
                    </p>
                </div>

                <VideoCards videos={programmingVideos} className="md:hidden" />

                <VideoCarousel
                    videos={programmingVideos}
                    options={{
                        loop: true,
                    }}
                    className="hidden md:block"
                />
            </div>
        </section>
    );
}

export default Page;
