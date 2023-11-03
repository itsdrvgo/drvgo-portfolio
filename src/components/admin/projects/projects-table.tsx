"use client";

import { DEFAULT_USER_IMAGE } from "@/src/config/const";
import { cn, formatDate } from "@/src/lib/utils";
import { Column, DefaultProps, ExtendedProject } from "@/src/types";
import {
    Button,
    Chip,
    ChipProps,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Select,
    Selection,
    SelectItem,
    SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    User,
} from "@nextui-org/react";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { Icons } from "../../icons/icons";
import ProjectOperation from "./project-operation";

const columns: Column[] = [
    {
        name: "Name",
        uid: "name",
        sortable: true,
    },
    {
        name: "Purchaser",
        uid: "purchaser",
        sortable: true,
    },
    {
        name: "Status",
        uid: "status",
        sortable: true,
    },
    {
        name: "Price ($)",
        uid: "price",
        sortable: true,
    },
    {
        name: "Created",
        uid: "createdAt",
        sortable: true,
    },
    {
        name: "Deadline",
        uid: "deadline",
        sortable: true,
    },
    {
        name: "Actions",
        uid: "actions",
    },
];

const INITIAL_VISIBLE_COLUMNS = [
    "name",
    "status",
    "price",
    "purchaser",
    "deadline",
    "actions",
];

export interface StatusOption {
    name: string;
    uid: string;
}

export const statusOptions: StatusOption[] = [
    {
        name: "Pending",
        uid: "pending",
    },
    {
        name: "Accepted",
        uid: "accepted",
    },
    {
        name: "Rejected",
        uid: "rejected",
    },
    {
        name: "In Progress",
        uid: "in_progress",
    },
    {
        name: "Paid",
        uid: "paid",
    },
    {
        name: "Completed",
        uid: "completed",
    },
    {
        name: "Cancelled",
        uid: "cancelled",
    },
];

export const statusColorMap: Record<string, ChipProps["color"]> = {
    pending: "default",
    accepted: "warning",
    rejected: "danger",
    in_progress: "default",
    paid: "warning",
    completed: "success",
    cancelled: "secondary",
};

interface PageProps extends DefaultProps {
    data: ExtendedProject[];
}

function ProjectsTable({ className, data }: PageProps) {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "created",
        direction: "descending",
    });

    const [page, setPage] = useState(1);
    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredData = [...data];

        if (hasSearchFilter)
            filteredData = filteredData.filter((x) =>
                x.name.toLowerCase().includes(filterValue.toLowerCase())
            );

        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== statusOptions.length
        )
            filteredData = filteredData.filter((x) =>
                Array.from(statusFilter).includes(x.status)
            );

        return filteredData;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [filteredItems, page, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const sorter = sortDescriptor.column!;

            const first = a[
                sorter as keyof ExtendedProject
            ] as unknown as number;
            const second = b[
                sorter as keyof ExtendedProject
            ] as unknown as number;

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback(
        (project: ExtendedProject, columnKey: Key) => {
            const cellValue = project[columnKey as keyof ExtendedProject];

            switch (columnKey) {
                case "name": {
                    return <span>{cellValue as string}</span>;
                }

                case "status": {
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[project.status]}
                            size="sm"
                            variant="flat"
                        >
                            {statusOptions.find((x) => x.uid === project.status)
                                ?.name ?? "Unknown"}
                        </Chip>
                    );
                }

                case "price": {
                    return (
                        <span>
                            {(cellValue as number) == 0
                                ? "Not set"
                                : "$ " + (cellValue as number)}
                        </span>
                    );
                }

                case "purchaser": {
                    return (
                        <User
                            avatarProps={{
                                src:
                                    project.purchaser.image ??
                                    DEFAULT_USER_IMAGE.src,
                            }}
                            name={project.purchaser.username}
                        />
                    );
                }

                case "deadline": {
                    return (
                        <span>
                            {cellValue === null
                                ? "Not set"
                                : formatDate(
                                      new Date(cellValue as string).getTime()
                                  )}
                        </span>
                    );
                }

                case "createdAt": {
                    return (
                        <span>
                            {formatDate(
                                new Date(cellValue as string).getTime()
                            )}
                        </span>
                    );
                }

                case "actions": {
                    return (
                        <div className="flex items-center justify-end">
                            <ProjectOperation data={project} />
                        </div>
                    );
                }

                default: {
                    return null;
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        []
    );

    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage((prev) => prev + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    }, [page]);

    const onRowsPerPageChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        },
        []
    );

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by project name..."
                        startContent={<Icons.search className="h-4 w-4" />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />

                    <div className="flex items-center gap-3">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    endContent={
                                        <Icons.chevronDown className="h-4 w-4" />
                                    }
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Status"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize"
                                    >
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    endContent={
                                        <Icons.chevronDown className="h-4 w-4" />
                                    }
                                    variant="flat"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                    >
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-small text-default-400">
                            Total {data.length} projects
                        </p>
                    </div>
                    <div className="w-full max-w-[44%] md:max-w-[20%]">
                        <Select
                            radius="lg"
                            label="Rows per page"
                            onChange={onRowsPerPageChange}
                            size="sm"
                        >
                            <SelectItem value={5} key={5}>
                                5
                            </SelectItem>
                            <SelectItem value={10} key={10}>
                                10
                            </SelectItem>
                            <SelectItem value={15} key={15}>
                                15
                            </SelectItem>
                        </Select>
                    </div>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedKeys,
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        data.length,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="flex items-center justify-between p-2">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>

                <Pagination
                    isCompact
                    showControls
                    showShadow
                    page={page}
                    total={pages}
                    onChange={setPage}
                />

                <div className="hidden w-[30%] justify-end gap-2 sm:flex">
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}
                    >
                        Previous
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Projects Table"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            className={cn("", className)}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>

            <TableBody emptyContent={"No projects found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default ProjectsTable;
