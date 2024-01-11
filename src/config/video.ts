interface MArtist {
    name: string;
    href: string;
}

export interface MVideo {
    id: string;
    name: string;
    artists: MArtist[];
}

export interface CVideo {
    id: string;
    name: string;
}

export const music: MVideo[] = [
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
                href: "https://www.instagram.com/@JVKE",
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
                name: "Marc Wavy",
                href: "https://www.youtube.com/@MarcWavy",
            },
            {
                name: "DRVGO",
                href: "https://www.youtube.com/@itsdrvgo",
            },
        ],
    },
];

export const programming: CVideo[] = [
    {
        id: "U8lQsV_Lgpo",
        name: "6 Things to Know Before You Start Next.JS",
    },
    {
        id: "7W1DL0gWhLU",
        name: "Caching Can Never Get Easier Than This!",
    },
    {
        id: "3VJ0YiDESi0",
        name: "Streaming Data in is not as Hard as You Think",
    },
    {
        id: "7e6rDYhiBJY",
        name: "Why I Chose Drizzle in My 2023 Tech Stack",
    },
    {
        id: "8dohq-TgOXc",
        name: "I Chose Clerk over NextAuth... And This is Why!",
    },
    {
        id: "Qj4WAzrWtuE",
        name: "How to Start Your Programming Career - From a Developer's Perspective",
    },
    {
        id: "1Vl56wvjvZg",
        name: "Make Discord like Drag n' Drop System (Next.JS 13)",
    },
    {
        id: "Wb107eho0a4",
        name: "I Got Access to v0.dev. And I'm Lost for Words!",
    },
    {
        id: "Tonu_bAUhy0",
        name: "The Survey is here...",
    },
    {
        id: "KC1oC3ZdFPA",
        name: 'I made a rip off - "Post It"',
    },
    {
        id: "FYo-GR_utko",
        name: "No more app.use() from now on... Nexpress??",
    },
    {
        id: "He-cYL6WS0E",
        name: "I found a way to handle Pagination in Drizzle",
    },
];
