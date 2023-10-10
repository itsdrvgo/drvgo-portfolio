export type CachedUser = {
    id: string;
    username: string;
    image: string | null;
    email: string;
    permissions: number;
    roles: string[];
    strikes: number;
    createdAt: string;
    updatedAt: string;
};

export type CachedBlog = {
    id: string;
    title: string;
    thumbnailUrl: string | null;
    description: string;
    content: string | null;
    createdAt: string;
    updatedAt: string | null;
    authorId: string;
    published: boolean;
    likes: number;
    views: number;
    comments: number;
};

export type CachedRole = {
    id: string;
    name: string;
    key: string;
    position: number;
    permissions: number;
    createdAt: string;
    updatedAt: string;
};
