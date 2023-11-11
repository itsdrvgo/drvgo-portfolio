"use client";

import { BitFieldPermissions, DEFAULT_USER_IMAGE } from "@/src/config/const";
import { formatDate, hasPermission } from "@/src/lib/utils";
import { ClerkUserWithoutEmail } from "@/src/lib/validation/user";
import { Column, DefaultProps } from "@/src/types";
import { CachedRole, CachedUser } from "@/src/types/cache";
import {
    Button,
    Chip,
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
import UsersMassManageButton from "./users-mass-manage-button";
import UsersOperation from "./users-operation";

const rawColumns: Column[] = [
    { name: "Username", uid: "username", sortable: true },
    { name: "ID", uid: "id", sortable: true },
    { name: "Email", uid: "email", sortable: true },
    { name: "Roles", uid: "roles" },
    { name: "Created", uid: "createdAt", sortable: true },
    { name: "Strikes", uid: "strikes", sortable: true },
    { name: "Actions", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "username",
    "roles",
    "actions",
    "strikes",
    "createdAt",
];

interface PageProps extends DefaultProps {
    users: CachedUser[];
    user: ClerkUserWithoutEmail;
    roles: CachedRole[];
}

function UsersTable({ users, user, roles }: PageProps) {
    const [columns, setColumns] = useState<Column[]>(rawColumns);

    useEffect(() => {
        const hasPerms = hasPermission(
            user.privateMetadata.permissions,
            BitFieldPermissions.Administrator
        );
        if (!hasPerms) {
            setColumns((prev) =>
                prev.filter((column) => column.uid !== "email")
            );
        }
    }, [user.privateMetadata.permissions]);

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
    }, [columns, visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((u) => {
                return u.username
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            });
        }

        return filteredUsers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [filteredItems, page, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const sorter = sortDescriptor.column!;

            const first = a[sorter as keyof CachedUser] as unknown as number;
            const second = b[sorter as keyof CachedUser] as unknown as number;

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback(
        (target: CachedUser, columnKey: Key) => {
            const cellValue = target[columnKey as keyof CachedUser];
            const targetRoles = roles
                .filter((role) => target.roles.includes(role.key))
                .sort((a, b) => b.permissions - a.permissions);

            switch (columnKey) {
                case "username": {
                    return (
                        <User
                            avatarProps={{
                                src: target.image ?? DEFAULT_USER_IMAGE.src,
                            }}
                            name={cellValue as string}
                        />
                    );
                }

                case "id": {
                    return <span>{cellValue as string}</span>;
                }

                case "email": {
                    return <span>{cellValue as string}</span>;
                }

                case "roles": {
                    return (
                        <div className="flex flex-wrap items-center gap-2">
                            {targetRoles.map((role) => (
                                <Chip
                                    key={role.key}
                                    color={
                                        role.permissions &
                                        BitFieldPermissions.Administrator
                                            ? "success"
                                            : role.permissions &
                                              BitFieldPermissions.ManagePages
                                            ? "warning"
                                            : role.permissions &
                                              (BitFieldPermissions.ManageRoles |
                                                  BitFieldPermissions.ManageBlogs |
                                                  BitFieldPermissions.ManageUsers)
                                            ? "primary"
                                            : role.permissions &
                                              BitFieldPermissions.ViewPrivatePages
                                            ? "secondary"
                                            : "default"
                                    }
                                    variant="dot"
                                    size="sm"
                                >
                                    {role.name}
                                </Chip>
                            ))}
                        </div>
                    );
                }

                case "strikes": {
                    return <span>{target.strikes}</span>;
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
                            <UsersOperation
                                target={target}
                                user={user}
                                roles={roles}
                            />
                        </div>
                    );
                }

                default: {
                    return null;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        placeholder="Search by username..."
                        startContent={<Icons.search className="h-4 w-4" />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />

                    <div className="flex items-center gap-2">
                        <UsersMassManageButton keys={selectedKeys} />

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
                            Total {users.length} users
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
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        users.length,
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
            aria-label="Users Table"
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
