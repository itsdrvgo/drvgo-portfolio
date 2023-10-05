import { CustomFileRouter } from "@/src/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { uploadFiles, useUploadThing } =
    generateReactHelpers<CustomFileRouter>();
