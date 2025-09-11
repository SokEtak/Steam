"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import {
    CheckCircle2Icon,
    Plus,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    X,
    EyeIcon,
    PencilIcon,
    TrashIcon,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";

const commonStyles = {
    button: "rounded-lg text-sm transition-colors",
    text: "text-gray-800 dark:text-gray-100 text-sm",
    indigoButton:
        "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700",
    outlineButton:
        "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800",
    gradientBg: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900",
    tooltipBg: "bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl",
};

interface User {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
}

interface BookLoan {
    id: number;
    return_date: string;
    book_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    book: Book | null;
    user: User | null;
}

interface BookLoansProps {
    bookloans: BookLoan[] | null;
    books: Book[];
    users: User[];
    flash: {
        message: string | null;
        type?: "success" | "error";
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Book Loans", href: route("bookloans.index") },
];

const getColumns = (): ColumnDef<BookLoan>[] => [
    {
        id: "actions",
        enableHiding: false,
        enableGlobalFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
            const bookLoan = row.original;
            return (
                <TooltipProvider>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`${commonStyles.button} h-8 w-8 p-0`}
                                aria-label="Open actions menu"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="center"
                            className={`${commonStyles.gradientBg} w-auto min-w-0 dark:border-indigo-600 rounded-xl p-1`}
                        >
                            <div className="flex flex-col items-center gap-1 px-1 py-1">
                                {/* View Button */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={route("bookloans.show", bookLoan.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="ghost"
                                                className="h-4 w-4 p-0"
                                            >
                                                <EyeIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                        View Book Loan
                                    </TooltipContent>
                                </Tooltip>
                                {/* Edit Button */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={route("bookloans.edit", bookLoan.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="ghost"
                                                className="h-4 w-4 p-0"
                                            >
                                                <PencilIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                        Edit Book Loan
                                    </TooltipContent>
                                </Tooltip>
                                {/* Delete Button */}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={route("bookloans.destroy", bookLoan.id)}
                                            method="delete"
                                            as="button"
                                            className="h-4 w-4 p-0 text-red-600 dark:text-red-400 flex items-center justify-center"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                        Delete Book Loan
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                ID
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <span className={`${commonStyles.text} px-2`}>{row.getValue("id")}</span>
        ),
        filterFn: (row, id, value) => String(row.getValue(id)).includes(String(value)),
    },
    {
        accessorKey: "return_date",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                Return Date
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <span className={`${commonStyles.text} px-2`}>{row.getValue("return_date") || "N/A"}</span>
        ),
        filterFn: (row, id, value) =>
            String(row.getValue(id) || "N/A").toLowerCase().includes(String(value).toLowerCase()),
    },
    {
        accessorKey: "book",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                Book
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => {
            const book = row.original.book;
            return (
                <span className="px-2">
                    {book ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={route("books.show", { id: book.id })}
                                        className={`${commonStyles.text} text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline`}
                                        aria-label={`Navigate to book ${book.title}`}
                                    >
                                        {book.title}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className={commonStyles.tooltipBg}>
                                    Navigate to /books/{book.id}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <span className="text-red-500 dark:text-red-400 text-sm">N/A</span>
                    )}
                </span>
            );
        },
        filterFn: (row, _id, value) =>
            (row.original.book?.title || "N/A").toLowerCase().includes(String(value).toLowerCase()),
        sortingFn: (rowA, rowB) =>
            (rowA.original.book?.title || "N/A").localeCompare(rowB.original.book?.title || "N/A"),
    },
    {
        accessorKey: "user",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                User
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <span className="px-2">
                    {user ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={route("users.show", { id: user.id })}
                                        className={`${commonStyles.text} text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline`}
                                        aria-label={`Navigate to user ${user.name}`}
                                    >
                                        {user.name}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className={commonStyles.tooltipBg}>
                                    Navigate to /users/{user.id}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <span className="text-red-500 dark:text-red-400 text-sm">N/A</span>
                    )}
                </span>
            );
        },
        filterFn: (row, _id, value) =>
            (row.original.user?.name || "N/A").toLowerCase().includes(String(value).toLowerCase()),
        sortingFn: (rowA, rowB) =>
            (rowA.original.user?.name || "N/A").localeCompare(rowB.original.user?.name || "N/A"),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                Created At
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <span className={`${commonStyles.text} px-2`}>{new Date(row.getValue("created_at")).toLocaleString()}</span>
        ),
        filterFn: (row, id, value) =>
            new Date(row.getValue(id)).toLocaleString().toLowerCase().includes(String(value).toLowerCase()),
        sortingFn: (rowA, rowB) =>
            new Date(rowA.getValue("created_at")).getTime() - new Date(rowB.getValue("created_at")).getTime(),
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                Last Modified
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <span className={`${commonStyles.text} px-2`}>{new Date(row.getValue("updated_at")).toLocaleString()}</span>
        ),
        filterFn: (row, id, value) =>
            new Date(row.getValue(id)).toLocaleString().toLowerCase().includes(String(value).toLowerCase()),
        sortingFn: (rowA, rowB) =>
            new Date(rowA.getValue("updated_at")).getTime() - new Date(rowB.getValue("updated_at")).getTime(),
    },
];

