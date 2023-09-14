"use client";

import { defaultUserPFP } from "@/src/config/const";
import { User as DBUser } from "@/src/lib/drizzle/schema";
import { cn, formatDate } from "@/src/lib/utils";
import { ClerkUser } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import {
    Button,
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
import {
    ChangeEvent,
    Key,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Icons } from "../../icons/icons";
import UsersMassManage from "./users-mass-manage";
import UsersOperation from "./users-operation";

interface Column {
    name: string;
    uid: string;
    sortable?: boolean;
}

const columns: Column[] = [
    { name: "Username", uid: "username", sortable: true },
    { name: "ID", uid: "id", sortable: true },
    { name: "Email", uid: "email", sortable: true },
    { name: "Role", uid: "role" },
    { name: "Created", uid: "created", sortable: true },
    { name: "Actions", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["id", "username", "email", "role", "actions"];

export type PartialUser = {
    id: string;
    username: string;
    email: string;
    role: DBUser["role"];
    created: string;
    image: string | null;
};

interface PageProps extends DefaultProps {
    data: PartialUser[];
    authUser: ClerkUser;
}

function UsersTable({ data, authUser }: PageProps) {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
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
        let filteredUsers = [...data];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) => {
                return user.username
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            });
        }

        return filteredUsers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [filteredItems, page, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const sorter = sortDescriptor.column!;

            const first = a[sorter as keyof PartialUser] as unknown as number;
            const second = b[sorter as keyof PartialUser] as unknown as number;

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback((user: PartialUser, columnKey: Key) => {
        const cellValue = user[columnKey as keyof PartialUser];

        switch (columnKey) {
            case "username": {
                return (
                    <User
                        avatarProps={{
                            radius: "sm",
                            src: user.image ?? defaultUserPFP.src,
                        }}
                        name={cellValue}
                    />
                );
            }

            case "id": {
                return <span>{cellValue}</span>;
            }

            case "email": {
                return <span>{cellValue}</span>;
            }

            case "role": {
                return <span>{cellValue?.toUpperCase()}</span>;
            }

            case "created": {
                return (
                    <span>{formatDate(new Date(cellValue!).getTime())}</span>
                );
            }

            case "actions": {
                return (
                    <div className="flex items-center justify-end">
                        <UsersOperation data={user} authUser={authUser} />
                    </div>
                );
            }

            default: {
                return null;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        placeholder="Search by username..."
                        startContent={<Icons.search />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        radius="sm"
                    />

                    <div className="flex items-center gap-2">
                        <UsersMassManage keys={selectedKeys} />

                        <Dropdown>
                            <DropdownTrigger className="sm:flex">
                                <Button
                                    endContent={
                                        <Icons.chevronDown className="text-small" />
                                    }
                                    variant="flat"
                                    radius="sm"
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
                            Total {data.length} users
                        </p>
                    </div>
                    <div className="w-full max-w-[44%] md:max-w-[20%]">
                        <Select
                            label="Rows per page"
                            onChange={onRowsPerPageChange}
                            radius="sm"
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
                    color="primary"
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
            radius="sm"
            aria-label="Example table with custom cells, pagination and sorting"
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

            <TableBody emptyContent={"No users found"} items={sortedItems}>
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

export default UsersTable;
