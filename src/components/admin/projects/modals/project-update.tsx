"use client";

import { Icons } from "@/src/components/icons/icons";
import { Calendar } from "@/src/components/ui/calendar";
import { ProjectPatchData } from "@/src/lib/validation/project";
import { ResponseData } from "@/src/lib/validation/response";
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
import axios from "axios";
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
    data: ExtendedProject;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
    setSelected?: Dispatch<SetStateAction<Selection>>;
}

function ProjectUpdateModal({
    data,
    isOpen,
    onOpenChange,
    onClose,
    setSelected,
}: PageProps) {
    const router = useRouter();

    const [isUpdating, setIsUpdating] = useState(false);

    const [deadline, setDeadline] = useState(
        data.deadline?.toLocaleDateString()
    );
    const [price, setPrice] = useState(data.price);

    const handleProjectUpdate = () => {
        setIsUpdating(true);

        const toastId = toast.loading("Updating project...");

        const body: Pick<ProjectPatchData, "price" | "deadline"> = {
            price,
            deadline: deadline || undefined,
        };

        axios
            .patch<ResponseData>(
                `/api/projects/${data.id}`,
                JSON.stringify(body)
            )
            .then(({ data }) => {
                if (data.code !== 204)
                    return toast.error(data.message, {
                        id: toastId,
                    });

                toast.success("Project has been updated", {
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
                setIsUpdating(false);
                setSelected?.(new Set(["default"]));
                onClose();
                router.refresh();
            });
    };

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
                                onPress={handleProjectUpdate}
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
