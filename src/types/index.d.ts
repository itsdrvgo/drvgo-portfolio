import { IncomingHttpHeaders } from "http";
import { HTMLAttributes } from "react";
import { WebhookRequiredHeaders } from "svix";
import { Icons } from "../components/icons/icons";
import {
    Account,
    Blog,
    Chat,
    Comment,
    CommentLove,
    Like,
    Message,
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
    blogsOgImage: string;
    keywords: string[];
    links: {
        youtube: string;
        instagram: string;
        twitter: string;
        github: string;
        discord: string;
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

export type SvixHeaders = IncomingHttpHeaders & WebhookRequiredHeaders;
export type DefaultProps = HTMLAttributes<HTMLElement>;

export interface RootLayoutProps {
    children: React.ReactNode;
}

export interface UserWithAccount extends User {
    account: Account;
}

export interface ExtendedComment extends Comment {
    user: UserWithAccount;
    loves: CommentLove[];
    blog: Blog;
}

export interface ExtendedBlog extends Blog {
    likes: Like[];
    views: View[];
    comments: ExtendedComment[];
    author: UserWithAccount;
}

export interface ExtendedNotification extends Notification {
    notifier: User;
}

export interface ExtendedProject extends Project {
    purchaser: User;
}

export interface ChatWithMessages extends Chat {
    messages: Message[];
}

export interface ExtendedChat extends Chat {
    messages: Message[];
    sender: User;
    receiver: User;
}

export interface ChatWithExtendedMessages extends Chat {
    messages: Message[];
}

export interface MessageWithSenderAndReceiver extends Message {
    sender: User;
    receiver: User;
}

export interface ExtendedMessage extends Message {
    sender: User;
    receiver: User;
    chat: Chat;
}
