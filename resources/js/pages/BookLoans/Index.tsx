"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useForm } from "@inertiajs/react";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import {
    ColumnDef,
    Row,
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
import DataTable from '@/components/DataTable';

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
    return_date: string | null;
    book_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    book: Book | null;
    user: User | null;
}

interface BookLoansProps {
    bookloans?: BookLoan[] | null;
    books: Book[];
    users: User[];
    flash?: {
        message?: string | null;
        type?: "success" | "error";
    };
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
    { title: "កម្ចីសៀវភៅ", href: route("bookloans.index") },
];

const getColumns = (
    processing: boolean,
    setBookLoanToDelete: React.Dispatch<React.SetStateAction<BookLoan | null>>,
    setRowModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedRow: React.Dispatch<React.SetStateAction<BookLoan | null>>,
    setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>> // Added for dialog control
): ColumnDef<BookLoan>[] => [
    {
        id: "actions",
        enableHiding: false,
        enableGlobalFilter: false,
        enableSorting: false,
        cell: ({ row }) => {
            const bookLoan = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`${commonStyles.button} h-8 w-8 p-0 text-indigo-600 dark:text-indigo-300`}
                            disabled={processing}
                            aria-label={`Open menu for book loan ${bookLoan.id}`}
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
                            {/* View Action */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route("bookloans.show", bookLoan.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button variant="ghost" className="h-4 w-4 p-0">
                                                    <EyeIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </DropdownMenuItem>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                        View Book Loan
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Edit Action */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route("bookloans.edit", bookLoan.id)}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className="h-4 w-4 p-0"
                                                    disabled={processing}
                                                >
                                                    <PencilIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                                                </Button>
                                            </Link>
                                        </DropdownMenuItem>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                        Edit Book Loan
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Delete Action */}
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBookLoanToDelete(bookLoan);
                                                setDeleteDialogOpen(true); // Open the dialog
                                            }}
                                        >
                                            <Button
                                                variant="ghost"
                                                className="h-4 w-4 p-0"
                                                disabled={processing}
                                            >
                                                <TrashIcon className="h-4 w-4 text-red-600 dark:text-red-300" />
                                            </Button>
                                        </DropdownMenuItem>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" align="center" className={commonStyles.tooltipBg}>
                                        Delete Book Loan
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                លេខរៀង
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
                aria-label={`View details for book loan ${row.getValue("id")}`}
            >
                {row.getValue("id")}
            </button>
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
                ថ្ងៃសងសៀវភៅ
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <button
                className={`${commonStyles.text} px-5 cursor-pointer`}
                onClick={() => {
                    setRowModalOpen(true);
                    setSelectedRow(row.original);
                }}
                role="button"
                aria-label={`View details for book loan with return date ${row.getValue("return_date") || "N/A"}`}
            >
                {row.getValue("return_date") || "N/A"}
            </button>
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
                ចំណងជើងសៀវភៅ
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => {
            const book = row.original.book;
            return (
                <button
                    className={`${commonStyles.text} px-3 cursor-pointer`}
                    onClick={() => {
                        setRowModalOpen(true);
                        setSelectedRow(row.original);
                    }}
                    role="button"
                    aria-label={
                        book
                            ? `View details for book loan with book ${book.title}`
                            : "View details for book loan with no book"
                    }
                >
                    {book ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={route("books.show", book.id)}
                                        className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Maps to book ${book.title} at route /books/${book.id}`}
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
                </button>
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
                អ្នកខ្ចី
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <button
                    className={`${commonStyles.text} px-0 cursor-pointer`}
                    onClick={() => {
                        setRowModalOpen(true);
                        setSelectedRow(row.original);
                    }}
                    role="button"
                    aria-label={
                        user
                            ? `View details for book loan with user ${user.name}`
                            : "View details for book loan with no user"
                    }
                >
                    {user ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={route("users.show", user.id)}
                                        className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Maps to user ${user.name} at route /users/${user.id}`}
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
                </button>
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
                ធ្វើឡើងនៅ
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <button
                className={`${commonStyles.text} px-0 cursor-pointer`}
                onClick={() => {
                    setRowModalOpen(true);
                    setSelectedRow(row.original);
                }}
                role="button"
                aria-label={`View details for book loan created at ${new Date(row.getValue("created_at")).toLocaleString()}`}
            >
                {new Date(row.getValue("created_at")).toLocaleString()}
            </button>
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
                កែប្រែលើកចុងក្រោយ
                {{
                    asc: <ArrowUp className="ml-2 h-4 w-4" />,
                    desc: <ArrowDown className="ml-2 h-4 w-4" />,
                }[column.getIsSorted() as string] ?? <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
        ),
        cell: ({ row }) => (
            <button
                className={`${commonStyles.text} px-1 cursor-pointer`}
                onClick={() => {
                    setRowModalOpen(true);
                    setSelectedRow(row.original);
                }}
                role="button"
                aria-label={`View details for book loan updated at ${new Date(row.getValue("updated_at")).toLocaleString()}`}
            >
                {new Date(row.getValue("updated_at")).toLocaleString()}
            </button>
        ),
        filterFn: (row, id, value) =>
            new Date(row.getValue(id)).toLocaleString().toLowerCase().includes(String(value).toLowerCase()),
        sortingFn: (rowA, rowB) =>
            new Date(rowA.getValue("updated_at")).getTime() - new Date(rowB.getValue("updated_at")).getTime(),
    },
];

