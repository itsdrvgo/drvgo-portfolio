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
        {
            name: "Until I Found You",
            artists: [
                {
                    name: "DRVGO",
                    href: "https://www.youtube.com/@itsdrvgo",
                },
                {
                    name: "Tisha",
                    href: "https://www.instagram.com/tishade2004",
                },
            ],
            href: "https://www.youtube.com/watch?v=LnsPH6y2GYc",
            embed: "https://www.youtube.com/embed/LnsPH6y2GYc?si=ghS-mAiZUPoQXMK5",
        },
        {
            name: "Sapna Jahan",
            artists: [
                {
                    name: "DRVGO",
                    href: "https://www.youtube.com/@itsdrvgo",
                },
                {
                    name: "Tisha",
                    href: "https://www.instagram.com/tishade2004",
                },
            ],
            href: "https://www.youtube.com/watch?v=V2GwWe3teDE",
            embed: "https://www.youtube.com/embed/V2GwWe3teDE?si=CevulRoGsZFOT3Qm",
        },
        {
            name: "GTA San Andreas Theme Song",
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
