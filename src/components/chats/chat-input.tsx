"use client";

import { cn } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { CachedUser } from "@/src/types/cache";
import { Button, Textarea } from "@nextui-org/react";
import { EmojiStyle, Theme } from "emoji-picker-react";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icons } from "../icons/icons";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
    ssr: false,
});

interface PageProps extends DefaultProps {
    chatPartner: CachedUser;
    text: string;
    setText: Dispatch<SetStateAction<string>>;
    sendMessage: () => void;
    textAreaRef: React.RefObject<HTMLInputElement>;
}

function ChatInput({
    className,
    chatPartner,
    text,
    setText,
    sendMessage,
    textAreaRef,
    ...props
}: PageProps) {
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    useEffect(() => {
        textAreaRef.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className={cn(isEmojiPickerOpen ? "block" : "hidden")}>
                <EmojiPicker
                    theme={Theme.DARK}
                    emojiStyle={EmojiStyle.TWITTER}
                    width={"100%"}
                    previewConfig={{
                        showPreview: false,
                    }}
                    lazyLoadEmojis={true}
                    onEmojiClick={(emoji) => {
                        setText((prev) => prev + emoji.emoji);
                        textAreaRef.current?.focus();
                    }}
                />
            </div>

            <section
                className={cn("flex flex-col gap-2 bg-chat", className)}
                {...props}
            >
                <div className="z-50 flex items-center justify-between gap-3 bg-chat px-4 py-2">
                    <Button
                        isIconOnly
                        radius="full"
                        variant="light"
                        onPress={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                        startContent={
                            isEmojiPickerOpen ? (
                                <Icons.close className="h-6 w-6 text-gray-400" />
                            ) : (
                                <Icons.smile className="h-6 w-6 text-gray-400" />
                            )
                        }
                    />

                    <Textarea
                        ref={textAreaRef}
                        variant="bordered"
                        aria-label="Message"
                        minRows={1}
                        maxRows={6}
                        value={text}
                        placeholder={`Message @${chatPartner.username}`}
                        onValueChange={setText}
                        classNames={{
                            inputWrapper:
                                "bg-chat-input border border-gray-700 data-[hover=true]:bg-chat-input",
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />

                    <Button
                        isIconOnly
                        isDisabled={text.length === 0}
                        radius="full"
                        variant="light"
                        type="submit"
                        onPress={sendMessage}
                        startContent={
                            <Icons.sendHorizontal className="h-6 w-6 text-gray-400 data-[disabled=true]:text-gray-600" />
                        }
                    />
                </div>
            </section>
        </>
    );
}

export default ChatInput;
