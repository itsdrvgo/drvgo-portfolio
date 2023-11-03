"use client";

import DRVGOLogo from "@/src/components/global/svgs/DRVGOLogo";
import { Icons } from "@/src/components/icons/icons";
import { NewBirthdayParticipant2023 } from "@/src/lib/drizzle/schema";
import { cn, wait } from "@/src/lib/utils";
import { ResponseData } from "@/src/lib/validation/response";
import { DefaultProps } from "@/src/types";
import { Button, Divider, Radio, RadioGroup } from "@nextui-org/react";
import axios from "axios";
import { useAnimate } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { Friend } from "./page";
import "./page.css";

interface PageProps extends DefaultProps {
    friend: Friend;
    isParticipating: boolean | null;
    location: string;
}

function BDayPage({
    className,
    friend,
    isParticipating,
    location,
    ...props
}: PageProps) {
    const router = useRouter();
    const [scope, animate] = useAnimate();
    const [isShowing, setIsShowing] = useState(false);
    const [selected, setSelected] = useState(
        isParticipating === null ? "yes" : isParticipating ? "yes" : "no"
    );
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Submitting your response...");

        const body: NewBirthdayParticipant2023 = {
            id: friend.id,
            isParticipating: selected === "yes",
        };

        axios
            .post<ResponseData>("/api/bday", JSON.stringify(body))
            .then(({ data: resData }) => {
                if (resData.code !== 200)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                toast.success("Your response has been submitted!", {
                    id: toastId,
                });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsSubmitting(false);
                router.refresh();
            });
    };

    useEffect(() => {
        const ani = async () => {
            await animate("#glow_bg", {
                opacity: 1,
            });
            await animate("#you", {
                scale: [2, 1],
                opacity: 1,
            });
            await animate("#have", {
                scale: [2, 1],
                opacity: 1,
            });
            await animate("#been", {
                scale: [2, 1],
                opacity: 1,
            });
            await animate("#first", {
                opacity: 0,
            });
            setIsShowing(true);
            await animate("#second", {
                opacity: 1,
            });
            await wait(1000);
            await animate("#second", {
                opacity: 0,
            });
            await animate("#third", {
                opacity: 1,
            });
            setIsContentVisible(true);
            await animate("#content", {
                opacity: 1,
                height: "auto",
            });
            await wait(1000);
            setIsConfirmationVisible(true);
            await animate("#confirmation", {
                opacity: 1,
                height: "auto",
            });
        };

        ani();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section
            className={cn("h-full min-h-screen w-full px-4", className)}
            {...props}
            ref={scope}
        >
            <Confetti run={isShowing} numberOfPieces={500} recycle={false} />

            <div className="relative min-h-screen w-full">
                <div
                    className="glow-bg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
                    id="glow_bg"
                />

                <div className="z-50 text-white">
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold"
                        id="first"
                    >
                        <div className="flex items-center gap-3 text-5xl md:text-7xl">
                            <p id="you" className="opacity-0">
                                YOU
                            </p>
                            <p id="have" className="opacity-0">
                                HAVE
                            </p>
                        </div>

                        <p id="been" className="text-7xl opacity-0 md:text-9xl">
                            BEEN
                        </p>
                    </div>

                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-bold opacity-0"
                        id="second"
                    >
                        <p className="bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600 bg-clip-text text-7xl font-bold text-transparent md:text-9xl">
                            INVITED
                        </p>
                    </div>

                    <div
                        className="absolute left-1/2 top-1/2 flex w-full max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-hidden rounded-xl border border-gray-600 bg-black/20 p-5 px-7 opacity-0 backdrop-blur-md transition-all ease-in-out"
                        id="third"
                    >
                        <Link href={"/"} className="flex items-center gap-2">
                            <DRVGOLogo width={60} height={60} />
                            <p className="text-5xl font-bold text-accent">
                                DRVGO
                            </p>
                        </Link>

                        <div
                            id="content"
                            className={cn(
                                "h-0 w-full space-y-4 text-sm opacity-0 md:text-base",
                                {
                                    "mt-10": isContentVisible,
                                }
                            )}
                        >
                            <p>Hi, {friend.firstName}</p>

                            <p>
                                Coming this 22nd of November, 2023, I will be
                                turning 22. I would like to invite you to my
                                birthday party. I hope you can come and
                                celebrate with us. We will be hosting a joyful
                                gathering filled with music, laughter, and
                                delicious treats. It promises to be an
                                unforgettable night of fun and camaraderie as we
                                mark this special milestone in my life. Please
                                save the date, and let&apos;s make it a night to
                                remember.
                            </p>

                            <p>
                                It is completely fine if you cannot make it, but
                                please let us know by choosing one of the
                                options below. But, if you can make it, you may
                                check the location of the party below. Thank
                                you!
                            </p>

                            <div className="flex items-center justify-center">
                                <Link
                                    href={location}
                                    target="_blank"
                                    className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-indigo-500 p-2 px-3 font-semibold"
                                >
                                    <Icons.location className="h-4 w-4" />
                                    <span>Location</span>
                                </Link>
                            </div>
                        </div>

                        <div
                            id="confirmation"
                            className={cn("h-0 w-full space-y-4 opacity-0", {
                                "mt-4": isConfirmationVisible,
                            })}
                        >
                            <Divider />

                            {isParticipating !== null && (
                                <p className="text-center text-sm text-red-400">
                                    *{" "}
                                    {isParticipating
                                        ? "You have already confirmed your attendance, but you can still change your mind."
                                        : "You have already declined your attendance, but you can still change your mind."}
                                </p>
                            )}

                            <div className="flex items-center justify-center gap-2">
                                <RadioGroup
                                    value={selected}
                                    onValueChange={setSelected}
                                    isDisabled={isSubmitting}
                                    className="w-full"
                                >
                                    <Radio value={"yes"} size="sm">
                                        I will be attending your birthday party
                                    </Radio>
                                    <Radio value={"no"} size="sm">
                                        I will not be attending your birthday
                                        party
                                    </Radio>
                                </RadioGroup>

                                <Button
                                    color="primary"
                                    variant="shadow"
                                    size="sm"
                                    onPress={handleSubmit}
                                    isDisabled={
                                        (isParticipating !== null &&
                                            isParticipating ===
                                                (selected === "yes")) ||
                                        isSubmitting
                                    }
                                    isLoading={isSubmitting}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BDayPage;
