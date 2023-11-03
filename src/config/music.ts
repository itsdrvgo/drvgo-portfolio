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
    id: string;
    name: string;
    artists: Artist[];
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
            id: "XjiD9_NCY8I",
            name: "GTA San Andreas Theme Song",
            artists: [
                {
                    name: "DRVGO",
                    href: "https://www.youtube.com/@itsdrvgo",
                },
            ],
        },
        {
            id: "V2GwWe3teDE",
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
        },
        {
            id: "LnsPH6y2GYc",
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
        },
        {
            id: "RX3L3SICy5k",
            name: "golden hour",
            artists: [
                {
                    name: "JVKE",
                    href: "https://www.instagram.com/tishade2004",
                },
                {
                    name: "DRVGO",
                    href: "https://www.youtube.com/@itsdrvgo",
                },
            ],
        },
        {
            id: "o15Oa8DJRn4",
            name: "Found",
            artists: [
                {
                    name: "JVKE",
                    href: "https://www.youtube.com/@JVKE",
                },
                {
                    name: "DRVGO",
                    href: "https://www.youtube.com/@itsdrvgo",
                },
            ],
        },
    ],
};
