import { IncomingHttpHeaders } from "http";
import { HTMLAttributes } from "react";
import { WebhookRequiredHeaders } from "svix";
import { Icons } from "../components/icons/icons";
import {
    Account,
    Blog,
    Comment,
    CommentLove,
    Like,
    Project,
    User,
    View,
} from "../lib/drizzle/schema";
import { Notification } from "./notification";

export type NavItem = {
    title: string;
    description?: string;
    href: string;
    disabled?: boolean;
    icon?: keyof typeof Icons;
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
    mainNav: NavItem[];
    subNav: NavItem[];
};

export interface Column {
    name: string;
    uid: string;
    sortable?: boolean;
}

export type DefaultProps = HTMLAttributes<HTMLElement>;

export interface RootLayoutProps {
    children: React.ReactNode;
}

export interface UserWithAccount extends User {
    account: Account;
}

export interface ExtendedComment extends Comment {
    user: User;
    loves: CommentLove[];
    blog: Blog;
}

export interface ExtendedBlog extends Blog {
    likes: Like[];
    views: View[];
    comments: ExtendedComment[];
    author: User;
}

export interface ExtendedNotification extends Notification {
    notifier: User;
}

export interface ExtendedProject extends Project {
    purchaser: User;
}

export type FAQ = {
    question: string;
    answer: string;
};

export type SvixHeaders = IncomingHttpHeaders & WebhookRequiredHeaders;
