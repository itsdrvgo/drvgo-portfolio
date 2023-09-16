export interface Artist {
    name: string;
    href: string;
}

export interface Playlist {
    name: string;
    songs: Song[];
    artists: Artist[];
    href: string;
}

export interface Song {
    name: string;
    artists: Artist[];
    album: Album;
    href: string;
}

export interface Video {
    name: string;
    artists: Artist[];
    href: string;
    embed: string;
}

export interface Album {
    name: string;
    songs: Song[];
    href: string;
}

export interface Music {
    playlists: Playlist[];
    songs: Song[];
    albums: Album[];
    videos: Video[];
}

export const music: Music = {
    playlists: [],
    songs: [],
    albums: [],
    videos: [
        // {
        //     name: "Sapna Jahan - DRVGO ft. Tisha (Cover) | WhatsApp Version",
        //     artists: [
        //         {
        //             name: "DRVGO",
        //             href: "https://www.youtube.com/@itsdrvgo",
        //         },
        //         {
        //             name: "Tisha",
        //             href: "https://www.instagram.com/tishade2004",
        //         },
        //     ],
        //     href: "https://www.youtube.com/watch?v=Q3Z3Q4Z6Z5M",
        // },
        {
            name: "GTA San Andreas Theme Song (Cover)",
            artists: [
                {
                    name: "DRVGO",
                    href: "https://www.youtube.com/@itsdrvgo",
                },
            ],
            href: "https://www.youtube.com/watch?v=XjiD9_NCY8I",
            embed: "https://www.youtube.com/embed/XjiD9_NCY8I?si=TfX6THJhGmA88P_W",
        },
    ],
};
