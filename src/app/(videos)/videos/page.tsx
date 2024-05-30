import { notFound } from "next/navigation";

function Page() {
    return notFound();
    // return (
    //     <section className="flex justify-center p-5 py-10">
    //         <div className="w-full max-w-4xl space-y-8 2xl:max-w-6xl">
    //             <div className="space-y-2 text-center">
    //                 <h1 className="text-4xl font-bold md:text-5xl">
    //                     My Videos
    //                 </h1>
    //                 <p className="text-sm text-white/60 md:text-base">
    //                     I make videos on music, and programming
    //                 </p>
    //             </div>

    //             <CodingVideos />
    //             <MusicVideos />
    //         </div>
    //     </section>
    // );
}

export default Page;
