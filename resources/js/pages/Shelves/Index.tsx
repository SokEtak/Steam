"use client";

import { useState, useEffect } from "react";
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
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    CheckCircle2Icon,
    Eye,
    Pencil,
    Plus,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronDown,
    MoreHorizontal,
    ArrowLeft,
    ArrowRight,
    X,
} from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Book {
    id: number;
    title: string;
    code: string;
    isbn: string;
    is_available: boolean;
}

interface Bookcase {
    id: number;
    code: string;
}

interface Shelf {
    id: number;
    code: string;
    bookcase_id: number;
    bookcase: Bookcase | null;
    books_count: number;
    books: Book[] | null;
}

interface ShelvesIndexProps {
    shelves: Shelf[];
    flash: {
        message: string | null;
    };
    isSuperLibrarian: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Shelves", href: route("shelves.index") },
];

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

const getColumns = (
    setShelfToDelete: React.Dispatch<React.SetStateAction<Shelf | null>>,
    processing: boolean,
    setRowModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRow: React.Dispatch<React.SetStateAction<Shelf | null>>
): ColumnDef<Shelf>[] => {
    return [
        {
            id: "actions",
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
            cell: ({ row }) => {
                const shelf = row.original;
                return (
                    <TooltipProvider>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`${commonStyles.button} h-8 w-8 p-0 text-indigo-600 dark:text-indigo-300`}
                                    disabled={processing}
                                    aria-label={`Open menu for shelf ${shelf.code}`}
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
                                            <DropdownMenuItem asChild>
                                                <Link href={route("shelves.show", shelf.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-4 w-4 p-0"
                                                    >
                                                        <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            align="center"
                                            className={commonStyles.tooltipBg}
                                        >
                                            View Shelf
                                        </TooltipContent>
                                    </Tooltip>
                                    {/* Edit Button */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuItem asChild>
                                                <Link href={route("shelves.edit", shelf.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-4 w-4 p-0"
                                                    >
                                                        <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                    </Button>
                                                </Link>
                                            </DropdownMenuItem>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            align="center"
                                            className={commonStyles.tooltipBg}
                                        >
                                            Edit
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
            accessorKey: "code",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    Code
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => (
                <button
                    className="px-3 cursor-pointer text-gray-800 dark:text-gray-100 text-sm"
                    onClick={() => {
                        setRowModalOpen(true);
                        setSelectedRow(row.original);
                    }}
                    role="button"
                    aria-label={`View details for shelf ${row.getValue("code")}`}
                >
                    {row.getValue("code")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "bookcase",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    Bookcase
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const bookcase = row.original.bookcase;
                return (
                    <button
                        className="px-3 cursor-pointer"
                        onClick={() => {
                            setRowModalOpen(true);
                            setSelectedRow(row.original);
                        }}
                        role="button"
                        aria-label={
                            bookcase
                                ? `View details for shelf with bookcase ${bookcase.code}`
                                : "View details for shelf with no bookcase"
                        }
                    >
                        {bookcase ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={route("bookcases.show", { id: bookcase.id })}
                                            className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                            aria-label={`Navigate to bookcase ${bookcase.code} at route /bookcases/${bookcase.id}`}
                                        >
                                            {bookcase.code}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-gradient-to-br from-blue-900 to-teal-600 text-white rounded-xl"
                                    >
                                        Navigate to /bookcases/{bookcase.id}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <span className="text-red-500 dark:text-red-400 text-sm">N/A</span>
                        )}
                    </button>
                );
            },
            filterFn: (row, id, value) => {
                const bookcaseCode = row.original.bookcase?.code || "N/A";
                return bookcaseCode.toLowerCase().includes(String(value).toLowerCase());
            },
            sortingFn: (rowA, rowB) => {
                const codeA = rowA.original.bookcase?.code || "N/A";
                const codeB = rowB.original.bookcase?.code || "N/A";
                return codeA.localeCompare(codeB);
            },
        },
        {
            accessorKey: "books_count",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    Books Count
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const shelf = row.original;
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="px-3 cursor-pointer text-gray-800 dark:text-gray-100 text-sm"
                                    onClick={() => {
                                        setRowModalOpen(true);
                                        setSelectedRow(row.original);
                                    }}
                                    role="button"
                                    aria-label={`View details for shelf with ${row.getValue("books_count") || 0} books`}
                                >
                                    {row.getValue("books_count") || 0}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className={`${commonStyles.tooltipBg} max-w-sm shadow-xl`}>
                                <Card className="border-indigo-200 dark:border-indigo-600 bg-white dark:bg-gray-800">
                                    <CardContent className="p-0">
                                        <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 p-2">
                                            Books in {shelf.code}
                                        </h3>
                                        {shelf.books && shelf.books.length > 0 ? (
                                            <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-200 p-2">
                                                {shelf.books.map((book) => (
                                                    <li key={book.id} className="whitespace-nowrap">
                                                        <Link
                                                            href={route("books.show", { book: book.id })}
                                                            className="text-indigo-600 dark:text-indigo-300 hover:underline"
                                                        >
                                                            {book.title}
                                                        </Link>
                                                        <span
                                                            className={`ml-2 ${
                                                                book.is_available
                                                                    ? "text-green-600 dark:text-green-400"
                                                                    : "text-red-600 dark:text-red-400"
                                                            }`}
                                                        >
                                                            {" "}
                                                            ({book.code})
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-600 dark:text-gray-300 p-2">
                                                No books in this shelf.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
            filterFn: (row, id, value) => String(row.getValue(id)).includes(String(value)),
        },
    ];
};

export default function ShelvesIndex({ shelves, flash,isSuperLibrarian }: ShelvesIndexProps) {
    const { processing } = useForm();
    const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
    const [showAlert, setShowAlert] = useState(!!flash.message);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: true,
        code: true,
        bookcase: true,
        books_count: true,
    });
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Shelf | null>(null);

    const columns = getColumns(setShelfToDelete, processing, setRowModalOpen, setSelectedRow);

    const table = useReactTable({
        data: shelves || [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const search = String(filterValue).toLowerCase();
            const id = String(row.original.id);
            const code = String(row.original.code).toLowerCase();
            const bookcaseCode = row.original.bookcase?.code?.toLowerCase() || "n/a";
            const booksCount = String(row.original.books_count || 0);
            const books = row.original.books || [];
            const bookTitles = books.map(book => book.title.toLowerCase()).join(" ");
            const bookCodes = books.map(book => book.code.toLowerCase()).join(" ");
            return (
                id.includes(search) ||
                code.includes(search) ||
                bookcaseCode.includes(search) ||
                booksCount.includes(search) ||
                bookTitles.includes(search) ||
                bookCodes.includes(search)
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
            pagination: {
                pageSize: 10,
            },
        },
    });

    useEffect(() => {
        if (flash.message) setShowAlert(true);
        const timer = setTimeout(() => {
            setIsTableLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [flash.message, shelves]);

    const handleCloseAlert = () => setShowAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Shelves" />
            <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Input
                                        placeholder="Search"
                                        value={globalFilter ?? ""}
                                        onChange={(event) => setGlobalFilter(event.target.value)}
                                        className="max-w-sm flex-grow sm:flex-grow-0 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-indigo-200 dark:border-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg text-sm"
                                        disabled={isTableLoading || processing}
                                        aria-label="Search shelves"
                                    />
                                </TooltipTrigger>
                                <TooltipContent
                                    className="bg-gradient-to-br from-blue-900 to-teal-600 text-white rounded-xl"
                                >
                                    Enter keywords to filter shelves
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">

                        {!isSuperLibrarian && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("shelves.create")}>
                                                <Button
                                                    size="sm"
                                                    className="bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg text-sm"
                                                    disabled={isTableLoading || processing}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="bg-gradient-to-br from-blue-900 to-teal-600 text-white rounded-xl"
                                        >
                                            Add a new shelf
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg text-sm"
                                                disabled={isTableLoading || processing}
                                            >
                                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-gradient-to-br from-blue-900 to-teal-600 text-white rounded-xl"
                                    >
                                        Click to Show or Hide Specific Columns
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent
                                align="end"
                                className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 border-indigo-200 dark:border-indigo-600 rounded-xl"
                            >
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize text-gray-800 dark:text-gray-100 text-sm"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            disabled={isTableLoading || processing}
                                        >
                                            {column.id.replace(/_/g, " ")}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-center">
                        {isTableLoading ? (
                            <Skeleton className="h-4 w-32" />
                        ) : (
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                {`${table.getFilteredRowModel().rows.length} filtered out of ${shelves.length} shelves`}
              </span>
                        )}
                    </div>
                </div>
                {showAlert && flash.message && (
                    <Alert
                        className="mb-4 flex items-start justify-between bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-xl"
                    >
                        <div className="flex gap-2">
                            <CheckCircle2Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                            <div>
                                <AlertTitle className="text-indigo-600 dark:text-indigo-300 text-sm">New Notification</AlertTitle>
                                <AlertDescription className="text-gray-600 dark:text-gray-300 text-sm">{flash.message}</AlertDescription>
                            </div>
                        </div>
                        <Button
                            onClick={handleCloseAlert}
                            className="text-sm font-medium cursor-pointer text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
                            disabled={processing}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </Alert>
                )}
                <div className="rounded-md border border-indigo-200 dark:border-indigo-700">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="bg-indigo-50 dark:bg-indigo-900"
                                >
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
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TooltipProvider key={row.id}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <TableRow
                                                    className="hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        setRowModalOpen(true);
                                                        setSelectedRow(row.original);
                                                    }}
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="text-gray-800 dark:text-gray-100 text-sm py-2"
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="left"
                                                className="max-w-md bg-gradient-to-br from-blue-900 to-teal-600 text-white p-4 rounded-xl shadow-xl"
                                            >
                                                <div className="space-y-2">
                                                    <p>
                                                        <strong className="text-indigo-200">Code:</strong> {row.original.code}
                                                    </p>
                                                    <p>
                                                        <strong className="text-indigo-200">Bookcase:</strong>{" "}
                                                        {row.original.bookcase?.code || "N/A"}
                                                    </p>
                                                    <p>
                                                        <strong className="text-indigo-200">Books Count:</strong>{" "}
                                                        {row.original.books_count || 0}
                                                    </p>
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
                                        No shelves found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-center gap-2 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center space-x-2">
              <span className="text-sm font-medium whitespace-nowrap text-gray-800 dark:text-gray-100">
                Rows per page:
              </span>
                            <Select
                                value={String(table.getState().pagination.pageSize)}
                                onValueChange={(value) => {
                                    if (value === "All") {
                                        table.setPageSize(table.getFilteredRowModel().rows.length);
                                    } else {
                                        table.setPageSize(Number(value));
                                    }
                                }}
                                disabled={isTableLoading || processing}
                            >
                                <SelectTrigger
                                    className="h-8 w-[120px] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-indigo-200 dark:border-indigo-600 rounded-lg text-sm"
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
                                            disabled={!table.getCanPreviousPage() || isTableLoading || processing}
                                            className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-gradient-to-br from-blue-900 to-teal-600 text-white rounded-xl"
                                    >
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
                                            disabled={!table.getCanNextPage() || isTableLoading || processing}
                                            className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-gradient-to-br from-blue-900 to-teal-600 text-white rounded-xl"
                                    >
                                        Next Page
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="text-sm text-gray-800 dark:text-gray-100">
                            {isTableLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount() || 1}`
                            )}
                        </div>
                    </div>
                </div>
                <Dialog open={rowModalOpen} onOpenChange={setRowModalOpen}>
                    <DialogContent
                        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl md:max-w-lg sm:max-w-[90%] max-w-[95%] p-6 transition-all duration-300"
                    >
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                                {selectedRow?.code || "Shelf Details"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-1 gap-2">
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Code:</strong>{" "}
                                    {selectedRow?.code || "N/A"}
                                </p>
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Bookcase:</strong>{" "}
                                    {selectedRow?.bookcase ? (
                                        <Link
                                            href={route("bookcases.show", { id: selectedRow.bookcase.id })}
                                            className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                                            aria-label={`Navigate to bookcase ${selectedRow.bookcase.code} at route /bookcases/${selectedRow.bookcase.id}`}
                                        >
                                            {selectedRow.bookcase.code}
                                        </Link>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Books Count:</strong>{" "}
                                    {selectedRow?.books_count || 0}
                                </p>
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Books:</strong>{" "}
                                    {selectedRow?.books && selectedRow.books.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {selectedRow.books.map((book) => (
                                                <li key={book.id}>
                                                    <Link
                                                        href={route("books.show", { book: book.id })}
                                                        className="text-indigo-600 dark:text-indigo-300 hover:underline"
                                                    >
                                                        {book.title}
                                                    </Link>
                                                    <span
                                                        className={`ml-2 ${
                                                            book.is_available
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                        }`}
                                                    >
                                                        (Code: {book.code})
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        "No books in this shelf."
                                    )}
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
