import MusicViewPage from "@/src/components/music/music-view-page";

function Page() {
    return (
        <section className="m-5 my-10 flex">
            <div className="container max-w-[75rem] space-y-10 p-0 md:space-y-16">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold">My Music</p>
                    <p className="text-gray-400">
                        Keep track of my songs and playlists
                    </p>
                </div>

                <MusicViewPage />
            </div>
        </section>
    );
}

export default Page;