export default function BookLoans({ bookloans, flash }: BookLoansProps) {
    const [showFlashAlert, setShowFlashAlert] = useState(!!flash.message);
    const [isTableLoading, setIsTableLoading] = useState(bookloans === null || bookloans === undefined);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
        const saved = localStorage.getItem("bookLoansColumnVisibility");
        return saved
            ? JSON.parse(saved)
            : { id: true, return_date: true, book: true, user: true, created_at: true, updated_at: true };
    });
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");

    const columns = useMemo(() => getColumns(), []);

    const table = useReactTable({
        data: bookloans || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: (updater) => {
            setColumnVisibility((prev) => {
                const newState = typeof updater === "function" ? updater(prev) : updater;
                localStorage.setItem("bookLoansColumnVisibility", JSON.stringify(newState));
                return newState;
            });
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = String(filterValue).toLowerCase().trim();
            if (!search) return true;
            return (
                String(row.original.id).includes(search) ||
                (row.original.return_date || "N/A").toLowerCase().includes(search) ||
                (row.original.book?.title || "N/A").toLowerCase().includes(search) ||
                (row.original.user?.name || "N/A").toLowerCase().includes(search) ||
                new Date(row.original.created_at).toLocaleString().toLowerCase().includes(search) ||
                new Date(row.original.updated_at).toLocaleString().toLowerCase().includes(search)
            );
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination,
            globalFilter,
        },
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    useEffect(() => {
        if (flash.message) setShowFlashAlert(true);
        setIsTableLoading(bookloans === null || bookloans === undefined);
    }, [flash.message, bookloans]);

    const handleCloseFlashAlert = () => setShowFlashAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Loans" />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                {/* Table Controls Section */}
                <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Input
                                    placeholder="Search"
                                    value={globalFilter ?? ""}
                                    onChange={(event) => setGlobalFilter(event.target.value)}
                                    className={`${commonStyles.text} max-w-sm ${commonStyles.outlineButton} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                    disabled={isTableLoading}
                                    aria-label="Search book loans"
                                />
                            </TooltipTrigger>
                            <TooltipContent className={commonStyles.tooltipBg}>
                                Enter keywords to filter book loans
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={route("bookloans.create")}>
                                    <Button
                                        className={`${commonStyles.button} ${commonStyles.indigoButton}`}
                                        disabled={isTableLoading}
                                        aria-label="Add a new book loan"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent className={commonStyles.tooltipBg}>
                                Go to create a new book loan
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                            disabled={isTableLoading}
                                            aria-label="Toggle column visibility"
                                        >
                                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent className={commonStyles.tooltipBg}>
                                    Show or hide columns
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DropdownMenuContent
                            align="end"
                            className={`${commonStyles.gradientBg} border-indigo-200 dark:border-indigo-600 rounded-xl`}
                        >
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className={`${commonStyles.text} capitalize`}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        disabled={isTableLoading}
                                    >
                                        {column.id.replace(/_/g, " ")}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {isTableLoading ? (
                        <Skeleton className="h-4 w-32" />
                    ) : (
                        <span className={commonStyles.text}>
                            {`${table.getFilteredRowModel().rows.length} filtered out of ${(bookloans || []).length} book loans`}
                        </span>
                    )}
                </div>

                {/* Flash Message Alert */}
                {showFlashAlert && flash.message && (
                    <Alert
                        className={`mb-4 flex items-start justify-between ${commonStyles.gradientBg} border-indigo-200 dark:border-indigo-700 rounded-xl`}
                        variant={flash.type === "error" ? "destructive" : "default"}
                    >
                        <div className="flex gap-2">
                            <CheckCircle2Icon
                                className={`h-4 w-4 ${
                                    flash.type === "error"
                                        ? "text-red-600 dark:text-red-300"
                                        : "text-indigo-600 dark:text-indigo-300"
                                }`}
                            />
                            <div>
                                <AlertTitle
                                    className={`${
                                        flash.type === "error"
                                            ? "text-red-600 dark:text-red-300"
                                            : "text-indigo-600 dark:text-indigo-300"
                                    } text-sm`}
                                >
                                    {flash.type === "error" ? "Error" : "Notification"}
                                </AlertTitle>
                                <AlertDescription className="text-gray-600 dark:text-gray-300 text-sm">
                                    {flash.message}
                                </AlertDescription>
                            </div>
                        </div>
                        <Button
                            onClick={handleCloseFlashAlert}
                            className={`${commonStyles.button} ${
                                flash.type === "error"
                                    ? "text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
                                    : "text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
                            }`}
                            aria-label="Close alert"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </Alert>
                )}

                {/* Table Section */}
                <div className="overflow-x-auto rounded-2xl border border-indigo-200 dark:border-indigo-700">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-indigo-50 dark:bg-indigo-900">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="text-indigo-600 dark:text-indigo-300 text-sm"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isTableLoading ? (
                                Array.from({ length: table.getState().pagination.pageSize }).map((_, index) => (
                                    <TableRow key={index}>
                                        {columns.map((_, colIndex) => (
                                            <TableCell key={colIndex}>
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (bookloans || []).length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TooltipProvider key={row.id}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <TableRow
                                                    className="hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
                                                    onClick={() => router.visit(route("bookloans.show", row.original.id))}
                                                    role="link"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") router.visit(route("bookloans.show", row.original.id));
                                                    }}
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id} className={`${commonStyles.text} py-2`}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TooltipTrigger>
                                            <TooltipContent className={`${commonStyles.tooltipBg} p-4 max-w-xs`}>
                                                <div className="text-sm">
                                                    <p><strong>ID:</strong> {row.original.id}</p>
                                                    <p><strong>Book:</strong> {row.original.book?.title || "N/A"}</p>
                                                    <p><strong>User:</strong> {row.original.user?.name || "N/A"}</p>
                                                    <p><strong>Return Date:</strong> {row.original.return_date || "N/A"}</p>
                                                    <p><strong>Created At:</strong> {new Date(row.original.created_at).toLocaleString()}</p>
                                                    <p><strong>Last Modified:</strong> {new Date(row.original.updated_at).toLocaleString()}</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-gray-600 dark:text-gray-300 text-sm"
                                    >
                                        No book loans found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center gap-2 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center space-x-2">
                            <span className={commonStyles.text}>Rows per page:</span>
                            <Select
                                value={String(table.getState().pagination.pageSize)}
                                onValueChange={(value) => {
                                    if (value === "All") {
                                        table.setPageSize(Math.min(table.getFilteredRowModel().rows.length, 1000));
                                    } else {
                                        table.setPageSize(Number(value));
                                    }
                                }}
                                disabled={isTableLoading}
                            >
                                <SelectTrigger
                                    className={`${commonStyles.text} h-8 w-[120px] ${commonStyles.outlineButton}`}
                                >
                                    <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50, 100].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                    {table.getFilteredRowModel().rows.length > 0 && (
                                        <SelectItem key="all" value="All">
                                            All
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage() || isTableLoading}
                                            className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                            aria-label="Previous page"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className={commonStyles.tooltipBg}>
                                        Previous Page
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage() || isTableLoading}
                                            className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                            aria-label="Next page"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className={commonStyles.tooltipBg}>
                                        Next Page
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className={commonStyles.text}>
                            {isTableLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount() || 1}`
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