export default function BookLoans({ bookloans = [], flash, books, users }: BookLoansProps) {
    const { processing, delete: destroy } = useForm();
    const [bookLoanToDelete, setBookLoanToDelete] = useState<BookLoan | null>(null);
    const [rowModalOpen, setRowModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<BookLoan | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for dialog

    const columns = useMemo(
        () => getColumns(processing, setBookLoanToDelete, setRowModalOpen, setSelectedRow, setDeleteDialogOpen),
        [processing]
    );

    const globalFilterFn = (row: Row<BookLoan>, columnId: string, filterValue: string) => {
        const search = String(filterValue).toLowerCase().trim();
        if (!search) return true;
        const bookLoan = row.original;
        return (
            String(bookLoan.id).includes(search) ||
            (bookLoan.return_date || "N/A").toLowerCase().includes(search) ||
            (bookLoan.book?.title || "N/A").toLowerCase().includes(search) ||
            (bookLoan.user?.name || "N/A").toLowerCase().includes(search) ||
            new Date(bookLoan.created_at).toLocaleString().toLowerCase().includes(search) ||
            new Date(bookLoan.updated_at).toLocaleString().toLowerCase().includes(search)
        );
    };

    const modalFields = (item: BookLoan) => (
        <>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Book:</strong>{" "}
                {item.book ? (
                    <Link
                        href={route("books.show", item.book.id)}
                        className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                        aria-label={`Maps to book ${item.book.title} at route /books/${item.book.id}`}
                    >
                        {item.book.title}
                    </Link>
                ) : (
                    "N/A"
                )}
            </p>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Loaner:</strong>{" "}
                {item.user ? (
                    <Link
                        href={route("users.show", item.user.id)}
                        className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 underline text-sm"
                        aria-label={`Maps to user ${item.user.name} at route /users/${item.user.id}`}
                    >
                        {item.user.name}
                    </Link>
                ) : (
                    "N/A"
                )}
            </p>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Return Date:</strong>{" "}
                {item.return_date || "N/A"}
            </p>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Created At:</strong>{" "}
                {new Date(item.created_at).toLocaleString()}
            </p>
            <p>
                <strong className="font-semibold text-indigo-500 dark:text-indigo-300">Last Modified:</strong>{" "}
                {new Date(item.updated_at).toLocaleString()}
            </p>
        </>
    );

    const tooltipFields = (item: BookLoan) => (
        <>
            <p>
                <strong className="text-indigo-200">ID:</strong> {item.id}
            </p>
            <p>
                <strong className="text-indigo-200">Book:</strong> {item.book?.title || "N/A"}
            </p>
            <p>
                <strong className="text-indigo-200">User:</strong> {item.user?.name || "N/A"}
            </p>
            <p>
                <strong className="text-indigo-200">Return Date:</strong> {item.return_date || "N/A"}
            </p>
            <p>
                <strong className="text-indigo-200">Created At:</strong>{" "}
                {new Date(item.created_at).toLocaleString()}
            </p>
            <p>
                <strong className="text-indigo-200">Last Modified:</strong>{" "}
                {new Date(item.updated_at).toLocaleString()}
            </p>
        </>
    );

    const handleDelete = () => {
        if (bookLoanToDelete) {
            destroy(route("bookloans.destroy", bookLoanToDelete.id), {
                onFinish: () => {
                    setDeleteDialogOpen(false);
                    setBookLoanToDelete(null);
                },
            });
        }
    };

    return (
        <>
            <DataTable
                data={bookloans || []}
                columns={columns}
                breadcrumbs={breadcrumbs}
                title="Book Loans"
                resourceName="book loans"
                routes={{
                    index: route("bookloans.index"),
                    create: route("bookloans.create"),
                    show: (id) => route("bookloans.show", id),
                    edit: (id) => route("bookloans.edit", id),
                    destroy: (id) => route("bookloans.destroy", id),
                }}
                flash={flash}
                modalFields={modalFields}
                tooltipFields={tooltipFields}
                isSuperLibrarian={false}
                globalFilterFn={globalFilterFn}
            />
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className={commonStyles.gradientBg}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this book loan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the book loan
                            {bookLoanToDelete?.book ? ` for "${bookLoanToDelete.book.title}"` : ""}{" "}
                            {bookLoanToDelete?.user ? `borrowed by ${bookLoanToDelete.user.name}` : ""}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className={`${commonStyles.outlineButton} border`}
                            onClick={() => {
                                setBookLoanToDelete(null);
                                setDeleteDialogOpen(false);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className={commonStyles.indigoButton}
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
