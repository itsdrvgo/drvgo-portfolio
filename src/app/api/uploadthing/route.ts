import { createNextRouteHandler } from "uploadthing/next";
import { customFileRouter } from "./core";

export const { GET, POST } = createNextRouteHandler({
    router: customFileRouter,
});
