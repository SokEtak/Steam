"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2Icon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    Plus,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    ArrowLeft,
    ArrowRight,
    ChevronDown, X
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
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from '@/components/ui/dialog';

interface Category {
    id: number;
    name: string;
}

interface Subcategory {
    id: number;
    name: string;
    category: Category | null;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    subcategories: Subcategory[];
    flash: {
        message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Subcategories", href: route("subcategories.index") },
];

const getColumns = (
    setSubcategoryToDelete: React.Dispatch<React.SetStateAction<Subcategory | null>>,
    processing: boolean,
    setRowModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRow: React.Dispatch<React.SetStateAction<Subcategory | null>>
): ColumnDef<Subcategory>[] => {
    return [
        {
            id: "actions",
            enableHiding: false,
            enableGlobalFilter: false,
            enableSorting: false,
            cell: ({ row }) => {
                const subcategory = row.original;
                return (
                    <TooltipProvider>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-auto min-w-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 border-indigo-200 dark:border-indigo-600 rounded-xl">
                                <div className="flex flex-col items-center gap-1 px-1 py-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("subcategories.show", subcategory.id)} onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" className="h-4 w-4 p-0">
                                                    <EyeIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                            View Subcategory
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={route("subcategories.edit", subcategory.id)} onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" className="h-4 w-4 p-0">
                                                    <PencilIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                            Edit
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-4 w-4 p-0 text-red-600 dark:text-red-300"
                                                onClick={() => setSubcategoryToDelete(subcategory)}
                                                disabled={processing}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                            Delete
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
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    ID
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
                >
                    {row.getValue("id")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).includes(String(value)),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    Name
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
                >
                    {row.getValue("name")}
                </button>
            ),
            filterFn: (row, id, value) => String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    Category
                    {{
                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                    }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
                </Button>
            ),
            cell: ({ row }) => {
                const category = row.original.category;
                return (
                    <span className="px-3">
                        {category ? (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={route("categories.show", category.id)}
                                            className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                            aria-label={`Navigate to category ${category.name} at route /categories/${category.id}`}
                                        >
                                            {category.name}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Navigate to /categories/{category.id}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ) : (
                            <span className="text-red-500 dark:text-red-400 text-sm">Unknown</span>
                        )}
                    </span>
                );
            },
            filterFn: (row, id, value) => {
                const categoryName = row.original.category?.name || "Unknown";
                return categoryName.toLowerCase().includes(String(value).toLowerCase());
            },
            sortingFn: (rowA, rowB) => {
                const nameA = rowA.original.category?.name || "Unknown";
                const nameB = rowB.original.category?.name || "Unknown";
                return nameA.localeCompare(nameB);
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    Created At
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
                >
                    {new Date(row.getValue("created_at")).toLocaleString()}
                </button>
            ),
            filterFn: (row, id, value) =>
                new Date(row.getValue(id)).toLocaleString().toLowerCase().includes(String(value).toLowerCase()),
        },
        {
            accessorKey: "updated_at",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation();
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                    className="text-indigo-600 dark:text-indigo-300 text-sm"
                >
                    Last Modified
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
                >
                    {new Date(row.getValue("updated_at")).toLocaleString()}
                </button>
            ),
            filterFn: (row, id, value) =>
                new Date(row.getValue(id)).toLocaleString().toLowerCase().includes(String(value).toLowerCase()),
        },
    ];
};

export default function SubcategoriesIndex({ subcategories, flash }: PageProps) {
    const { processing } = useForm();
    const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null);
    const [showAlert, setShowAlert] = useState(!!flash.message);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: true,
        name: true,
        category: true,
        created_at: true,
        updated_at: true,
    });
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Subcategory | null>(null);

    const columns = getColumns(setSubcategoryToDelete, processing, setRowModalOpen, setSelectedRow);

    const table = useReactTable({
        data: subcategories || [],
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
            const name = String(row.original.name).toLowerCase();
            const categoryName = row.original.category?.name?.toLowerCase() || "unknown";
            const created_at = new Date(row.original.created_at).toLocaleString().toLowerCase();
            const updated_at = new Date(row.original.updated_at).toLocaleString().toLowerCase();
            return id.includes(search) || name.includes(search) || categoryName.includes(search) || created_at.includes(search) || updated_at.includes(search);
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
    }, [flash.message, subcategories]);

    const handleCloseAlert = () => setShowAlert(false);

    const confirmDelete = () => {
        if (subcategoryToDelete) {
            router.delete(route("subcategories.destroy", subcategoryToDelete.id), {
                onSuccess: () => {
                    setSubcategoryToDelete(null);
                },
                onError: () => {
                    setSubcategoryToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Subcategories" />
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
                                        aria-label="Search subcategories"
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Enter keywords to filter subcategories
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={route("subcategories.create")}>
                                        <Button size="sm" className="bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg text-sm" disabled={isTableLoading || processing}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                    Add a new subcategory
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg text-sm" disabled={isTableLoading || processing}>
                                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
                                        Click to Show or Hide Specific Columns
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end" className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 border-indigo-200 dark:border-indigo-600 rounded-xl">
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
                                {`${table.getFilteredRowModel().rows.length} filtered out of ${subcategories.length} subcategories`}
                            </span>
                        )}
                    </div>
                </div>

                {showAlert && flash.message && (
                    <Alert className="mb-4 flex items-start justify-between bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-xl">
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
                <div className="rounded-lg border border-indigo-200 dark:border-indigo-700 overflow-hidden">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-indigo-50 dark:bg-indigo-900">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="text-indigo-600 dark:text-indigo-300 text-sm">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        {isTableLoading ? (
                            <TableBody>
                                {Array.from({ length: table.getState().pagination.pageSize }).map((_, index) => (
                                    <TableRow key={index}>
                                        {columns.map((_, colIndex) => (
                                            <TableCell key={colIndex}>
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TooltipProvider key={row.id}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <TableRow
                                                        key={row.id}
                                                        className="hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            setRowModalOpen(true);
                                                            setSelectedRow(row.original);
                                                        }}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id} className="text-gray-800 dark:text-gray-100 text-sm py-2">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="left"
                                                    className="max-w-md bg-gradient-to-br from-blue-900 to-indigo-600 text-white p-4 rounded-xl shadow-xl dark:from-gray-800 dark:to-gray-600"
                                                >
                                                    <div className="space-y-2">
                                                        <p>
                                                            <strong className="text-indigo-200">ID:</strong> {row.original.id}
                                                        </p>
                                                        <p>
                                                            <strong className="text-indigo-200">Name:</strong> {row.original.name}
                                                        </p>
                                                        <p>
                                                            <strong className="text-indigo-200">Category:</strong>{" "}
                                                            {row.original.category?.name || "Unknown"}
                                                        </p>
                                                        <p>
                                                            <strong className="text-indigo-200">Created At:</strong>{" "}
                                                            {new Date(row.original.created_at).toLocaleString()}
                                                        </p>
                                                        <p>
                                                            <strong className="text-indigo-200">Last Modified:</strong>{" "}
                                                            {new Date(row.original.updated_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center text-gray-600 dark:text-gray-300 text-sm">
                                            No subcategories found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </div>

                {/* Pagination */}
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
                                <SelectTrigger className="h-8 w-[120px] bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-indigo-200 dark:border-indigo-600 rounded-lg text-sm">
                                    <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 20, 50, 100].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`} className="text-sm">
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                    {table.getFilteredRowModel().rows.length > 0 && (
                                        <SelectItem key="all" value="All" className="text-sm">
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
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
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
                                    <TooltipContent className="bg-gradient-to-br from-blue-900 to-indigo-600 text-white rounded-xl">
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

                {/* Row Details Modal */}
                <Dialog open={rowModalOpen} onOpenChange={setRowModalOpen}>
                    <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl md:max-w-lg sm:max-w-[90%] max-w-[95%] p-6 transition-all duration-300">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                                {selectedRow?.name || "Subcategory Details"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-1 gap-2">
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">ID:</strong>{" "}
                                    {selectedRow?.id || "N/A"}
                                </p>
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Name:</strong>{" "}
                                    {selectedRow?.name || "N/A"}
                                </p>
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Created At:</strong>{" "}
                                    {selectedRow ? new Date(selectedRow.created_at).toLocaleString() : "N/A"}
                                </p>
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Last Modified:</strong>{" "}
                                    {selectedRow ? new Date(selectedRow.updated_at).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!subcategoryToDelete} onOpenChange={(openState) => !openState && setSubcategoryToDelete(null)}>
                    <AlertDialogContent className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 text-gray-800 dark:text-gray-100 border border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-indigo-600 dark:text-indigo-300 text-sm">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-sm">
                                This action cannot be undone. This will permanently delete{" "}
                                <strong>{subcategoryToDelete?.name || "this subcategory"}</strong>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setSubcategoryToDelete(null)}
                                className="bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg text-sm"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                disabled={processing}
                                className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg text-sm"
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
