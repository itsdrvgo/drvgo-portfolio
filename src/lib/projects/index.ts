import { ExtendedProject } from "@/src/types";

export function isAcceptable(status: ExtendedProject["status"]) {
    return status === "pending";
}

export function isRejectable(status: ExtendedProject["status"]) {
    return status === "pending";
}

export function isCompletable({
    status,
    price,
    deadline,
}: {
    status: ExtendedProject["status"];
    price: ExtendedProject["price"];
    deadline: ExtendedProject["deadline"];
}) {
    return (
        price > 0 &&
        deadline &&
        ["accepted", "in_progress", "paid"].includes(status)
    );
}

export function isCancellable(
    status: ExtendedProject["status"],
    isSeller: boolean
) {
    return isSeller
        ? ["pending", "accepted", "paid", "in_progress"].includes(status)
        : ["pending", "accepted", "in_progress"].includes(status);
}

export function isUpdatable(status: ExtendedProject["status"]) {
    return ["accepted", "in_progress", "paid"].includes(status);
}

export function isPayable({
    status,
    price,
    deadline,
}: {
    status: ExtendedProject["status"];
    price: ExtendedProject["price"];
    deadline: ExtendedProject["deadline"];
}) {
    return (
        price > 0 && deadline && ["accepted", "in_progress"].includes(status)
    );
}

export function isEditable(status: ExtendedProject["status"]) {
    return ["pending", "accepted", "in_progress"].includes(status);
}

export function isMessageable(status: ExtendedProject["status"]) {
    return ["pending", "accepted", "in_progress", "paid"].includes(status);
}
