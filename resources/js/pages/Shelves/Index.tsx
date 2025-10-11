"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useForm } from '@inertiajs/react';
import {
    Eye,
    Pencil,
    Trash,
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import {
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from '@/components/DataTable';

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
    shelves?: Shelf[];
    flash?: {
        message?: string;
        type?: "success" | "error";
    };
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

const breadcrumbs = [
    { title: "Shelves", href: route("shelves.index") },
];

const getColumns = (
    setShelfToDelete: React.Dispatch<React.SetStateAction<Shelf | null>>,
    processing: boolean,
    setRowModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRow: React.Dispatch<React.SetStateAction<Shelf | null>>
): ColumnDef<Shelf>[] => [
    {
        id: "actions",
        enableHiding: false,
        enableGlobalFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
            const shelf = row.original;
            return (
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
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuItem asChild>
                                        <Link href={route("shelves.show", shelf.id)}>
                                            <Button variant="ghost" className="h-4 w-4 p-0">
                                                <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                            </Button>
                                        </Link>
                                    </DropdownMenuItem>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                    View Shelf
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuItem asChild>
                                        <Link href={route("shelves.edit", shelf.id)}>
                                            <Button variant="ghost" className="h-4 w-4 p-0">
                                                <Pencil className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                            </Button>
                                        </Link>
                                    </DropdownMenuItem>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                    Edit
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-4 w-4 p-0 text-red-600 dark:text-red-300"
                                        onClick={() => setShelfToDelete(shelf)}
                                        disabled={processing}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className={commonStyles.tooltipBg}>
                                    Delete
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
                onClick={(e) => {
                    e.stopPropagation();
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
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
            <button
                className={`${commonStyles.text} px-3 cursor-pointer`}
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
                className={`${commonStyles.button} text-indigo-600 dark:text-indigo-300`}
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
                    className={`${commonStyles.text} px-3 cursor-pointer`}
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
                                        href={route("bookcases.show", { bookcase: bookcase.id })}
                                        className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Navigate to bookcase ${bookcase.code} at route /bookcases/${bookcase.id}`}
                                    >
                                        {bookcase.code}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent className={commonStyles.tooltipBg}>
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
            const shelf = row.original;
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className={`${commonStyles.text} px-3 cursor-pointer`}
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
            );
        },
        filterFn: (row, id, value) => String(row.getValue(id)).includes(String(value)),
    },
];

export default function ShelvesIndex({ shelves = [], flash, isSuperLibrarian = false }: ShelvesIndexProps) {
    const { processing } = useForm();
    const [shelfToDelete, setShelfToDelete] = useState<Shelf | null>(null);
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Shelf | null>(null);

    const columns = useMemo(
        () => getColumns(setShelfToDelete, processing, setRowModalOpen, setSelectedRow),
        [processing]
    );

    const modalFields = (item: Shelf) => (
        <>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Bookcase:</strong>{" "}
                {item.bookcase ? (
                    <Link
                        href={route("bookcases.show", { bookcase: item.bookcase.id })}
                        className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                        aria-label={`Navigate to bookcase ${item.bookcase.code} at route /bookcases/${item.bookcase.id}`}
                    >
                        {item.bookcase.code}
                    </Link>
                ) : (
                    "N/A"
                )}
            </p>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Books Count:</strong>{" "}
                {item.books_count || 0}
            </p>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Books:</strong>{" "}
                {item.books && item.books.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {item.books.map((book) => (
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
        </>
    );

    const tooltipFields = (item: Shelf) => (
        <>
            <p>
                <strong className="text-indigo-200">Code:</strong> {item.code}
            </p>
            <p>
                <strong className="text-indigo-200">Bookcase:</strong> {item.bookcase?.code || "N/A"}
            </p>
            <p>
                <strong className="text-indigo-200">Books Count:</strong> {item.books_count || 0}
            </p>
            <Card className="border-indigo-200 dark:border-indigo-600 bg-white dark:bg-gray-800">
                <CardContent className="p-0">
                    <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 p-2">
                        Books in {item.code}
                    </h3>
                    {item.books && item.books.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 text-base text-gray-700 dark:text-gray-200 p-2">
                            {item.books.map((book) => (
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
        </>
    );

    return (
        <DataTable
            data={shelves}
            columns={columns}
            breadcrumbs={breadcrumbs}
            title="List of Shelves"
            resourceName="shelves"
            routes={{
                index: route("shelves.index"),
                create: route("shelves.create"),
                show: (id) => route("shelves.show", id),
                edit: (id) => route("shelves.edit", id),
                destroy: (id) => route("shelves.destroy", id),
            }}
            flash={flash}
            modalFields={modalFields}
            tooltipFields={tooltipFields}
            isSuperLibrarian={isSuperLibrarian}
        />
    );
}
