"use client";

import DRVGOLogo from "@/src/components/global/svgs/DRVGOLogo";
import { siteConfig } from "@/src/config/site";
import { cn, wait } from "@/src/lib/utils";
import { DefaultProps } from "@/src/types";
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Friend } from "./page";

interface PageProps extends DefaultProps {
    friends: Friend[];
}

function BDayForm({ className, friends, ...props }: PageProps) {
    const router = useRouter();
    const [friendId, setFriendId] = useState("");
    const ref = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        const toastId = toast.loading("Validating...");
        await wait(1000);

        const friend = friends.find((f) => f.id === friendId);
        if (!friend) {
            setFriendId("");
            ref.current?.focus();
            return toast.error("Invalid ID!", {
                id: toastId,
            });
        }

        toast.success("Hi, " + friend.firstName + "!", {
            id: toastId,
        });

        router.push(`/bday?fId=${friendId}`);
    };

    return (
        <section
            className={cn(
                "container relative flex h-screen items-center justify-center p-4 md:p-6",
                className
            )}
            {...props}
        >
            <div className="glow-bg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

            <Card
                fullWidth
                className="w-full max-w-lg"
                classNames={{
                    base: "bg-transparent backdrop-blur-sm",
                }}
            >
                <CardBody className="items-center gap-10">
                    <div className="flex items-center gap-2 text-2xl font-bold text-accent">
                        <DRVGOLogo width={40} height={40} />
                        <p>{siteConfig.name}</p>
                    </div>

                    <p className="text-center text-gray-400">
                        Seems like you were invited to a birthday party! You are
                        just one step away from joining the party! Please enter
                        your ID below and let us know who you are!
                    </p>

                    <Input
                        ref={ref}
                        autoFocus
                        variant="underlined"
                        placeholder="Enter your ID"
                        className="w-full"
                        value={friendId}
                        onValueChange={setFriendId}
                    />
                </CardBody>

                <CardFooter className="justify-center">
                    <Button
                        onPress={handleSubmit}
                        type="submit"
                        color="primary"
                    >
                        Submit
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}

export default BDayForm;
