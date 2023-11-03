import MusicViewPage from "@/src/components/music/music-view-page";

function Page() {
    return (
        <section className="flex p-5 py-10">
            <div className="container max-w-4xl space-y-8 p-0 2xl:max-w-6xl">
                <div className="space-y-2 text-center">
                    <p className="text-4xl font-bold md:text-5xl">My Music</p>
                    <p className="text-sm text-gray-400 md:text-base">
                        Keep track of my songs and playlists
                    </p>
                </div>

                <MusicViewPage />
            </div>
        </section>
    );
}

export default Page;
