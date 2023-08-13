"use client";

import { defaultUserPFP } from "@/src/config/const";
import { NewComment, User } from "@/src/lib/drizzle/schema";
import { cn } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, ExtendedBlog, ExtendedComment } from "@/src/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

interface PageProps extends DefaultProps {
    user: User | null;
    blog: ExtendedBlog;
    params: {
        blogId: string;
    };
    comment: ExtendedComment;
}

function BlogCommentViewerOperation({
    user,
    blog,
    params,
    comment,
}: PageProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isLoved, setIsLoved] = useState(false);

    useEffect(() => {
        if (reply.length) setIsActive(true);
        else setIsActive(false);
    }, [reply.length]);

    const handleSetReply = () => {
        if (!user)
            return toast({
                title: "Oops!",
                description: "You're not logged in",
                variant: "destructive",
                action: (
                    <ToastAction
                        className="border-white focus:ring-0 focus:ring-offset-0"
                        altText="Login to continue"
                        onClick={() => router.push("/signin")}
                    >
                        Login
                    </ToastAction>
                ),
            });

        setIsReplying(true);
    };

    const handleReplyAdd = () => {
        setIsActive(false);
        setIsPosting(true);

        const body: Pick<NewComment, "content"> = {
            content: reply,
        };

        axios
            .post<ResponseData>(
                `/api/blogs/comments/${params.blogId}/${comment.id}`,
                JSON.stringify(body)
            )
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast({
                        title: "Oops!",
                        description: resData.message,
                        variant: "destructive",
                    });

                router.refresh();
                toast({
                    description: "Reply added",
                });
            })
            .catch((err) => {
                console.log(err);
                return toast({
                    title: "Oops!",
                    description: "Something went wrong, try again later",
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsPosting(false);
                setIsReplying(false);
                setReply("");
            });
    };

    const handleCommentLove = () => {
        if (!user)
            return toast({
                title: "Oops!",
                description: "You're not logged in",
                variant: "destructive",
                action: (
                    <ToastAction
                        className="border-white focus:ring-0 focus:ring-offset-0"
                        altText="Login to continue"
                        onClick={() => router.push("/signin")}
                    >
                        Login
                    </ToastAction>
                ),
            });

        setIsLoved(!isLoved);

        const isLiked = comment.loves.find((love) => love.userId === user.id);

        !!isLiked
            ? axios
                  .delete<ResponseData>(
                      `/api/blogs/comments/${blog.id}/${comment.id}/love`
                  )
                  .then(({ data: resData }) => {
                      if (resData.code !== 200)
                          return toast({
                              title: "Oops!",
                              description: resData.message,
                              variant: "destructive",
                          });

                      router.refresh();
                  })
                  .catch((err) => {
                      console.log(err);

                      toast({
                          title: "Oops!",
                          description: "Something went wrong, try again later",
                          variant: "destructive",
                      });
                  })
            : axios
                  .patch<ResponseData>(
                      `/api/blogs/comments/${blog.id}/${comment.id}/love`
                  )
                  .then(({ data: resData }) => {
                      if (resData.code !== 200)
                          return toast({
                              title: "Oops!",
                              description: resData.message,
                              variant: "destructive",
                          });

                      router.refresh();
                  })
                  .catch((err) => {
                      console.log(err);

                      toast({
                          title: "Oops!",
                          description: "Something went wrong, try again later",
                          variant: "destructive",
                      });
                  });
    };

    return (
        <>
            <div className="flex items-center gap-4 text-gray-400">
                <button
                    className="flex cursor-pointer items-center gap-2"
                    onClick={handleCommentLove}
                >
                    <Icons.heart
                        className={cn(
                            "h-4 w-4 transition-all ease-in-out",
                            isLoved ? "fill-red-600 text-red-600" : "fill-none"
                        )}
                    />
                    <p className="text-sm">{comment.loves.length}</p>
                </button>
                <button
                    className="rounded-full p-1 px-3 text-sm transition-all ease-in-out hover:bg-slate-800"
                    onClick={handleSetReply}
                >
                    Reply
                </button>
            </div>{" "}
            {isReplying && user ? (
                <div className="flex flex-col items-center gap-4 pt-5">
                    <div className="flex w-full gap-2">
                        <Avatar className="h-6 w-6 md:h-8 md:w-8">
                            <AvatarImage
                                src={user.image ?? defaultUserPFP.src}
                                alt={user.name ?? user.id}
                            />
                            <AvatarFallback>
                                {(user.name ?? user.id).charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <TextareaAutosize
                            placeholder="Reply to this comment"
                            className="min-h-[80px] w-full resize-none overflow-hidden rounded-sm border border-gray-700 bg-zinc-950 px-3 py-2 text-sm focus:border-white"
                            disabled={isPosting}
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                        />
                    </div>
                    <div className="flex w-full items-center justify-end gap-2">
                        <Button
                            variant={"secondary"}
                            size={"sm"}
                            onClick={() => {
                                setIsReplying(false);
                                setReply("");
                            }}
                            disabled={isPosting}
                        >
                            Cancel
                        </Button>
                        <Button
                            size={"sm"}
                            onClick={handleReplyAdd}
                            disabled={!isActive}
                        >
                            Reply
                        </Button>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default BlogCommentViewerOperation;
