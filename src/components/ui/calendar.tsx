"use client";

import { cn } from "@/src/lib/utils";
import { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { Icons } from "../icons/icons";

export type CalendarProps = ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg bg-transparent p-0 opacity-50 transition-colors hover:bg-default-200 hover:text-accent hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-gray-400 rounded-lg w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-default-50 first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg focus-within:relative focus-within:z-20",
                day: cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg p-0 font-normal transition-colors hover:bg-default-200 hover:text-accent aria-selected:opacity-100"
                ),
                day_selected:
                    "bg-primary text-gray-100 hover:bg-primary hover:text-gray-100 focus:bg-primary focus:text-gray-100",
                day_today: "bg-default-200 text-accent",
                day_outside: "text-gray-400 opacity-50",
                day_disabled: "text-gray-400 opacity-50",
                day_range_middle:
                    "aria-selected:bg-default-200 aria-selected:text-accent",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => (
                    <Icons.chevronLeft className="h-4 w-4" {...props} />
                ),
                IconRight: ({ ...props }) => (
                    <Icons.chevronRight className="h-4 w-4" {...props} />
                ),
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
