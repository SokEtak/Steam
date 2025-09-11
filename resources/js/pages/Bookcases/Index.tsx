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
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2Icon,
    Eye,
    Pencil,
    Plus,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    X,
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
import { Card, CardContent } from "@/components/ui/card";

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

interface Book {
    id: number;
    title: string;
    code: string;
    isbn: string;
    view: number;
    is_available: boolean;
}

interface Bookcase {
    id: number;
    code: string;
    active_books_count: number | null;
    books: Book[] | null;
}

interface BookcasesIndexProps {
    bookcases?: Bookcase[];
    flash?: {
        message?: string;
        type?: "success" | "error";
    };
    isSuperLibrarian?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Bookcases", href: route("bookcases.index") },
];

const getColumns = (processing: boolean): ColumnDef<Bookcase>[] => [
    {
        id: "actions",
        enableHiding: false,
        enableGlobalFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
            const bookcase = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`${commonStyles.button} h-8 w-8 p-0`}
                            aria-label="Open actions menu"
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
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("bookcases.show", { bookcase: bookcase.id })}>
                                        <Button variant="ghost" className="h-4 w-4 p-0">
                                            <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                    View Bookcase
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("bookcases.edit", { bookcase: bookcase.id })}>
                                        <Button
                                            variant="ghost"
                                            className="h-4 w-4 p-0"
                                            disabled={processing}
                                            aria-label="Edit bookcase"
                                        >
                                            <Pencil className="h-4 w-4 mb-1 text-indigo-600 dark:text-indigo-300" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                    Edit
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
    {
        accessorKey: "code",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                Code
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <Link
                href={route("bookcases.show", { bookcase: row.original.id })}
                className={`${commonStyles.text} px-2 hover:underline`}
            >
                {row.getValue("code")}
            </Link>
        ),
        filterFn: (row, id, value) =>
            String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
    },
    {
        accessorKey: "active_books_count",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
            >
                Books Count
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => {
            const bookcase = row.original;
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href={route("bookcases.show", { bookcase: bookcase.id })}
                            className={`${commonStyles.text} px-2 hover:underline`}
                        >
                            {bookcase.active_books_count ?? 0}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={`${commonStyles.tooltipBg} max-w-sm shadow-xl`}>
                        <Card className="border-indigo-200 dark:border-indigo-600 bg-white dark:bg-gray-800">
                            <CardContent className="p-0">
                                <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 p-2">
                                    Books in {bookcase.code}
                                </h3>
                                {bookcase.books && bookcase.books.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-200 p-2">
                                        {bookcase.books.map((book) => (
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
                                        No books in this bookcase.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </TooltipContent>
                </Tooltip>
            );
        },
        filterFn: (row, id, value) => String(row.getValue(id) ?? 0).includes(String(value)),
    },
];

export default function BookcasesIndex({ bookcases = [], flash,isSuperLibrarian }: BookcasesIndexProps) {
    const [showFlashAlert, setShowFlashAlert] = useState(!!flash?.message && !!flash?.type);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: true,
        code: true,
        active_books_count: true,
    });
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");

    const columns = useMemo(() => getColumns(false), []);

    const table = useReactTable({
        data: bookcases,
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
                if (typeof window !== "undefined") {
                    try {
                        localStorage.setItem("bookcasesColumnVisibility", JSON.stringify(newState));
                    } catch (error) {
                        console.error("Failed to save column visibility to localStorage:", error);
                    }
                }
                return newState;
            });
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = String(filterValue).toLowerCase().trim();
            if (!search) return true;
            return (
                String(row.original.id).toLowerCase().includes(search) ||
                String(row.original.code).toLowerCase().includes(search) ||
                String(row.original.active_books_count ?? 0).toLowerCase().includes(search)
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
        setShowFlashAlert(!!flash?.message && !!flash?.type);
        setIsDataLoading(false);
    }, [flash, bookcases]);

    const handleCloseFlashAlert = () => setShowFlashAlert(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookcases" />
            <TooltipProvider>
                <div className="p-4 sm:p-6 lg:p-5 xl:p-2">
                    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Input
                                    placeholder="Search"
                                    value={globalFilter ?? ""}
                                    onChange={(event) => setGlobalFilter(event.target.value)}
                                    className={`${commonStyles.text} max-w-sm ${commonStyles.outlineButton} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                    disabled={isDataLoading}
                                    aria-label="Search bookcases"
                                />
                            </TooltipTrigger>
                            <TooltipContent side="left" className={commonStyles.tooltipBg}>
                                Enter keywords to filter bookcases
                            </TooltipContent>
                        </Tooltip>
                        <h1>{isSuperLibrarian}</h1>
                        {!isSuperLibrarian && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("bookcases.create")}>
                                        <Button
                                            className={`${commonStyles.button} ${commonStyles.indigoButton}`}
                                            disabled={isDataLoading}
                                            aria-label="Add a new bookcase"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top" className={commonStyles.tooltipBg}>
                                    Add a new bookcase
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                            disabled={isDataLoading}
                                            aria-label="Toggle column visibility"
                                        >
                                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
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
                                                    disabled={isDataLoading}
                                                >
                                                    {column.id.replace(/_/g, " ")}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TooltipTrigger>
                            <TooltipContent side="top" className={commonStyles.tooltipBg}>
                                Show or hide columns
                            </TooltipContent>
                        </Tooltip>
                        {isDataLoading ? (
                            <Skeleton className="h-4 w-32" />
                        ) : (
                            <span className={commonStyles.text}>
                {`${table.getFilteredRowModel().rows.length} filtered out of ${bookcases.length} bookcases`}
            </span>
                        )}
                    </div>

                    {showFlashAlert && flash?.message && flash?.type && (
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
                                {isDataLoading ? (
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
                                        <TableRow
                                            key={row.id}
                                            className="hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors"
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className={`${commonStyles.text} py-2`}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center text-gray-600 dark:text-gray-300 text-sm"
                                        >
                                            No bookcases found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-center gap-2 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center space-x-2">
                                <span className={commonStyles.text}>Rows per page:</span>
                                <Select
                                    value={String(table.getState().pagination.pageSize)}
                                    onValueChange={(value) => {
                                        table.setPageSize(Number(value));
                                    }}
                                    disabled={isDataLoading}
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
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage() || isDataLoading}
                                            className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                            aria-label="Previous page"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" className={commonStyles.tooltipBg}>
                                        Previous Page
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage() || isDataLoading}
                                            className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                            aria-label="Next page"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" className={commonStyles.tooltipBg}>
                                        Next Page
                                    </TooltipContent>
                                </Tooltip>
                                <div className={commonStyles.text}>
                                    {isDataLoading ? (
                                        <Skeleton className="h-4 w-24" />
                                    ) : (
                                        `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount() || 1}`
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TooltipProvider>
        </AppLayout>
    );
}
