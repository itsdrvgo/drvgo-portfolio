"use client";

import { cn, wait } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps, UserWithAccount } from "@/src/types";
import { Button, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Icons } from "../icons/icons";

interface PageProps extends DefaultProps {
    chatPartner: UserWithAccount;
    chatId: string;
}

function ChatInput({ className, chatPartner, chatId, ...props }: PageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLInputElement | null>(null);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (input.length === 0) return;
        setIsLoading(true);

        const body = {
            text: input,
            chatId,
        };

        axios
            .post<ResponseData>("/api/chats/send", JSON.stringify(body))
            .then(({ data: resData }) => {
                if (resData.code !== 201) toast.error(resData.message);
                setInput("");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!");
            })
            .finally(async () => {
                setIsLoading(false);
                await wait(100);
                textareaRef.current?.focus();
            });
    };

    return (
        <section
            className={cn(
                "flex items-center justify-between gap-3 px-4 py-2",
                className
            )}
            {...props}
        >
            <Textarea
                ref={textareaRef}
                variant="bordered"
                radius="sm"
                minRows={1}
                maxRows={6}
                value={input}
                placeholder={`Message @${chatPartner.username}`}
                onValueChange={(value) => setInput(value)}
                classNames={{
                    inputWrapper: "bg-background border-1 border-border",
                }}
                isDisabled={isLoading}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
            />
            <Button
                isIconOnly
                isDisabled={isLoading || input.length === 0}
                radius="sm"
                color="primary"
                className="bg-sky-300"
                type="submit"
                onPress={sendMessage}
            >
                <Icons.sendHorizontal className="h-5 w-5" />
            </Button>
        </section>
    );
}

export default ChatInput;
