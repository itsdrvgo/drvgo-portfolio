import "@/styles/github-dark.css";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

function Page() {
    return notFound();
}

export default Page;

export async function generateStaticParams() {
    const files = fs.readdirSync(path.join("blogs"));

    const paths = files.map((filename) => ({
        slug: filename.replace(".mdx", ""),
    }));

    return paths;
}
