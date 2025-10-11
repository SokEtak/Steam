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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DataItem {
    id: number;
    code: string;
    [key: string]: any;
}

interface DataTableProps<T extends DataItem> {
    data: T[];
    columns: ColumnDef<T>[];
    breadcrumbs: BreadcrumbItem[];
    title: string;
    resourceName: string;
    routes: {
        index: string;
        create: string;
        show: (id: number) => string;
        edit: (id: number) => string;
        destroy?: (id: number) => string;
    };
    flash?: {
        message?: string;
        type?: "success" | "error";
    };
    modalFields?: (item: T) => JSX.Element;
    tooltipFields?: (item: T) => JSX.Element;
    isSuperLibrarian?: boolean;
}

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

function DataTable<T extends DataItem>({
                                           data = [],
                                           columns,
                                           breadcrumbs,
                                           title,
                                           resourceName,
                                           routes,
                                           flash,
                                           modalFields,
                                           tooltipFields,
                                           isSuperLibrarian = false,
                                       }: DataTableProps<T>) {
    const { processing } = useForm();
    const [itemToDelete, setItemToDelete] = useState<T | null>(null);
    const [showAlert, setShowAlert] = useState(!!flash?.message && !!flash?.type);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        columns.reduce((acc, col) => {
            if (col.id && col.enableHiding !== false) {
                acc[col.id] = true;
            }
            return acc;
        }, {} as VisibilityState)
    );
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<T | null>(null);

    const table = useReactTable({
        data,
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
            const item = row.original;
            return Object.values(item).some((value) =>
                String(value).toLowerCase().includes(search)
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
        if (flash?.message && flash?.type) setShowAlert(true);
        const timer = setTimeout(() => {
            setIsTableLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [flash, data]);

    const handleCloseAlert = () => setShowAlert(false);

    const confirmDelete = () => {
        if (itemToDelete && routes.destroy) {
            router.delete(routes.destroy(itemToDelete.id), {
                onSuccess: () => setItemToDelete(null),
                onError: () => setItemToDelete(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
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
                                        className={`${commonStyles.text} max-w-sm flex-grow sm:flex-grow-0 ${commonStyles.outlineButton} focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                                        disabled={isTableLoading || processing}
                                        aria-label={`Search ${resourceName}`}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="left" className={commonStyles.tooltipBg}>
                                    Enter keywords to filter {resourceName}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isSuperLibrarian && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={routes.create}>
                                            <Button
                                                size="sm"
                                                className={`${commonStyles.button} ${commonStyles.indigoButton}`}
                                                disabled={isTableLoading || processing}
                                                aria-label={`Add a new ${resourceName.slice(0, -1)}`}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className={commonStyles.tooltipBg}>
                                        Add a new {resourceName.slice(0, -1)}
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
                                                className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                                disabled={isTableLoading || processing}
                                                aria-label="Toggle column visibility"
                                            >
                                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className={commonStyles.tooltipBg}>
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
                            <span className={commonStyles.text}>
                                {`${table.getFilteredRowModel().rows.length} filtered out of ${data.length} ${resourceName}`}
                            </span>
                        )}
                    </div>
                </div>

                {showAlert && flash?.message && flash?.type && (
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
                            onClick={handleCloseAlert}
                            className={`${commonStyles.button} ${
                                flash.type === "error"
                                    ? "text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
                                    : "text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100"
                            }`}
                            aria-label="Close alert"
                            disabled={processing}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </Alert>
                )}

                <div className="rounded-lg border-2 border-indigo-400 dark:border-indigo-500 overflow-hidden">
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
                                                            <TableCell
                                                                key={cell.id}
                                                                className={`${commonStyles.text} py-2`}
                                                            >
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="left"
                                                    className={`${commonStyles.tooltipBg} max-w-md p-4 shadow-xl`}
                                                >
                                                    <div className="space-y-2">
                                                        {tooltipFields ? (
                                                            tooltipFields(row.original)
                                                        ) : (
                                                            <>
                                                                <p>
                                                                    <strong className="text-indigo-200">ID:</strong>{" "}
                                                                    {row.original.id}
                                                                </p>
                                                                <p>
                                                                    <strong className="text-indigo-200">Code:</strong>{" "}
                                                                    {row.original.code}
                                                                </p>
                                                            </>
                                                        )}
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
                                            No {resourceName} found.
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
                            <span className={`${commonStyles.text} whitespace-nowrap`}>Rows per page:</span>
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
                                    className={`${commonStyles.text} h-8 w-[120px] ${commonStyles.outlineButton}`}
                                >
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
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage() || isTableLoading || processing}
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

                {/* Row Details Modal */}
                <Dialog open={rowModalOpen} onOpenChange={setRowModalOpen}>
                    <DialogContent
                        className={`${commonStyles.gradientBg} border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl md:max-w-lg sm:max-w-[90%] max-w-[95%] p-6 transition-all duration-300`}
                    >
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                                {selectedRow?.code || `${resourceName.slice(0, -1)} Details`}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4">
                            <div className="grid grid-cols-1 gap-2">
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">ID:</strong>{" "}
                                    {selectedRow?.id || "N/A"}
                                </p>
                                <p>
                                    <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Code:</strong>{" "}
                                    {selectedRow?.code || "N/A"}
                                </p>
                                {modalFields && selectedRow && modalFields(selectedRow)}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                {routes.destroy && (
                    <AlertDialog open={!!itemToDelete} onOpenChange={(openState) => !openState && setItemToDelete(null)}>
                        <AlertDialogContent
                            className={`${commonStyles.gradientBg} border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-2xl`}
                        >
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-indigo-600 dark:text-indigo-300 text-sm">
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-sm">
                                    This action cannot be undone. This will permanently delete{" "}
                                    <strong>{itemToDelete?.code || `this ${resourceName.slice(0, -1)}`}</strong>.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() => setItemToDelete(null)}
                                    className={`${commonStyles.button} ${commonStyles.outlineButton}`}
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={confirmDelete}
                                    disabled={processing}
                                    className={`${commonStyles.button} bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700`}
                                >
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </AppLayout>
    );
}

export default DataTable;
