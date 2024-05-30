import CSS from "@/../public/tech-stack/css.jpg";
import HTML from "@/../public/tech-stack/html.jpg";
import JavaScript from "@/../public/tech-stack/js.jpg";
import MongoDB from "@/../public/tech-stack/mongodb.jpg";
import MySQL from "@/../public/tech-stack/mysql.jpg";
import NextJS from "@/../public/tech-stack/nextjs.jpg";
import NodeJS from "@/../public/tech-stack/nodejs.jpg";
import PostgreSQL from "@/../public/tech-stack/postgresql.jpg";
import React from "@/../public/tech-stack/react.jpg";
import TailwindCSS from "@/../public/tech-stack/tailwindcss.jpg";
import TypeScript from "@/../public/tech-stack/ts.jpg";
import { Skill } from "@/types";

export const skills: Skill[] = [
    {
        name: "HTML",
        description:
            "The standard markup language for documents designed to be displayed in a web browser.",
        image: HTML,
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
        name: "CSS",
        description:
            "A style sheet language used for describing the presentation of a document written in HTML.",
        image: CSS,
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    {
        name: "React",
        description:
            "A JavaScript library for building user interfaces or UI components.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        image: React,
        href: "https://reactjs.org/",
    },
    {
        name: "Next.JS",
        description:
            "A React framework that provides a solution for server-side rendering, static site generation, and much more.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        image: NextJS,
        href: "https://nextjs.org/",
    },
    {
        name: "JavaScript",
        description:
            "A high-level, often just-in-time compiled, and multi-paradigm programming language.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        image: JavaScript,
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
        name: "TypeScript",
        description:
            "An open-source language which builds on JavaScript by adding static type definitions.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        image: TypeScript,
        href: "https://www.typescriptlang.org/",
    },
    {
        name: "Node.JS",
        description:
            "An event-driven JavaScript runtime built on Chrome's V8 JavaScript engine.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        image: NodeJS,
        href: "https://nodejs.org/en/",
    },
    {
        name: "MongoDB",
        description:
            "A cross-platform document-oriented database program, classified as a NoSQL database program.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        image: MongoDB,
        href: "https://www.mongodb.com/",
    },
    {
        name: "MySQL",
        description:
            "An open-source relational database management system based on SQL.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        image: MySQL,
        href: "https://www.mysql.com/",
    },
    {
        name: "PostgreSQL",
        description:
            "A powerful, open-source object-relational database system.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        image: PostgreSQL,
        href: "https://www.postgresql.org/",
    },
    {
        name: "Tailwind CSS",
        description:
            "A utility-first CSS framework for rapidly building custom user interfaces.",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        image: TailwindCSS,
        href: "https://tailwindcss.com/",
    },
];
