import { IncomingHttpHeaders } from "http";
import { HTMLAttributes } from "react";
import { WebhookRequiredHeaders } from "svix";
import {
    Blog,
    Comment,
    CommentLove,
    Like,
    User,
    View,
} from "../lib/drizzle/schema";

export type NavItem = {
    title: string;
    href: string;
    disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SiteConfig = {
    name: string;
    description: string;
    url: string;
    ogImage: string;
    links: {
        twitter: string;
        github: string;
    };
};

export type MenuConfig = {
    mainNav: MainNavItem[];
};

export type DefaultProps = HTMLAttributes<HTMLElement>;

export interface RootLayoutProps {
    children: React.ReactNode;
}

export interface ExtendedComment extends Comment {
    user: User;
    loves: CommentLove[];
}

export interface ExtendedBlog extends Blog {
    likes: Like[];
    views: View[];
    comments: ExtendedComment[];
    author: User;
}

export type SvixHeaders = IncomingHttpHeaders & WebhookRequiredHeaders;
