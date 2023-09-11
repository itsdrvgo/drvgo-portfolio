"use client";

import {
    ProjectCreateData,
    projectCreateSchema,
} from "@/src/lib/validation/project";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../icons/icons";
// import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function ProjectStartForm() {
    const { toast } = useToast();
    const router = useRouter();

    const { isOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(isOpen);

    const form = useForm<ProjectCreateData>({
        resolver: zodResolver(projectCreateSchema),
        defaultValues: {
            name: "",
            description: "",
            requirements: "",
        },
    });

    const onSubmit = async (data: ProjectCreateData) => {
        setIsLoading(true);

        try {
            setShowModal(true);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            console.log(err);
            toast({
                title: "Oops!",
                description: "Something went wrong, try again later.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    className="grid gap-5"
                    onSubmit={(...args) => form.handleSubmit(onSubmit)(...args)}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">
                                    Project Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Super Cool Project"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">
                                    Project Description (Optional)
                                </FormLabel>
                                <FormControl>
                                    <TextareaAutosize
                                        placeholder="A short description of your project."
                                        className="min-h-[100px] w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-base"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">
                                    Project Requirements
                                </FormLabel>
                                <FormDescription>
                                    You can use markdown expressions in this
                                    field
                                </FormDescription>
                                <FormControl>
                                    <TextareaAutosize
                                        placeholder="State the requirements for your project."
                                        className="min-h-[300px] w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-base"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        radius="sm"
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Icons.spinner
                                    className="h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                                <p>Creating Project</p>
                            </>
                        ) : (
                            <p>Create Project</p>
                        )}
                    </Button>
                </form>
            </Form>
            <Modal
                backdrop="blur"
                isOpen={showModal}
                onOpenChange={setShowModal}
                size="3xl"
                placement="center"
                scrollBehavior="inside"
                radius="sm"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Terms and Conditions</ModalHeader>
                            <ModalBody>
                                <h2 className="text-lg font-semibold">
                                    Usage of Services
                                </h2>
                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        You may not resell any products you
                                        purchase from us.
                                    </li>
                                    <li>
                                        You may not redistribute any products
                                        you purchase from us.
                                    </li>
                                    <li>
                                        You may not claim any products you
                                        purchase from us as your own.
                                    </li>
                                    <li>
                                        You may not use any products you
                                        purchase from us for illegal purposes.
                                    </li>
                                </ul>

                                <h2 className="text-lg font-semibold">
                                    Refunds
                                </h2>
                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        Refunds are only available if we are
                                        unable to complete your order or if we
                                        are unable to deliver your order within
                                        the specified time frame.
                                    </li>
                                    <li>
                                        Refunds are not available if you are
                                        banned from our services.
                                    </li>
                                </ul>

                                <h2 className="text-lg font-semibold">
                                    Chargebacks
                                </h2>
                                <p className="text-gray-400">
                                    Chargebacks are not allowed. If you initiate
                                    a chargeback, you will be banned from our
                                    services.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    Changes
                                </h2>
                                <p className="text-gray-400">
                                    We reserve the right to change these terms
                                    and conditions at any time.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    Developer Rights
                                </h2>
                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        We reserve the right to refuse service
                                        to anyone for any reason at any time.
                                    </li>
                                    <li>
                                        We reserve the right to modify or
                                        discontinue our services at any time.
                                    </li>
                                    <li>
                                        We reserve the right to change our
                                        prices at any time.
                                    </li>
                                    <li>
                                        Any new or unique features added in the
                                        project can be used by us in personal or
                                        public projects.
                                    </li>
                                </ul>

                                <hr />

                                <p>
                                    By clicking the &quot;Agree&quot; button
                                    below, you agree to the terms and conditions
                                    stated above.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button radius="sm" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    radius="sm"
                                    color="success"
                                    onClick={async () => {
                                        await onSubmit(form.getValues());
                                        onClose();
                                    }}
                                >
                                    Agree
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export { ProjectStartForm };
