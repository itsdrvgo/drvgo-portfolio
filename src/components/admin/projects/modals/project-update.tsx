"use client";

import { updateProject } from "@/src/actions/projects";
import { Icons } from "@/src/components/icons/icons";
import { Calendar } from "@/src/components/ui/calendar";
import { handleClientError } from "@/src/lib/utils";
import { projectUpdateSchema } from "@/src/lib/validation/project";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { ExtendedProject } from "@/src/types";
import {
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    Selection,
    SelectItem,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

interface QuickPickerProps {
    key: string;
    value: string;
}

const quickPickers: QuickPickerProps[] = [
    {
        key: "0",
        value: "Today",
    },
    {
        key: "1",
        value: "Tomorrow",
    },
    {
        key: "3",
        value: "In 3 days",
    },
    {
        key: "7",
        value: "In a week",
    },
];

interface PageProps {
    project: ExtendedProject;
    isOpen: boolean;
    user: ClerkUserWithoutEmail;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    setSelected?: Dispatch<SetStateAction<Selection>>;
}

function ProjectUpdateModal({
    project,
    isOpen,
    user,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const [deadline, setDeadline] = useState(
        project.deadline?.toLocaleDateString()
    );
    const [price, setPrice] = useState(project.price);

    const { mutate: handleProjectUpdate, isLoading: isUpdating } = useMutation({
        onMutate() {
            const toastId = toast.loading("Updating project...");
            return {
                toastId,
            };
        },
        async mutationFn() {
            projectUpdateSchema.parse({
                price,
                deadline,
            });

            await updateProject({
                project,
                user,
                props: {
                    price,
                    deadline,
                },
            });
        },
        onSuccess(_, __, ctx) {
            toast.success("Project has been updated", {
                id: ctx?.toastId,
            });
            router.refresh();
        },
        onError(err, _, ctx) {
            handleClientError(err, ctx?.toastId);
        },
        onSettled() {
            setSelected?.(new Set(["default"]));
            onClose();
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
                body: "gap-5",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Update Project</ModalHeader>
                        <ModalBody>
                            <Input
                                type="number"
                                label="Price"
                                placeholder="Enter price"
                                inputMode="numeric"
                                labelPlacement="outside"
                                classNames={{
                                    label: "text-base",
                                }}
                                startContent={
                                    <Icons.dollar className="h-4 w-4" />
                                }
                                value={price.toString()}
                                onValueChange={(value) =>
                                    setPrice(Number(value))
                                }
                            />

                            <div className="flex flex-col gap-2">
                                <p>Select deadline</p>

                                <Popover
                                    classNames={{
                                        base: "p-2 gap-2",
                                    }}
                                >
                                    <PopoverTrigger>
                                        <Button
                                            radius="sm"
                                            startContent={
                                                <Icons.calender className="h-4 w-4" />
                                            }
                                        >
                                            {deadline
                                                ? format(
                                                      new Date(deadline),
                                                      "PPP"
                                                  )
                                                : "Select date"}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent>
                                        <Select
                                            radius="sm"
                                            size="sm"
                                            label="Quick Pick"
                                            onSelectionChange={(keys) => {
                                                const action = Array.from(
                                                    keys
                                                ).pop() as string;

                                                setDeadline(
                                                    addDays(
                                                        new Date(),
                                                        Number(action)
                                                    ).toLocaleDateString()
                                                );
                                            }}
                                        >
                                            {quickPickers.map((picker) => (
                                                <SelectItem key={picker.key}>
                                                    {picker.value}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        <Divider />

                                        <Calendar
                                            mode="single"
                                            selected={
                                                deadline
                                                    ? new Date(deadline)
                                                    : undefined
                                            }
                                            onSelect={(date) => {
                                                setDeadline(
                                                    date!.toLocaleDateString()
                                                );
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                radius="sm"
                                color="danger"
                                variant="light"
                                isDisabled={isUpdating}
                                onPress={onClose}
                                className="font-semibold"
                            >
                                Close
                            </Button>
                            <Button
                                radius="sm"
                                color="primary"
                                variant="flat"
                                className="font-semibold"
                                isDisabled={isUpdating}
                                isLoading={isUpdating}
                                onPress={() => handleProjectUpdate()}
                            >
                                Update
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ProjectUpdateModal;
